import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: string;
  className?: string;
}

export function Badge({ children }: BadgeProps) {
  return <span>{children}</span>;
}

export default Badge;
