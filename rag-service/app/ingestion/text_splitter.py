class RecursiveCharacterTextSplitter:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_text(self, text: str) -> list[str]:
        if not text or not text.strip():
            return []

        separators = ["\n\n", "\n", " ", ""]
        
        def _split(text_block, current_separators):
            if len(text_block) <= self.chunk_size:
                return [text_block]
            
            if not current_separators:
                # If no separators left, split character-by-character
                splits = []
                step = self.chunk_size - self.chunk_overlap
                if step <= 0:
                    step = self.chunk_size // 2
                for i in range(0, len(text_block), step):
                    chunk = text_block[i:i + self.chunk_size]
                    if chunk.strip():
                        splits.append(chunk)
                return splits
            
            sep = current_separators[0]
            parts = text_block.split(sep)
            
            sub_chunks = []
            current_chunk = ""
            
            for part in parts:
                candidate = current_chunk + (sep if current_chunk else "") + part
                if len(candidate) <= self.chunk_size:
                    current_chunk = candidate
                else:
                    if current_chunk:
                        sub_chunks.append(current_chunk)
                    
                    # Backtrack to implement overlap
                    overlap_start = max(0, len(current_chunk) - self.chunk_overlap)
                    overlapping_text = current_chunk[overlap_start:]
                    current_chunk = overlapping_text + (sep if overlapping_text else "") + part
                    
            if current_chunk:
                sub_chunks.append(current_chunk)
                
            # If any chunk is still larger than chunk_size, recurse on it with the next separator
            final_chunks = []
            for chunk in sub_chunks:
                if len(chunk) > self.chunk_size:
                    final_chunks.extend(_split(chunk, current_separators[1:]))
                else:
                    if chunk.strip():
                        final_chunks.append(chunk)
            return final_chunks

        return _split(text, separators)
