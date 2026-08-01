import React from "react";

interface StatCardProps {
  label?: string; // made optional to cover variant props
  title?: string; // in admin dashboard we did: title="Total Courses"
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: { value: string; isPositive: boolean };
}

export function StatCard({ label, title, value, icon, description }: StatCardProps) {
  const displayLabel = label || title;
  return (
    <div>
      {icon && <span>{icon}</span>}
      <p>{value}</p>
      <p>{displayLabel}</p>
      {description && <p>{description}</p>}
    </div>
  );
}

export default StatCard;
