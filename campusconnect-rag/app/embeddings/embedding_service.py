from app.config import settings

class EmbeddingService:
    def __init__(self):
        self.provider = settings.EMBEDDING_PROVIDER.lower()
        self.model_name = settings.EMBEDDING_MODEL
        
        self.model = None
        if self.provider == "local":
            try:
                from sentence_transformers import SentenceTransformer
                self.model = SentenceTransformer(self.model_name)
            except Exception as e:
                print(f"[Warning] Failed to load local SentenceTransformer: {str(e)}. Fallback to mocked embeddings.")
        elif self.provider == "openai" and settings.OPENAI_API_KEY:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
            except Exception as e:
                print(f"[Warning] Failed to initialize OpenAI client: {str(e)}.")
                self.client = None

    def embed_text(self, text: str) -> list[float]:
        if self.provider == "local" and self.model:
            return self.model.encode(text).tolist()
        elif self.provider == "openai" and hasattr(self, 'client') and self.client:
            try:
                response = self.client.embeddings.create(
                    input=[text],
                    model=self.model_name
                )
                return response.data[0].embedding
            except Exception as e:
                print(f"OpenAI embedding error: {str(e)}")
        
        # Fallback/mock embeddings (size matches local or OpenAI)
        dim = 1536 if self.provider == "openai" else 384
        # Deterministic dummy vector based on hash of text
        val = sum(ord(c) for c in text) / 1000.0
        return [val * (i + 1) % 1.0 for i in range(dim)]

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        if self.provider == "local" and self.model:
            return self.model.encode(texts).tolist()
        return [self.embed_text(t) for t in texts]

    def embed_query(self, query: str) -> list[float]:
        return self.embed_text(query)

    def get_dimension(self) -> int:
        if self.provider == "openai":
            return 1536
        return 384
