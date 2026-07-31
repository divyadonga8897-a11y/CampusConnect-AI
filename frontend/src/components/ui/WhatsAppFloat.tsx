"use client";

import { Bot, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface WhatsAppFloatProps {
  onAIClick: () => void;
}

export default function WhatsAppFloat({ onAIClick }: WhatsAppFloatProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Tooltip */}
      <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
        Ask Campus AI
      </span>

      {/* Floating button */}
      <motion.button
        onClick={onAIClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl transition-colors cursor-pointer border-2 border-white/20 relative"
        aria-label="Chat with Campus AI"
        id="floating-ai-btn"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20 pointer-events-none" />
        <Bot className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
