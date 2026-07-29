class RecursiveCharacterTextSplitter:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200, separators: list[str] = None):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = separators or ["\n\n", "\n", " ", ""]

    def split_text(self, text: str) -> list[str]:
        """
        Splits text recursively using separators, respecting chunk_size and chunk_overlap.
        """
        if len(text) <= self.chunk_size:
            return [text]

        # Find the best separator
        separator = self.separators[-1]
        for s in self.separators:
            if s in text:
                separator = s
                break

        # Split text by separator
        splits = text.split(separator) if separator != "" else list(text)
        
        chunks = []
        current_chunk = []
        current_length = 0

        for split in splits:
            split_len = len(split) + (len(separator) if current_chunk else 0)
            
            if current_length + split_len > self.chunk_size:
                if current_chunk:
                    chunks.append(separator.join(current_chunk))
                
                # Keep sliding window overlap
                # Calculate how many elements to keep for overlap
                overlap_size = 0
                overlap_chunk = []
                for item in reversed(current_chunk):
                    item_len = len(item) + (len(separator) if overlap_chunk else 0)
                    if overlap_size + item_len <= self.chunk_overlap:
                        overlap_chunk.insert(0, item)
                        overlap_size += item_len
                    else:
                        break
                
                current_chunk = overlap_chunk
                current_length = overlap_size

            current_chunk.append(split)
            current_length += split_len

        if current_chunk:
            chunks.append(separator.join(current_chunk))

        # Filter out empty or whitespace-only chunks
        return [c.strip() for c in chunks if c.strip()]
