import React from "react";

interface PageHeroProps {
  badge?: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  description?: React.ReactNode; // relaxed to React.ReactNode to allow JSX description blocks
  breadcrumbs?: any[];
  children?: React.ReactNode;
}

export default function PageHero({ badge, eyebrow, title, highlight, subtitle, description, children }: PageHeroProps) {
  const displayBadge = badge || eyebrow;
  return (
    <div>
      {displayBadge && <span>{displayBadge}</span>}
      <h1>
        {title} {highlight && <span>{highlight}</span>}
      </h1>
      {subtitle && <h2>{subtitle}</h2>}
      {description && <div>{description}</div>}
      {children}
    </div>
  );
}
