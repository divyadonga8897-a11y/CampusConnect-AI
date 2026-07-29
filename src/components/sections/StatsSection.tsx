"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Users, GraduationCap, BookOpen, TrendingUp } from "lucide-react";
import { COLLEGE_STATS } from "@/constants/collegeData";

const iconMap: Record<string, React.ElementType> = {
  Award,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
};

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000; // 2 seconds duration
    const steps = 60;
    const stepTime = duration / steps;
    const stepValue = target / steps;
    
    const timer = setInterval(() => {
      start += stepValue;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-500/10">
            SSIET Metrics
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            A Legacy of{" "}
            <span className="gradient-text-gold">Academic Excellence</span>
          </h2>
          <p className="text-navy-300 text-sm max-w-md mx-auto mt-3">
            Sri Satya Institute operates with high quality academic parameters verified by national indicators.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {COLLEGE_STATS.map((stat, i) => {
            const Icon = iconMap[stat.icon] ?? Award;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-3xl p-6 text-center card-hover border border-white/5 group relative overflow-hidden"
              >
                {/* Glow ring */}
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-blue-500/10 blur-xl group-hover:bg-blue-500/20 transition-all" />

                {/* Icon Container */}
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500/15 to-navy-700/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/5 shadow-inner">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>

                {/* Counter */}
                <div className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight group-hover:text-blue-300 transition-colors">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <div className="text-navy-300 text-xs sm:text-sm font-semibold leading-snug">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
