"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, ShieldCheck, Award, Users, TrendingUp } from "lucide-react";

interface HeroSectionProps {
  onAIClick: () => void;
}

const trustBadges = [
  { label: "NAAC Accredited", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { label: "AICTE Approved",  color: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "NBA Certified",   color: "bg-amber-50 text-amber-700 border-amber-200" },
];

const stats = [
  { value: "25+",  label: "Years",      icon: Award },
  { value: "5K+",  label: "Students",   icon: Users },
  { value: "92%",  label: "Placement",  icon: TrendingUp },
  { value: "100+", label: "Recruiters", icon: ShieldCheck },
];

const floatingCards = [
  { label: "NAAC Grade",   value: "A+", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { label: "Highest CTC",  value: "₹8.5 LPA", color: "text-blue-600 bg-blue-50 border-blue-200" },
];

export default function HeroSection({ onAIClick }: HeroSectionProps) {
  return (
    <section className="bg-white overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[calc(100vh-6rem)] py-16 lg:py-0">

          {/* ── Left: Content ── */}
          <div className="order-2 lg:order-1">
            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {trustBadges.map((b) => (
                <span key={b.label} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${b.color}`}>
                  <ShieldCheck className="w-3 h-3" />
                  {b.label}
                </span>
              ))}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="heading-display text-slate-900 mb-5"
            >
              Shape Your Future at{" "}
              <span className="gradient-text-blue">Sri Satya</span>{" "}
              Engineering
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg"
            >
              An NAAC accredited premier engineering institution in Andhra Pradesh. 
              5,000+ students. Industry-aligned curriculum. 92% placement record.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Link href="/admissions" className="btn btn-primary btn-lg" id="hero-apply-btn">
                Apply for Admission
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={onAIClick}
                className="btn btn-secondary btn-lg"
                id="hero-ai-btn"
              >
                <Bot className="w-4 h-4 text-emerald-500" />
                Ask Campus AI
              </button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="grid grid-cols-4 gap-4 pt-6 border-t border-slate-100"
            >
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="text-center">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{s.value}</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">{s.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* ── Right: Campus Image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative w-full aspect-[4/3] lg:aspect-[5/4] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/campus/hero-bg.jpg"
                alt="SSIET Campus — Sri Satya Institute of Engineering and Technology"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              {/* Subtle gradient at the bottom edge */}
              <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-4 -left-4 lg:-left-8 bg-white border border-slate-200 rounded-xl shadow-lg p-3.5 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold">NAAC Grade</div>
                <div className="text-base font-black text-slate-900">A Accredited</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -top-4 -right-4 lg:-right-8 bg-white border border-slate-200 rounded-xl shadow-lg p-3.5 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold">Placement Rate</div>
                <div className="text-base font-black text-slate-900">92% (2024)</div>
              </div>
            </motion.div>

            {/* Background Dots */}
            <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-2xl bg-dot-pattern opacity-50" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
