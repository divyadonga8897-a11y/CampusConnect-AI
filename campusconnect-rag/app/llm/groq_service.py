import os
from app.config import settings

try:
    from groq import Groq
except ImportError:
    Groq = None

class GroqService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.client = None
        
        if Groq and self.api_key:
            try:
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                print(f"[Warning] Failed to initialize Groq client: {str(e)}")

    def generate_completion(self, system_prompt: str, user_prompt: str) -> str:
        """
        Calls Groq API to run context-grounded completions, with smart local summarize fallbacks.
        """
        if self.client:
            try:
                chat_completion = self.client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.2, # Low temperature to prevent hallucinations
                )
                return chat_completion.choices[0].message.content
            except Exception as e:
                print(f"Groq API call error: {str(e)}. Falling back to local summarizer.")
        
        # High-Fidelity Local Summarizer Fallback:
        # Extracts key details from the prompt context and summarizes them naturally
        return self._simulate_completion(system_prompt, user_prompt)

    def _simulate_completion(self, system_prompt: str, user_prompt: str) -> str:
        # Find context in prompt string
        context_start = system_prompt.find("Retrieved context:")
        context_text = ""
        if context_start != -1:
            context_text = system_prompt[context_start:]
        
        # Simple extraction helper
        lines = context_text.split("\n")
        extracted_data = []
        for line in lines:
            if line.strip().startswith("-") or line.strip().startswith("*") or ":" in line:
                if "chunk_index" not in line and "source:" not in line:
                    extracted_data.append(line.strip())

        extracted_summary = "\n".join(extracted_data) if extracted_data else "Official documents match the query."
        
        return (
            f"[Local Simulated LLM - Grounded Response]\n\n"
            f"Based on Sri Satya Institute's official knowledge base documents:\n\n"
            f"{extracted_summary}\n\n"
            f"*This response was compiled locally using retrieved database chunks.*"
        )
