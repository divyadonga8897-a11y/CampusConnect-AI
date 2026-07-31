"use client";

import React from "react";
import { motion } from "framer-motion";

export interface TimelineStep {
  id: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  date?: string;
  icon?: React.ReactNode;
  status?: "completed" | "active" | "upcoming";
}

export interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function Timeline({ steps, className = "" }: TimelineProps) {
  return (
    <div className={`relative border-l-2 border-slate-200/80 ml-4.5 pl-6.5 space-y-8 ${className}`}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;

        const statusColors = {
          completed: "bg-blue-600 border-blue-600 text-white",
          active: "bg-white border-blue-600 text-blue-600 ring-4 ring-blue-50",
          upcoming: "bg-white border-slate-300 text-slate-400",
        };

        const currentStatus = step.status || (i === 0 ? "active" : "upcoming");

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="relative"
          >
            {/* Dot indicator */}
            <span
              className={`absolute -left-[38px] top-0.5 flex h-7.5 w-7.5 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${statusColors[currentStatus]}`}
            >
              {step.icon || i + 1}
            </span>

            {/* Content card */}
            <div className="bg-white/45 backdrop-blur-xl border border-white/60 p-5 rounded-2xl shadow-sm hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] transition-all duration-300">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">{step.title}</h3>
                  {step.subtitle && (
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-400 block mt-0.5">{step.subtitle}</span>
                  )}
                </div>
                {step.date && (
                  <span className="badge badge-slate text-[10px] sm:text-[11px] shrink-0 font-bold">{step.date}</span>
                )}
              </div>
              {step.description && (
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{step.description}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
