"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { Card } from "./Card";

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number | string;
    isPositive: boolean;
  };
  icon?: React.ElementType;
  sparklineData?: number[];
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
  sparklineData,
  className = "",
}: StatCardProps) {
  // Sparkline coordinates calculator
  const renderSparkline = (data: number[]) => {
    const width = 100;
    const height = 30;
    const padding = 2;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data
      .map((val, index) => {
        const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((val - min) / range) * (height - padding * 2) - padding;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg className="w-24 h-8 text-blue-500 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <Card variant="elevated" className={`p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-label text-slate-400 mb-1 block">{title}</span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div className="space-y-1">
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trend.isPositive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                  }`}
              >
                {trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {trend.value}
              </span>
            </div>
          )}
          {description && <p className="text-[11px] text-slate-400 font-medium leading-none">{description}</p>}
        </div>

        {sparklineData && sparklineData.length > 1 && (
          <div className="shrink-0">{renderSparkline(sparklineData)}</div>
        )}
      </div>
    </Card>
  );
}
