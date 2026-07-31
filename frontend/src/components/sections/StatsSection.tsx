"use client";

import { motion } from "framer-motion";
import { Award, Users, GraduationCap, BookOpen, TrendingUp, Building2 } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";

const statsData = [
  { label: "Years of Excellence", value: "25+",   icon: Award,         trend: { value: "Est. 2000", isPositive: true },   data: [5, 10, 15, 20, 25] },
  { label: "Students Enrolled",   value: "5,000+", icon: Users,         trend: { value: "8% YoY", isPositive: true },      data: [3500, 4000, 4200, 4700, 5000] },
  { label: "Faculty Members",     value: "150+",   icon: GraduationCap, trend: { value: "Ph.D Staff", isPositive: true },  data: [120, 130, 135, 142, 150] },
  { label: "Placement Rate",      value: "92%",    icon: TrendingUp,    trend: { value: "3% increase", isPositive: true }, data: [85, 87, 89, 90, 92] },
  { label: "Recruiting Partners", value: "100+",   icon: Building2,     trend: { value: "Tier-1 Brands", isPositive: true },data: [60, 75, 85, 92, 100] },
  { label: "Engineering Streams", value: "8 Major",icon: BookOpen,      description: "B.Tech & M.Tech Programs" },
];

export default function StatsSection() {
  return (
    <section className="section bg-slate-50 border-y border-slate-100">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <StatCard
                title={s.label}
                value={s.value}
                icon={s.icon}
                trend={s.trend}
                description={"description" in s ? s.description : undefined}
                sparklineData={"data" in s ? s.data : undefined}
                className="hover-lift"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
