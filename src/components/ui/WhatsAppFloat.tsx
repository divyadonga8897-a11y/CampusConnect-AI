"use client";

import { motion } from "framer-motion";
import { MessageCircle, Bot } from "lucide-react";

interface WhatsAppFloatProps {
  onAIClick: () => void;
}

export default function WhatsAppFloat({ onAIClick }: WhatsAppFloatProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Tooltip */}
      <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 rounded-lg bg-navy-900 border border-white/10 text-white text-[11px] font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
        Chat with Campus AI
      </span>

      {/* Floating button */}
      <button
        onClick={onAIClick}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl hover:scale-115 active:scale-95 transition-all duration-300 glow-ai cursor-pointer border border-emerald-400/40 relative animate-float-fast"
        aria-label="Chat with Campus AI"
      >
        {/* Pulse radar rings */}
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25 pointer-events-none" />
        
        <MessageCircle className="w-7 h-7" />
        <Bot className="w-3.5 h-3.5 absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 border border-navy-950" />
      </button>
    </div>
  );
}
