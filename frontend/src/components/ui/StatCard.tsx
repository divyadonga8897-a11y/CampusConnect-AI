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
  
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return icon;
    }
    // If it's a component class or function or object (like forwardRef)
    const IconComponent = icon;
    return <IconComponent />;
  };

  return (
    <div>
      {renderIcon()}
      <p>{value}</p>
      <p>{displayLabel}</p>
      {description && <p>{description}</p>}
    </div>
  );
}

export default StatCard;
