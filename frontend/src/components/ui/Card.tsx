"use client";

import React from "react";
import { motion } from "framer-motion";

export type CardVariant = "default" | "elevated" | "bordered" | "glow" | "glass";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverEffect?: boolean;
  clickable?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className = "",
      variant = "default",
      hoverEffect = true,
      clickable = false,
      onClick,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyle =
      "relative rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden transition-all duration-300";

    // Style overrides based on variants
    const variantStyles: Record<CardVariant, string> = {
      default: "bg-white/45 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.015)]",
      elevated: "border-transparent bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04),0_2px_4px_rgba(0,0,0,0.02)]",
      bordered: "border-2 border-slate-200 bg-white hover:border-blue-400",
      glow: "border-slate-200/80 bg-white hover:border-blue-500 hover:shadow-[0_0_24px_rgba(59,130,246,0.12)]",
      glass: "bg-white/45 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.015)]",
    };

    // Hover styles
    const hoverClass =
      hoverEffect && !clickable
        ? "hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:border-white/80"
        : "";

    const combinedClasses = `${baseStyle} ${variantStyles[variant]} ${hoverClass} ${clickable ? "cursor-pointer select-none" : ""
      } ${className}`;

    if (clickable) {
      return (
        <motion.div
          ref={ref as any}
          onClick={onClick}
          className={combinedClasses}
          whileHover={hoverEffect ? { y: -3, shadow: "0px 8px 30px rgba(0,0,0,0.06)" } : {}}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 450, damping: 30 }}
          {...(props as any)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={combinedClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
