from app.embeddings.embedding_service import EmbeddingService
from app.vector_store.pinecone_service import PineconeService
from app.llm.groq_service import GroqService

class RagService:
    def __init__(self):
        self.embeddings = EmbeddingService()
        self.vector_store = PineconeService()
        self.llm = GroqService()
        self.top_k = 5

    def query(self, question: str, conversation_id: str = None) -> dict:
        """
        Processes a student query through the complete RAG pipeline.
        """
        if not question.strip():
            return {
                "success": False,
                "error": {
                    "code": "EMPTY_QUESTION",
                    "message": "The query question cannot be empty."
                }
            }

        # Connect and query index
        self.vector_store.ensure_index(self.embeddings.get_dimension())
        
        # 1. Generate query embedding
        query_vector = self.embeddings.embed_query(question)

        # 2. Similarity search in Pinecone
        matches = self.vector_store.query_vectors(query_vector, top_k=self.top_k)

        # 3. Guard against completely empty or unrelated context
        # Check if matches are empty or if the highest score is extremely low
        if not matches or (len(matches) > 0 and matches[0]["score"] < 0.15):
            return {
                "success": False,
                "error": {
                    "code": "NO_RELEVANT_CONTEXT",
                    "message": "I could not find this information in the current official college knowledge base."
                }
            }

        # 4. Extract context text and build source list
        context_chunks = []
        sources = []
        seen_sources = set()

        for match in matches:
            meta = match.get("metadata", {})
            text_chunk = meta.get("text", "")
            if text_chunk:
                context_chunks.append(text_chunk)
            
            src_doc = meta.get("source", "unknown_document")
            src_cat = meta.get("category", "general")
            
            if src_doc not in seen_sources:
                seen_sources.add(src_doc)
                sources.append({
                    "document": src_doc,
                    "category": src_cat
                })

        context_str = "\n\n---\n\n".join(context_chunks)

        # 5. Build prompt instructions
        system_prompt = (
            "You are CampusConnect AI, the official AI information assistant for Sri Satya Institute of Engineering and Technology (SSIET).\n\n"
            "Your job is to help prospective students and parents understand the institution.\n"
            "Use the retrieved official college knowledge as the primary source of truth.\n\n"
            "Rules:\n"
            "1. Answer using the retrieved context.\n"
            "2. Do not invent fees, admission requirements, placement statistics, facilities, or college facts.\n"
            "3. If the answer is not available in the retrieved knowledge, clearly say that the information is not available in the current official knowledge base.\n"
            "4. Never pretend to know information that was not provided.\n"
            "5. Be clear, helpful, and student-friendly.\n"
            "6. Keep answers concise but sufficiently informative.\n"
            "7. If relevant, mention the source document category.\n\n"
            f"Retrieved context:\n{context_str}"
        )

        user_prompt = f"User Question: {question}"

        # 6. Groq LLM Completion
        answer_text = self.llm.generate_completion(system_prompt, user_prompt)

        return {
            "success": True,
            "answer": answer_text,
            "sources": sources,
            "metadata": {
                "retrieval_count": len(matches)
            }
        }
