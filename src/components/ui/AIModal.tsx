"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bot, Send, Sparkles, AlertCircle, ArrowDown } from "lucide-react";
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

  // Trigger initial question if provided when modal opens
  useEffect(() => {
    if (isOpen && initialQuestion && !initialSentRef.current) {
      // Delay slightly to ensure greeting message effect runs first
      setTimeout(() => {
        handleSend(initialQuestion);
      }, 300);
      initialSentRef.current = true;
    }
    if (!isOpen) {
      initialSentRef.current = false;
    }
  }, [isOpen, initialQuestion]);

  // Initialize with a welcome message on open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Welcome to the **SSIET Campus AI Assistant**! 🎓\n\nI can help you answer any questions regarding our **B.Tech courses, fee details, scholarships, campus hostel rooms, and placement packages**.\n\nAsk me anything or select a quick question below!",
        },
      ]);
    }
  }, [isOpen, messages]);

  // Scroll to bottom on message update
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
      const historyToSend = messages.slice(1); // Omit initial greeting from server history context
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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Campus AI Assistant"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Chat Terminal Box */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        className="relative glass rounded-2xl max-w-lg w-full h-[620px] shadow-2xl border border-emerald-500/25 flex flex-col justify-between overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-navy-950/80 border-b border-navy-800/40 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-navy-600/20 border border-emerald-500/30 flex items-center justify-center relative shrink-0">
              <Bot className="w-5 h-5 text-emerald-450" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-450 border border-navy-950 animate-pulse" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-1.5">
                Ask Campus AI
                <Sparkles className="w-3.5 h-3.5 text-gold-450" />
              </h3>
              <span className="text-[10px] text-navy-450 uppercase font-semibold tracking-wider">
                Admissions Advisor
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-ai-modal"
            className="p-2 rounded-lg glass-light text-navy-300 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 relative">
          <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none" />

          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed border ${
                    isUser
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-550/30 shadow-md shadow-emerald-550/10 rounded-tr-none"
                      : "glass-light text-navy-200 border-navy-800/40 rounded-tl-none"
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {/* Clean text representation (supports bold markers) */}
                  {msg.content.split("**").map((chunk, idx) =>
                    idx % 2 === 1 ? <strong key={idx} className="text-white font-bold">{chunk}</strong> : chunk
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Loader */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="glass-light rounded-2xl px-4 py-3 border border-navy-800/30 rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </motion.div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input & suggestions footer */}
        <div className="p-4 bg-navy-950/80 border-t border-navy-800/40 z-10 space-y-3">
          {/* Quick chips (only show when not loading and dialogue is short) */}
          {messages.length < 3 && !loading && (
            <div className="flex flex-wrap gap-1.5 justify-center py-1">
              {suggestionChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  className="px-3 py-1.5 rounded-lg glass-light text-[10px] sm:text-xs text-navy-300 hover:text-white border border-navy-850 hover:border-emerald-500/20 transition-all text-left"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Text form input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
            className="flex gap-2"
          >
            <input
              id="ai-chat-input"
              type="text"
              required
              placeholder="Ask anything about admissions, courses, hostels..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl glass-light text-white text-xs sm:text-sm placeholder:text-navy-450 border border-navy-700/35 focus:border-emerald-500/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 transition-all shadow-md shadow-emerald-500/10 shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
