"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Award, Users, GraduationCap, BookOpen, TrendingUp, Building2 } from "lucide-react";

const stats = [
  { value: 25,    suffix: "+", label: "Years of Excellence",    icon: Award,         color: "text-blue-600",   bg: "bg-blue-50"   },
  { value: 5000,  suffix: "+", label: "Students Enrolled",      icon: Users,         color: "text-emerald-600",bg: "bg-emerald-50"},
  { value: 150,   suffix: "+", label: "Faculty Members",         icon: GraduationCap, color: "text-amber-600",  bg: "bg-amber-50"  },
  { value: 8,     suffix: "",  label: "Engineering Programs",    icon: BookOpen,      color: "text-purple-600", bg: "bg-purple-50" },
  { value: 92,    suffix: "%", label: "Placement Rate",          icon: TrendingUp,    color: "text-blue-600",   bg: "bg-blue-50"   },
  { value: 100,   suffix: "+", label: "Recruiting Partners",     icon: Building2,     color: "text-emerald-600",bg: "bg-emerald-50"},
];

function useCounter(target: number, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 50);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);
  return count;
}

function StatCard({ stat, delay }: { stat: typeof stats[0]; delay: number }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCounter(stat.value, inView);
  const Icon = stat.icon;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="card p-6 text-center group hover-lift"
    >
      <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-5 h-5 ${stat.color}`} />
      </div>
      <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section className="section bg-slate-50">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s, i) => <StatCard key={s.label} stat={s} delay={i * 0.07} />)}
        </div>
      </div>
    </section>
  );
}
