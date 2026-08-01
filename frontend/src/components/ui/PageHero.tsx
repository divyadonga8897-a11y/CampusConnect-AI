import React from "react";

interface PageHeroProps {
  badge?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHero({ badge, eyebrow, title, subtitle, description, children }: PageHeroProps) {
  const displayBadge = badge || eyebrow;
  return (
    <div>
      {displayBadge && <span>{displayBadge}</span>}
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}
