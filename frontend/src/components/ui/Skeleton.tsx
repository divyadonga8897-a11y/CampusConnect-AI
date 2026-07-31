"use client";

import React from "react";

export type SkeletonVariant = "text" | "circular" | "rectangular";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = "rectangular",
  width,
  height,
  className = "",
  style,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: "h-3 w-4/5 rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  const customStyle: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
    ...style,
  };

  return (
    <div
      className={`skeleton shrink-0 ${variantClasses[variant]} ${className}`}
      style={customStyle}
      {...props}
    />
  );
}

// ── CUSTOM PREMADE LOADING TEMPLATES ──
export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-4">
      <Skeleton variant="rectangular" height={140} className="w-full" />
      <div className="space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-3.5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3.5">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="70%" />
          </div>
        </div>
      ))}
    </div>
  );
}
