import time
import uuid
import json
from sqlalchemy.orm import Session
from app.models.chat_history import Conversation, ChatMessage, RAGMetric
from app.embeddings.embedding_service import EmbeddingService
from app.vectorstore.pinecone_service import PineconeService
from app.llm.groq_service import GroqService
from app.schemas.chat import ChatResponse, SourceCitation

class ChatService:
    def __init__(self):
        self.embeddings = EmbeddingService()
        self.pinecone = PineconeService()
        self.groq = GroqService()

    def process_chat(self, question: str, conversation_id: str, db: Session, stream: bool = False):
        """
        Main query processing and prompt orchestration.
        """
        # Ensure conversation log exists or generate a new one
        if not conversation_id:
            conversation_id = str(uuid.uuid4())
            conv = Conversation(id=conversation_id, title=question[:50])
            db.add(conv)
            db.commit()
        else:
            conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
            if not conv:
                conv = Conversation(id=conversation_id, title=question[:50])
                db.add(conv)
                db.commit()

        # Log User Question in SQL history
        user_msg = ChatMessage(
            conversation_id=conversation_id,
            role="user",
            content=question
        )
        db.add(user_msg)
        db.commit()

        start_total = time.time()

        # 1. Embed query (Tracking metrics)
        start_embed = time.time()
        query_vector = self.embeddings.embed_text(question, is_query=True)
        embed_time = time.time() - start_embed

        # 2. Retrieve top-5 vectors from Pinecone (Tracking metrics)
        start_retrieve = time.time()
        retrieval_res = self.pinecone.search_vectors(query_vector, top_k=5)
        retrieve_time = time.time() - start_retrieve

        matches = retrieval_res.get("matches", [])
        
        # 3. Extract sources and calculate maximum similarity score
        sources = []
        context_parts = []
        max_score = 0.0

        for m in matches:
            score = m.get("score", 0.0)
            if score > max_score:
                max_score = score
            
            metadata = m.get("metadata", {})
            source_name = metadata.get("source", "Unknown Document")
            chunk_text = metadata.get("text", "")
            page_num = metadata.get("page_number")
            
            context_parts.append(chunk_text)
            
            # Keep unique sources
            if not any(s.document_name == source_name for s in sources):
                sources.append(SourceCitation(
                    document_name=source_name,
                    page_number=page_num,
                    similarity_score=score
                ))

        # 4. Hallucination Prevention Check
        # Threshold: if max similarity is below 0.30, assume no relevant document exists.
        is_fallback = max_score < 0.30 or not context_parts
        context_text = "\n\n---\n\n".join(context_parts) if not is_fallback else ""

        # 5. Build prompt
        system_instruction = (
            "You are the official CampusConnect conversational AI for Sri Satya Institute of Engineering and Technology.\n"
            "Your goal is to answer users' questions politely, concisely, and accurately based ONLY on the retrieved contexts below.\n"
            "If the information is not provided in the retrieved context, you MUST politely state that the information is unavailable in the knowledge base.\n"
            "NEVER fabricate details, stats, dates, or fee figures.\n\n"
            f"=== RETRIEVED CONTEXT ===\n{context_text}\n========================="
        )

        messages = [{"role": "system", "content": system_instruction}]

        # Load recent conversation history (last 8 messages)
        history = db.query(ChatMessage).filter(
            ChatMessage.conversation_id == conversation_id,
            ChatMessage.id != user_msg.id
        ).order_by(ChatMessage.created_at.desc()).limit(8).all()
        
        # Reverse history to arrange chronologically
        for h in reversed(history):
            messages.append({"role": h.role, "content": h.content})

        messages.append({"role": "user", "content": question})

        # 6. Stream or standard completion response
        if stream:
            return self._stream_response_generator(
                messages, conversation_id, question, embed_time, retrieve_time, start_total, sources, max_score, is_fallback, db
            )
        else:
            return self._static_response(
                messages, conversation_id, question, embed_time, retrieve_time, start_total, sources, max_score, is_fallback, db
            )

    def _static_response(self, messages, conv_id, question, t_embed, t_retrieve, start_total, sources, max_score, is_fallback, db):
        if is_fallback:
            answer = "I couldn't find this information in the CampusConnect knowledge base."
            tokens_used = 0
            llm_time = 0.0
        else:
            start_llm = time.time()
            llm_res = self.groq.generate_answer(messages)
            llm_time = time.time() - start_llm
            answer = llm_res["answer"]
            tokens_used = llm_res["tokens_used"]

        total_time = time.time() - start_total

        # Save Assistant reply to ChatMessage
        assistant_msg = ChatMessage(
            conversation_id=conv_id,
            role="assistant",
            content=answer
        )
        db.add(assistant_msg)
        
        # Save RAG performance log entry
        metric = RAGMetric(
            question=question,
            embedding_time=t_embed,
            retrieval_time=t_retrieve,
            llm_response_time=llm_time,
            total_response_time=total_time,
            tokens_used=tokens_used
        )
        db.add(metric)
        db.commit()

        return ChatResponse(
            answer=answer,
            conversation_id=conv_id,
            sources=sources,
            confidence=max_score
        )

    def _stream_response_generator(self, messages, conv_id, question, t_embed, t_retrieve, start_total, sources, max_score, is_fallback, db):
        # We yield a custom text/event-stream format.
        full_answer = ""
        tokens_count = 0
        llm_start = time.time()

        # Send initial metadata header details
        meta_init = {
            "conversation_id": conv_id,
            "sources": [{"document_name": s.document_name, "page_number": s.page_number, "similarity_score": s.similarity_score} for s in sources],
            "confidence": max_score
        }
        yield f"data: {json.dumps({'meta': meta_init})}\n\n"

        if is_fallback:
            fallback_text = "I couldn't find this information in the CampusConnect knowledge base."
            for word in fallback_text.split(" "):
                time.sleep(0.04) # Simulate progressive typing flow
                yield f"data: {json.dumps({'token': word + ' ', 'done': False})}\n\n"
            full_answer = fallback_text
            llm_time = 0.0
        else:
            # Stream tokens
            for event in self.groq.generate_stream(messages):
                if event.startswith("data: "):
                    try:
                        raw = event[6:].strip()
                        if not raw:
                            continue
                        data = json.loads(raw)
                        if "token" in data:
                            token = data["token"]
                            full_answer += token
                            tokens_count += 1
                            yield event
                    except Exception:
                        pass
            
            llm_time = time.time() - llm_start

        # Terminating event chunk
        yield f"data: {json.dumps({'token': '', 'done': True})}\n\n"

        # Log metrics and chat history
        total_time = time.time() - start_total
        
        assistant_msg = ChatMessage(
            conversation_id=conv_id,
            role="assistant",
            content=full_answer
        )
        db.add(assistant_msg)

        metric = RAGMetric(
            question=question,
            embedding_time=t_embed,
            retrieval_time=t_retrieve,
            llm_response_time=llm_time,
            total_response_time=total_time,
            tokens_used=tokens_count
        )
        db.add(metric)
        db.commit()
