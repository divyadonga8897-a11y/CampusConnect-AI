import os
from pypdf import PdfReader

class DocumentLoader:
    def load_document(self, file_path: str) -> str:
        """
        Loads document based on file extension and returns extracted text.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        _, ext = os.path.splitext(file_path.lower())
        
        if ext == ".txt":
            return self._load_txt(file_path)
        elif ext == ".pdf":
            return self._load_pdf(file_path)
        elif ext == ".docx":
            return self._load_docx(file_path)
        else:
            raise ValueError(f"Unsupported document format: {ext}")

    def _load_txt(self, file_path: str) -> str:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()

    def _load_pdf(self, file_path: str) -> str:
        reader = PdfReader(file_path)
        text_parts = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                text_parts.append(text)
        return "\n".join(text_parts)

    def _load_docx(self, file_path: str) -> str:
        try:
            import docx
            doc = docx.Document(file_path)
            return "\n".join([p.text for p in doc.paragraphs])
        except Exception as e:
            print(f"[Warning] python-docx load failed, returning empty text: {str(e)}")
            return ""
