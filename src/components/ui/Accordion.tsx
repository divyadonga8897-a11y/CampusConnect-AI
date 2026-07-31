"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, allowMultiple = false, className = "" }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((openId) => openId !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);

        return (
          <div
            key={item.id}
            className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
              isOpen ? "border-blue-200 shadow-sm" : "border-slate-200/80"
            }`}
          >
            {/* Toggle header button */}
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-4.5 text-left font-bold text-sm text-slate-800 cursor-pointer select-none"
            >
              <span>{item.title}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="text-slate-400 shrink-0"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>

            {/* Accordion content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                >
                  <div className="px-4.5 pb-4.5 pt-1 border-t border-slate-100/60 text-xs text-slate-500 leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
