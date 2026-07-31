"use client";

import React from "react";
import { motion } from "framer-motion";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link" | "glass";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  hoverLift?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      hoverLift = true,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses =
      "inline-flex items-center justify-center font-semibold transition-all duration-200 border border-transparent rounded-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

    // Variant classes
    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_2px_8px_rgba(37,99,235,0.15)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.25)] border-blue-600 hover:border-blue-700",
      secondary:
        "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-100 hover:border-slate-200",
      outline:
        "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
      ghost:
        "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-transparent",
      link:
        "bg-transparent hover:underline text-blue-600 p-0 border-transparent h-auto hover:bg-transparent shadow-none font-medium",
      glass:
        "bg-white/40 hover:bg-white/60 text-slate-800 border-white/50 backdrop-blur-md shadow-sm",
    };

    // Size classes
    const sizeClasses: Record<ButtonSize, string> = {
      xs: "px-2.5 py-1 text-[11px] leading-relaxed rounded-md gap-1.5",
      sm: "px-3.5 py-1.5 text-xs leading-relaxed rounded-md gap-2",
      md: "px-4.5 py-2.5 text-xs uppercase tracking-wider rounded-lg gap-2",
      lg: "px-6 py-3.5 text-sm uppercase tracking-wider rounded-xl gap-2.5",
    };

    // Width classes
    const widthClass = fullWidth ? "w-full" : "";

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

    // Framer motion interactive props
    const motionProps =
      disabled || isLoading
        ? {}
        : {
          whileHover: hoverLift && variant !== "link" ? { y: -1.5, scale: 1.01 } : {},
          whileTap: { scale: 0.98 },
          transition: { type: "spring", stiffness: 400, damping: 25 },
        };

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={combinedClasses}
        {...motionProps}
        {...(props as any)}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
