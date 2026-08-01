import React from "react";

interface PageHeroProps {
  badge?: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  description?: React.ReactNode;
  breadcrumbs?: any[];
  actions?: React.ReactNode;
  variant?: string;
  bgImage?: string;
  children?: React.ReactNode;
  [key: string]: any; // Allow arbitrary props for compatibility
}

export default function PageHero({ badge, eyebrow, title, highlight, subtitle, description, actions, children }: PageHeroProps) {
  const displayBadge = badge || eyebrow;
  return (
    <div>
      {displayBadge && <span>{displayBadge}</span>}
      <h1>
        {title} {highlight && <span>{highlight}</span>}
      </h1>
      {subtitle && <h2>{subtitle}</h2>}
      {description && <div>{description}</div>}
      {actions && <div>{actions}</div>}
      {children}
    </div>
  );
}
