"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  dark = false,
  className = "",
}: SectionHeaderProps) {
  const textColor  = dark ? "text-white"   : "text-slate-900";
  const descColor  = dark ? "text-slate-300" : "text-slate-500";
  const badgeBg    = dark ? "bg-white/10 text-white border-white/15" : "badge-blue";
  const alignClass = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={`flex flex-col ${alignClass} ${className}`}
    >
      {eyebrow && (
        <span className={`badge ${badgeBg} mb-4`}>
          {eyebrow}
        </span>
      )}

      <h2 className={`heading-section ${textColor} mb-4`}>
        {title}{" "}
        {highlight && (
          <span className={dark ? "gradient-text-blue-light" : "gradient-text-blue"}>
            {highlight}
          </span>
        )}
      </h2>

      {description && (
        <p className={`text-base leading-relaxed max-w-2xl ${descColor}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
