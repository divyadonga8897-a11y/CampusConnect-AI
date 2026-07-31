from pinecone import Pinecone
from app.core.config import settings

class EmbeddingService:
    def __init__(self):
        self.api_key = settings.PINECONE_API_KEY
        self.pc = None
        if self.api_key:
            try:
                self.pc = Pinecone(api_key=self.api_key)
            except Exception as e:
                print(f"[Warning] Failed to initialize Pinecone Client for inference: {str(e)}")

    def embed_text(self, text: str, is_query: bool = False) -> list[float]:
        """
        Embeds a single string of text using Pinecone's inference service with the
        llm-text-embedding-v2 model mapping (multilingual-e5-large).
        """
        if not text.strip():
            # Return empty/zero vector for empty lines to prevent crash
            return [0.0] * self.get_dimension()

        if self.pc:
            try:
                input_type = "query" if is_query else "passage"
                res = self.pc.inference.embed(
                    model="multilingual-e5-large", # Maps to Pinecone's high efficiency text-embedding
                    inputs=[text],
                    parameters={"input_type": input_type}
                )
                if res and res.data and len(res.data) > 0:
                    return res.data[0].embedding
            except Exception as e:
                print(f"[Warning] Pinecone cloud inference failed: {str(e)}. Falling back to deterministic vectors.")
        
        # Fallback deterministic vector if Pinecone is offline/keys are invalid (dimensions = 1024)
        dim = self.get_dimension()
        val = sum(ord(c) for c in text) / 1000.0
        return [val * (i + 1) % 1.0 for i in range(dim)]

    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        """
        Embeds a batch of texts using Pinecone's inference service.
        """
        # Filter empty texts
        clean_texts = [t for t in texts if t.strip()]
        if not clean_texts:
            return []

        if self.pc:
            try:
                res = self.pc.inference.embed(
                    model="multilingual-e5-large",
                    inputs=clean_texts,
                    parameters={"input_type": "passage"}
                )
                if res and res.data:
                    return [item.embedding for item in res.data]
            except Exception as e:
                print(f"[Warning] Pinecone batch cloud inference failed: {str(e)}. Falling back to itemized processing.")
        
        return [self.embed_text(t) for t in texts]

    def get_dimension(self) -> int:
        # Multilingual-e5-large dimensions is 1024
        return 1024
