"use client";

import React from "react";
import { Info } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Info,
  title,
  description,
  actionLabel,
  onActionClick,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`card p-10 text-center flex flex-col items-center justify-center max-w-md mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 text-slate-400">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-5 max-w-xs">{description}</p>
      {actionLabel && onActionClick && (
        <Button variant="outline" size="sm" onClick={onActionClick}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
