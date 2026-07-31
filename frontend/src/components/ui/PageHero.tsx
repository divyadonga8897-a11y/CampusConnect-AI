"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string | React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  /** Use "light" for white bg pages, "dark" for dark bg sections, "image" for photography backgrounds */
  variant?: "light" | "dark" | "blue" | "image";
  bgImage?: string;
  size?: "md" | "lg";
}

export default function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  breadcrumbs,
  actions,
  variant = "image",
  size = "md",
  bgImage,
}: PageHeroProps) {
  const isImage = variant === "image";

  // Automatic campus image mapping based on header text context
  const activeBgImage = useMemo(() => {
    if (bgImage) return bgImage;
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("library")) return "/images/campus/library-interior.png";
    if (lowerTitle.includes("lab") || lowerTitle.includes("computer")) return "/images/campus/computer-lab.png";
    if (lowerTitle.includes("sports") || lowerTitle.includes("student life") || lowerTitle.includes("life")) return "/images/campus/sports-ground.png";
    if (lowerTitle.includes("admissions") || lowerTitle.includes("apply") || lowerTitle.includes("enquiry")) return "/images/campus/library-interior.png";
    if (lowerTitle.includes("course") || lowerTitle.includes("program") || lowerTitle.includes("academic") || lowerTitle.includes("department")) return "/images/campus/academic-block.webp";
    return "/images/campus/ssiet-campus-hero.png"; // Fallback generic campus Entrance
  }, [bgImage, title]);
  
  // Standard spacing inside hero container
  const paddingClass = isImage 
    ? "pt-20 pb-16 sm:pt-28 sm:pb-24" 
    : size === "lg" 
    ? "pt-16 sm:pt-24 pb-14 sm:pb-20" 
    : "pt-12 sm:pt-16 pb-12 sm:pb-16";

  const bgClass =
    variant === "image"
      ? "relative overflow-hidden w-full bg-slate-950"
      : variant === "dark"
      ? "bg-slate-900"
      : variant === "blue"
      ? "bg-gradient-to-br from-blue-700 to-blue-900"
      : "bg-white border-b border-slate-200";

  const eyebrowClass =
    variant === "light" 
      ? "badge-blue" 
      : "bg-white/20 text-white border-white/30 backdrop-blur-md";

  const titleClass =
    variant === "light" ? "text-slate-900" : "!text-white";

  const descClass =
    variant === "light" ? "text-slate-500" : "text-blue-100/90";

  const crumbClass =
    variant === "light" ? "text-slate-400 hover:text-slate-600" : "text-white/60 hover:text-white";

  const crumbActiveClass =
    variant === "light" ? "text-slate-700" : "text-white font-semibold";

  return (
    <div className={`${bgClass} ${paddingClass} select-none`}>
      
      {/* Background Image & Contrast Gradients */}
      {isImage && activeBgImage && (
        <>
          <Image
            src={activeBgImage}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.75] z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20 z-10 pointer-events-none" />
        </>
      )}

      <div className="container relative z-20">
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
          className={`heading-display ${titleClass} mb-4 max-w-3xl font-black uppercase tracking-tight`}
          style={isImage ? { color: "white" } : {}}
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
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-sm sm:text-base leading-relaxed max-w-2xl mb-8 ${descClass}`}
          >
            {description}
          </motion.div>
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
