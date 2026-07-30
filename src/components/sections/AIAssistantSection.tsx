"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles, ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";

const sampleQuestions = [
  "What are the B.Tech CSE fees?",
  "How is the hostel facility?",
  "What companies visit for placements?",
  "What is the EAMCET cutoff for AI&DS?",
  "Tell me about the campus labs",
  "Are scholarships available?",
];

interface AIAssistantSectionProps {
  onAIClick: (question?: string) => void;
}

export default function AIAssistantSection({ onAIClick }: AIAssistantSectionProps) {
  return (
    <section className="section bg-slate-900">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Description */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-5"
            >
              <span className="badge bg-emerald-500/15 text-emerald-400 border-emerald-500/20">
                <Sparkles className="w-3 h-3" /> AI-Powered
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="heading-section text-white mb-4"
            >
              Get Instant Answers with{" "}
              <span className="gradient-text-blue-light">Campus AI</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-slate-400 text-base leading-relaxed mb-8"
            >
              Our AI assistant knows everything about SSIET — fees, courses, hostel, placements, 
              labs, and admissions. Available 24/7 to answer your questions instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-wrap gap-3"
            >
              <button
                onClick={() => onAIClick()}
                id="ai-section-chat-btn"
                className="btn btn-primary btn-lg"
              >
                <Bot className="w-4 h-4" /> Chat with Campus AI
              </button>
              <Link href="/campus-ai" className="btn btn-lg bg-white/10 text-white hover:bg-white/20 border border-white/10">
                Open Full Chat <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Right: Chat Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Campus AI</div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                  </div>
                </div>
              </div>

              {/* Sample message */}
              <div className="p-5 space-y-3">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div className="bg-slate-700/60 rounded-xl rounded-tl-none px-4 py-3 text-xs text-slate-200 leading-relaxed max-w-xs">
                    Hello! I'm the SSIET Campus AI. I can help you with courses, fees, hostel, placements and more. What would you like to know?
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="bg-blue-600 rounded-xl rounded-tr-none px-4 py-3 text-xs text-white leading-relaxed max-w-xs">
                    What is the fee for B.Tech CSE?
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div className="bg-slate-700/60 rounded-xl rounded-tl-none px-4 py-3 text-xs text-slate-200 leading-relaxed max-w-xs">
                    The B.Tech CSE annual tuition fee is <strong className="text-white">₹85,000</strong>. Including hostel, transport, and exam fees, the total is approximately <strong className="text-white">₹1.68 lakhs/year</strong>. Would you like to know about scholarships?
                  </div>
                </div>
              </div>

              {/* Sample questions */}
              <div className="px-5 pb-5 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Try asking:</div>
                <div className="flex flex-wrap gap-1.5">
                  {sampleQuestions.slice(0, 4).map((q) => (
                    <button
                      key={q}
                      onClick={() => onAIClick(q)}
                      className="text-[10px] px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors border border-slate-600 cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
