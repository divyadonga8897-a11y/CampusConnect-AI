"use client";

import React from "react";

export type BadgeVariant = "light" | "filled" | "outline";
export type BadgeColor = "blue" | "green" | "amber" | "red" | "slate" | "indigo";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  color?: BadgeColor;
}

export function Badge({ children, className = "", variant = "light", color = "blue", ...props }: BadgeProps) {
  // Base style
  const baseStyle =
    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider select-none border";

  // Light theme colors
  const lightStyles: Record<BadgeColor, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
    slate: "bg-slate-100 text-slate-700 border-slate-200/50",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
  };

  // Filled theme colors
  const filledStyles: Record<BadgeColor, string> = {
    blue: "bg-blue-600 text-white border-blue-600",
    green: "bg-emerald-600 text-white border-emerald-600",
    amber: "bg-amber-500 text-white border-amber-500",
    red: "bg-red-600 text-white border-red-600",
    slate: "bg-slate-800 text-white border-slate-800",
    indigo: "bg-indigo-600 text-white border-indigo-600",
  };

  // Outline theme colors
  const outlineStyles: Record<BadgeColor, string> = {
    blue: "bg-transparent text-blue-600 border-blue-200",
    green: "bg-transparent text-emerald-600 border-emerald-200",
    amber: "bg-transparent text-amber-600 border-amber-300/80",
    red: "bg-transparent text-red-600 border-red-200",
    slate: "bg-transparent text-slate-500 border-slate-200",
    indigo: "bg-transparent text-indigo-600 border-indigo-200",
  };

  const variantStyles =
    variant === "filled"
      ? filledStyles[color]
      : variant === "outline"
      ? outlineStyles[color]
      : lightStyles[color];

  return (
    <span className={`${baseStyle} ${variantStyles} ${className}`} {...props}>
      {children}
    </span>
  );
}
