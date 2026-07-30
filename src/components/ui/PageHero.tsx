"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  /** Use "light" for white bg pages, "dark" for dark bg sections */
  variant?: "light" | "dark" | "blue";
  size?: "md" | "lg";
}

export default function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  breadcrumbs,
  actions,
  variant = "light",
  size = "md",
}: PageHeroProps) {
  const paddingClass = size === "lg" ? "pt-40 pb-20" : "pt-36 pb-16";

  const bgClass =
    variant === "dark"
      ? "bg-slate-900"
      : variant === "blue"
      ? "bg-gradient-to-br from-blue-700 to-blue-900"
      : "bg-white border-b border-slate-200";

  const eyebrowClass =
    variant === "light" ? "badge-blue" : "bg-white/15 text-white border-white/20";

  const titleClass =
    variant === "light" ? "text-slate-900" : "text-white";

  const descClass =
    variant === "light" ? "text-slate-500" : "text-blue-100";

  const crumbClass =
    variant === "light" ? "text-slate-400 hover:text-slate-600" : "text-white/60 hover:text-white";

  const crumbActiveClass =
    variant === "light" ? "text-slate-700" : "text-white";

  return (
    <div className={`${bgClass} ${paddingClass}`}>
      <div className="container">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1.5 text-xs font-medium mb-6"
            aria-label="Breadcrumb"
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                {crumb.href && i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href} className={`transition-colors ${crumbClass}`}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={crumbActiveClass}>{crumb.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}

        {/* Eyebrow */}
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4"
          >
            <span className={`badge ${eyebrowClass}`}>{eyebrow}</span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className={`heading-display ${titleClass} mb-4 max-w-3xl`}
        >
          {title}{" "}
          {highlight && (
            <span className={variant === "light" ? "gradient-text-blue" : "text-amber-300"}>
              {highlight}
            </span>
          )}
        </motion.h1>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-lg leading-relaxed max-w-2xl mb-8 ${descClass}`}
          >
            {description}
          </motion.p>
        )}

        {/* Actions */}
        {actions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap gap-3"
          >
            {actions}
          </motion.div>
        )}
      </div>
    </div>
  );
}
