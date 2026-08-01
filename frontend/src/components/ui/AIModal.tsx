"use client";

import { useState, useRef, useEffect } from "react";
import { chatService, type ChatMessage } from "@/services/chatService";

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
}

const suggestionChips = [
  "What are the fees for B.Tech CSE?",
  "Are there sports scholarships?",
  "What is the highest placement package?",
  "Tell me about the hostel mess.",
];

export default function AIModal({ isOpen, onClose, initialQuestion }: AIModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const initialSentRef = useRef(false);

  useEffect(() => {
    if (isOpen && initialQuestion && !initialSentRef.current) {
      setTimeout(() => {
        handleSend(initialQuestion);
      }, 300);
      initialSentRef.current = true;
    }
    if (!isOpen) {
      initialSentRef.current = false;
    }
  }, [isOpen, initialQuestion]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Welcome to the SSIET Campus AI Assistant! Ask me anything about courses, fees, scholarships, or hostel life.",
        },
      ]);
    }
  }, [isOpen, messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setLoading(true);

    try {
      const historyToSend = messages.slice(1);
      const res = await chatService.sendMessage(text, historyToSend);
      setMessages((prev) => [...prev, { role: "assistant", content: res.data }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I am experiencing connection issues. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Campus AI Assistant">
      {/* Backdrop & Container */}
      <div>
        {/* Header */}
        <div>
          <h3>Ask Campus AI</h3>
          <button onClick={onClose} id="close-ai-modal">Close</button>
        </div>

        {/* Conversation Area */}
        <div>
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div key={i}>
                <div>
                  <strong>{isUser ? "You: " : "AI: "}</strong>
                  {msg.content.split("**").map((chunk, idx) =>
                    idx % 2 === 1 ? <strong key={idx}>{chunk}</strong> : chunk
                  )}
                </div>
              </div>
            );
          })}

          {loading && <div>AI is thinking...</div>}
          <div ref={scrollRef} />
        </div>

        {/* Suggestions & Input */}
        <div>
          {messages.length < 3 && !loading && (
            <div>
              {suggestionChips.map((chip) => (
                <button key={chip} onClick={() => handleSend(chip)}>
                  {chip}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
          >
            <input
              id="ai-chat-input"
              type="text"
              required
              placeholder="Ask a question..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button type="submit" disabled={loading || !inputVal.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
