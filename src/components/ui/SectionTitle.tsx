"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionTitle({
  badge,
  title,
  highlight,
  description,
  align = "center",
  className = "",
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`${align === "center" ? "text-center" : "text-left"} ${className}`}
    >
      {badge && (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-emerald text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4 ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {badge}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
        {title}{" "}
        {highlight && (
          <span className="gradient-text-gold">{highlight}</span>
        )}
      </h2>
      {description && (
        <p className="text-navy-200 text-base sm:text-lg max-w-2xl leading-relaxed mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  );
}
