"use client";

import { motion } from "framer-motion";
import {
  GraduationCap, Building2, Users, TrendingUp, Lightbulb, Globe,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { WHY_CHOOSE_US } from "@/constants/collegeData";

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  Building2,
  Users,
  TrendingUp,
  Lightbulb,
  Globe,
};

export default function WhyChooseUs() {
  return (
    <section className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <SectionTitle
          badge="Why SSIET"
          title="Why Choose"
          highlight="Sri Satya Institute"
          description="We don't just teach engineering — we shape innovators, leaders, and problem-solvers for tomorrow's world."
          className="mb-16"
        />

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((item, i) => {
            const Icon = iconMap[item.icon] ?? GraduationCap;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-3xl p-6 border border-white/5 card-hover group relative overflow-hidden flex flex-col justify-between"
              >
                {/* Accent glow line at top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Icon Frame */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/15 to-navy-700/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                    <Icon className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-white font-bold text-base mb-2 group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-navy-300 text-xs sm:text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
