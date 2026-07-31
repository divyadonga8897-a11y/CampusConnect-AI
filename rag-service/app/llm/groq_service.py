import json
from groq import Groq
from app.core.config import settings

class GroqService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = "llama-3.3-70b-versatile"
        self.client = None

        if self.api_key:
            try:
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                print(f"[Warning] Failed to initialize Groq Client: {str(e)}")

    def generate_answer(self, messages: list) -> dict:
        """
        Sends message history prompt to Groq and retrieves final complete response.
        """
        if not self.client:
            # Fallback mock answer for offline/dev configurations
            return {
                "answer": "Groq client is not configured. This is a local mock response fallback.",
                "tokens_used": 0
            }

        try:
            chat_completion = self.client.chat.completions.create(
                messages=messages,
                model=self.model,
                temperature=0.1,  # Low temperature to avoid hallucination
                max_tokens=1024
            )
            answer = chat_completion.choices[0].message.content
            tokens = chat_completion.usage.total_tokens if chat_completion.usage else 0
            return {
                "answer": answer,
                "tokens_used": tokens
            }
        except Exception as e:
            print(f"[Error] Groq generation failed: {str(e)}")
            raise e

    def generate_stream(self, messages: list):
        """
        Generates progressive token chunks from Groq completion streams.
        """
        if not self.client:
            yield f"data: {json.dumps({'token': 'Groq client is not configured. (Mock Stream)', 'done': False})}\n\n"
            yield f"data: {json.dumps({'token': '', 'done': True})}\n\n"
            return

        try:
            stream = self.client.chat.completions.create(
                messages=messages,
                model=self.model,
                temperature=0.1,
                max_tokens=1024,
                stream=True
            )
            for chunk in stream:
                token = chunk.choices[0].delta.content
                if token:
                    # Event stream format
                    yield f"data: {json.dumps({'token': token, 'done': False})}\n\n"
            
            # Final token event
            yield f"data: {json.dumps({'token': '', 'done': True})}\n\n"
        except Exception as e:
            print(f"[Error] Groq stream execution failed: {str(e)}")
            yield f"data: {json.dumps({'error': str(e), 'done': True})}\n\n"
