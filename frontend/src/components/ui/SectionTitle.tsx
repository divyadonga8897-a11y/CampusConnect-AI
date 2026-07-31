/**
 * Backward-compatible SectionTitle shim.
 * New code should use SectionHeader instead.
 */
"use client";

import SectionHeader from "@/components/ui/SectionHeader";

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
    <SectionHeader
      eyebrow={badge}
      title={title}
      highlight={highlight}
      description={description}
      align={align}
      className={className}
    />
  );
}
