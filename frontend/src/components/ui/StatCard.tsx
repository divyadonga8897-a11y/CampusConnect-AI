import React from "react";

interface StatCardProps {
  label?: string; // made optional to cover variant props
  title?: string; // in admin dashboard we did: title="Total Courses"
  value: string | number;
  icon?: any; // relaxed type to support components (Lucide icons) and ReactNodes
  description?: string;
  trend?: { value: string; isPositive: boolean };
  sparklineData?: number[]; // added compatibility prop
}

export function StatCard({ label, title, value, icon, description }: StatCardProps) {
  const displayLabel = label || title;
  const IconComponent = typeof icon === "function" ? icon : null;

  return (
    <div>
      {IconComponent ? <IconComponent /> : icon && <span>{icon}</span>}
      <p>{value}</p>
      <p>{displayLabel}</p>
      {description && <p>{description}</p>}
    </div>
  );
}

export default StatCard;
