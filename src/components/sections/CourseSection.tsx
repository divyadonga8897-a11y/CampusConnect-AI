"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Code2, Brain, Cpu, Settings, Building,
  ArrowRight, Sparkles
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { DEPARTMENTS } from "@/constants/collegeData";

const iconMap: Record<string, React.ElementType> = {
  Code2, Brain, Cpu, Settings, Building,
};

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-455", border: "border-emerald-500/20", glow: "group-hover:shadow-emerald-500/15" },
  gold: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", glow: "group-hover:shadow-blue-500/15" },
  navy: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20", glow: "group-hover:shadow-indigo-500/15" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20", glow: "group-hover:shadow-orange-500/15" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", glow: "group-hover:shadow-amber-500/15" },
};

export default function CourseSection() {
  return (
    <section className="relative section-padding bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionTitle
          badge="Engineering Programs"
          title="Explore Our"
          highlight="Courses"
          description="Choose from five specialized engineering programs designed to prepare you for the modern tech landscape."
          className="mb-16"
        />

        {/* Courses Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {DEPARTMENTS.map((dept, i) => {
            const Icon = iconMap[dept.icon] ?? Code2;
            // Map color systems dynamically
            const colors = colorMap[dept.color] ?? colorMap.emerald;

            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`glass rounded-3xl p-6 border ${colors.border} card-hover group flex flex-col justify-between cursor-pointer relative overflow-hidden`}
              >
                {/* Visual hover background accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/[0.01] pointer-events-none" />

                <div>
                  {/* Icon & Details */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-navy-450 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                      {dept.shortName}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-blue-300 transition-colors leading-snug">
                    {dept.name}
                  </h3>

                  {/* Description */}
                  <p className="text-navy-300 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                    {dept.description}
                  </p>
                </div>

                <div>
                  {/* Intake & Est */}
                  <div className="flex items-center justify-between text-[11px] text-navy-400 font-semibold mb-5 pb-4 border-b border-white/5">
                    <span>Intake: {dept.intake} Seats</span>
                    <span>Est: {dept.established}</span>
                  </div>

                  {/* Link CTA */}
                  <Link
                    href={`/courses/${dept.slug}`}
                    className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${colors.text} group/link`}
                  >
                    Explore Course Details
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* View All Programs */}
        <div className="text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-650 to-blue-800 text-white font-bold text-sm shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 border border-blue-500/20"
          >
            View All Programs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
      </div>
    </section>
  );
}
