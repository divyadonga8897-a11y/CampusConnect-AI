# CampusConnect AI RAG Ingestion Service

A production-ready Retrieval-Augmented Generation (RAG) document processing, chunking, and indexing service built on FastAPI and Pinecone.

---

## Folder Structure

```
rag-service/
├── app/
│   ├── api/             # API routes (/upload, /ingest, /reindex, /documents, /health)
│   ├── core/            # Global database setups, settings config
│   ├── ingestion/       # Document loaders (PDF, Word, Excel) and Recursive splitter
│   ├── embeddings/      # Pinecone Cloud Inference embeddings generator
│   ├── vectorstore/     # Pinecone Client connector (Index, Upsert, Delete)
│   ├── models/          # SQLAlchemy Database logging schemas
│   ├── schemas/         # Pydantic validation schemas
│   └── main.py          # Service FastAPI startup initialization
├── uploads/             # Raw file storage folder
├── requirements.txt     # Python libraries
├── .env                 # API keys configuration
└── README.md            # Service documentation guide
```

---

## Prerequisites

Ensure you have **Python 3.12+** installed.

---

## Installation & Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment secrets**:
   Verify `.env` has active credentials:
   ```env
   PINECONE_API_KEY=your_key
   PINECONE_INDEX_NAME=campusconnect-knowledge
   DATABASE_URL=sqlite:///./rag_metadata.db
   RAG_API_PORT=8003
   ENVIRONMENT=development
   GROQ_API_KEY=your_key
   ```

3. **Start the API Server**:
   Run the microservice locally:
   ```bash
   uvicorn app.main:app --reload --port 8003
   ```

---

## API Documentation & Testing

Once running, visit **`http://localhost:8003/docs`** to access the interactive FastAPI Swagger UI for testing the REST endpoints:

*   `POST /api/v1/documents/upload` - Upload any document (`.txt`, `.pdf`, `.docx`, `.csv`, `.xlsx`, `.xls`, `.md`).
*   `POST /api/v1/documents/ingest/{id}` - Ingest, chunk, embed, and index a document in Pinecone.
*   `POST /api/v1/documents/reindex` - Wipe Pinecone and fully re-index all uploaded files.
*   `GET  /api/v1/documents/` - Fetch all document tracking rows in SQLite.
*   `DELETE /api/v1/documents/{id}` - Delete document record, disk file, and Pinecone vectors.
*   `GET  /api/v1/documents/health` - Check Pinecone, DB, and Groq connection status.

### Chat & Conversation APIs

*   **`POST /api/v1/chat/`** - Send queries to the RAG chatbot.
    *   *Request Schema*:
        ```json
        {
          "question": "What is the tuition fee for B.Tech CSE?",
          "conversation_id": "optional-uuid-string-for-history",
          "stream": false
        }
        ```
    *   *Response Schema*:
        ```json
        {
          "answer": "The annual tuition fee for B.Tech CSE is...",
          "conversation_id": "uuid-string",
          "sources": [
            {
              "document_name": "fee_structure.pdf",
              "page_number": null,
              "similarity_score": 0.895
            }
          ],
          "confidence": 0.895
        }
        ```
*   **`GET /api/v1/chat/history/{conversation_id}`** - Fetch all multi-turn message history for a given conversation.
*   **`DELETE /api/v1/chat/history/{conversation_id}`** - Wipe historical message logs.
*   **`GET /api/v1/chat/stats`** - Query performance metrics (average response time, retrieval time, query count, tokens used).

---

## Response Streaming

If calling **`POST /api/v1/chat/`** with `"stream": true`, the endpoint yields a `text/event-stream` flow. 

1. **Initial Event**: Returns document citations and max similarity score metadata:
   ```json
   data: {"meta": {"conversation_id": "uuid", "sources": [...], "confidence": 0.95}}
   ```
2. **Token Yield Events**: Returns progressively generated tokens:
   ```json
   data: {"token": "The ", "done": false}
   ```
3. **Closing Event**: Returns terminal chunk:
   ```json
   data: {"token": "", "done": true}
   ```

