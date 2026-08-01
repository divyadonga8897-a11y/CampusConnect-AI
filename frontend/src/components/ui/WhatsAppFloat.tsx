"use client";

interface WhatsAppFloatProps {
  onAIClick: () => void;
}

export default function WhatsAppFloat({ onAIClick }: WhatsAppFloatProps) {
  return (
    <button onClick={onAIClick} id="floating-ai-btn">
      Ask Campus AI
    </button>
  );
}
