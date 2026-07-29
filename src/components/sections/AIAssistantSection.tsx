"use client";

import { motion } from "framer-motion";
import { Bot, MessageCircle, MessageSquare, Sparkles, Send } from "lucide-react";

interface AIAssistantSectionProps {
  onAIClick: (initialQuestion?: string) => void;
}

export default function AIAssistantSection({ onAIClick }: AIAssistantSectionProps) {
  const exampleQuestions = [
    "What is the fee structure?",
    "What branches are available?",
    "Is hostel available?",
    "What are admission requirements?",
  ];

  return (
    <section className="relative section-padding overflow-hidden bg-navy-950">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass rounded-3xl p-8 sm:p-12 border border-emerald-500/20 text-center relative overflow-hidden shadow-2xl glow-ai"
        >
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-emerald text-emerald-300 text-xs font-bold border border-emerald-500/15 mb-6">
            <Bot className="w-3.5 h-3.5 animate-pulse" />
            24/7 AI Admissions Officer
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            Have questions about <span className="gradient-text-emerald">SSIET?</span>
          </h2>
          
          <p className="text-navy-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Ask our intelligent AI assistant about courses, fee packages, hostel rooms, admissions criteria, and recruiting companies.
          </p>

          {/* WhatsApp / Chat interface teaser */}
          <div className="max-w-md mx-auto glass rounded-2xl p-4 border border-white/5 text-left mb-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center relative shrink-0">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-navy-950 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  SSIET Campus AI Chatbot
                  <Sparkles className="w-3 h-3 text-yellow-400 fill-yellow-450" />
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold tracking-wide uppercase">Admissions Advisor</div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-2xl px-4 py-3 text-xs leading-relaxed text-navy-200 border border-white/5 relative">
              Welcome! I can answer anything about B.Tech admissions, fee concessions, and hostel facilities. Select a question below or send yours!
            </div>
          </div>

          {/* Query Chips */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-2">Select a popular question to start</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {exampleQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => onAIClick(question)}
                  className="px-4 py-2.5 rounded-xl glass-light text-xs sm:text-sm text-navy-250 font-bold hover:text-white border border-white/5 hover:border-emerald-500/30 transition-all duration-300 hover:scale-103 cursor-pointer"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Button Link */}
          <div className="mt-8">
            <button
              onClick={() => onAIClick()}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300 border border-emerald-500/20 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              Ask Campus AI
            </button>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
