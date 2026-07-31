import os

class DocumentLoader:
    def load_document(self, file_path: str) -> str:
        """
        Reads files based on file extension and returns the extracted clean text string.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found at: {file_path}")
        
        _, ext = os.path.splitext(file_path.lower())
        
        if ext in [".txt", ".md", ".markdown"]:
            return self._load_txt(file_path)
        elif ext == ".pdf":
            return self._load_pdf(file_path)
        elif ext == ".docx":
            return self._load_docx(file_path)
        elif ext == ".csv":
            return self._load_csv(file_path)
        elif ext in [".xlsx", ".xls"]:
            return self._load_excel(file_path)
        else:
            raise ValueError(f"Unsupported file format: {ext}")

    def _load_txt(self, file_path: str) -> str:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    def _load_pdf(self, file_path: str) -> str:
        try:
            import pypdf
        except ImportError:
            raise ImportError("pypdf is required for PDF parsing. Install it with pip.")
        
        reader = pypdf.PdfReader(file_path)
        text_list = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_list.append(page_text)
        return "\n\n".join(text_list)

    def _load_docx(self, file_path: str) -> str:
        try:
            import docx
        except ImportError:
            raise ImportError("python-docx is required for Word document parsing. Install it with pip.")
        
        doc = docx.Document(file_path)
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        return "\n".join(paragraphs)

    def _load_csv(self, file_path: str) -> str:
        try:
            import pandas as pd
        except ImportError:
            raise ImportError("pandas is required for CSV parsing. Install it with pip.")
        
        df = pd.read_csv(file_path)
        lines = []
        # Convert dataframe structure to text representation
        for _, row in df.iterrows():
            row_str = " | ".join([f"{col}: {val}" for col, val in row.items() if str(val).strip() and str(val).lower() != "nan"])
            if row_str.strip():
                lines.append(row_str)
        return "\n".join(lines)

    def _load_excel(self, file_path: str) -> str:
        try:
            import pandas as pd
        except ImportError:
            raise ImportError("pandas and openpyxl are required for Excel parsing. Install them with pip.")
        
        df = pd.read_excel(file_path)
        lines = []
        for _, row in df.iterrows():
            row_str = " | ".join([f"{col}: {val}" for col, val in row.items() if str(val).strip() and str(val).lower() != "nan"])
            if row_str.strip():
                lines.append(row_str)
        return "\n".join(lines)
