"use client";

import React from "react";
import { motion } from "framer-motion";

export type TabsVariant = "underline" | "pill";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: TabsVariant;
  className?: string;
}

export function Tabs({ items, activeId, onChange, variant = "underline", className = "" }: TabsProps) {
  const layoutId = React.useId();

  // Variant styles
  const navClass =
    variant === "pill"
      ? "flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 border border-slate-200/40 w-fit"
      : "flex items-center gap-6 border-b border-slate-200 w-full";

  return (
    <nav className={`${navClass} ${className}`} aria-label="Tabs">
      {items.map((item) => {
        const isActive = item.id === activeId;

        const btnClass =
          variant === "pill"
            ? `relative px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer select-none ${
                isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
              }`
            : `relative pb-3 text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer select-none ${
                isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
              }`;

        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={btnClass}
          >
            <span className="relative z-10 flex items-center gap-2">
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              {item.label}
            </span>

            {/* Sliding background/underline */}
            {isActive && (
              <motion.span
                layoutId={`tab-indicator-${layoutId}`}
                className={
                  variant === "pill"
                    ? "absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/40 z-0"
                    : "absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 z-0"
                }
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
