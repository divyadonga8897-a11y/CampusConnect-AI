"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Code2, Brain, Cpu, Settings, Building, ArrowRight, Users, GraduationCap } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { academicService, type DepartmentSummary } from "@/services/academicService";

const iconMap: Record<string, React.ElementType> = {
  cse: Code2,
  aids: Brain,
  ece: Cpu,
  mech: Settings,
  civil: Building
};

const colorMap: Record<string, { bg: string; text: string; border: string; grad: string }> = {
  cse: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", grad: "from-emerald-500/20 to-emerald-600/10" },
  aids: { bg: "bg-gold-500/15", text: "text-gold-400", border: "border-gold-500/30", grad: "from-gold-500/20 to-gold-600/10" },
  ece: { bg: "bg-navy-400/20", text: "text-navy-300", border: "border-navy-500/30", grad: "from-navy-400/20 to-navy-600/10" },
  mech: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30", grad: "from-orange-500/20 to-orange-600/10" },
  civil: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30", grad: "from-amber-500/20 to-amber-600/10" },
};

const defaultColors = { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", grad: "from-emerald-500/20 to-emerald-600/10" };

export default function DepartmentsClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);

  useEffect(() => {
    academicService.getDepartments()
      .then((res) => {
        setDepartments(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading departments list:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="Engineering Departments"
            title="Our Academic"
            highlight="Departments"
            description="Explore five specialized engineering departments, each offering cutting-edge programs, expert faculty, and state-of-the-art laboratories."
            className="mb-14"
          />

          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="glass rounded-2xl p-6 border border-navy-700/30 animate-pulse h-60 space-y-4" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {departments.map((dept, i) => {
                const Icon = iconMap[dept.id] ?? Code2;
                const colors = colorMap[dept.id] ?? defaultColors;

                return (
                  <motion.div
                    key={dept.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`glass rounded-2xl p-6 border ${colors.border} card-hover group flex flex-col justify-between`}
                  >
                    <div>
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.grad} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 border border-white/5`}>
                          <Icon className={`w-7 h-7 ${colors.text}`} />
                        </div>
                        <div>
                          <div className={`text-xs font-black uppercase tracking-widest ${colors.text} mb-0.5`}>
                            {dept.short_name}
                          </div>
                          <h3 className="text-white font-extrabold text-sm sm:text-base leading-snug">{dept.name}</h3>
                        </div>
                      </div>

                      <p className="text-navy-300 text-xs leading-relaxed mb-4 line-clamp-3">
                        {dept.description}
                      </p>

                      {/* Meta Statistics */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {[
                          { icon: Users, label: "Faculty", value: `${dept.faculty_count}+` },
                          { icon: GraduationCap, label: "Students Enrolled", value: `${dept.student_count}+` },
                        ].map((meta) => (
                          <div key={meta.label} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${colors.bg}`}>
                            <meta.icon className={`w-4 h-4 ${colors.text} shrink-0`} />
                            <div>
                              <div className="text-white font-bold text-xs">{meta.value}</div>
                              <div className="text-navy-450 text-[10px] font-semibold uppercase">{meta.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      {/* Intake Badge */}
                      <div className="flex items-center justify-between mb-4 border-t border-navy-800/30 pt-3">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${colors.text}`}>
                          Est. Year {dept.established_year}
                        </span>
                      </div>

                      <Link
                        href={`/departments/${dept.id}`}
                        className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${colors.text} group/link`}
                      >
                        View Department
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
