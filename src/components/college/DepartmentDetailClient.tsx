"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Code2, Brain, Cpu, Settings, Building, Users, GraduationCap, ArrowRight, BookOpen, UserCheck, Microscope } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import type { DepartmentDetail } from "@/services/academicService";

const iconMap: Record<string, React.ElementType> = {
  cse: Code2,
  aids: Brain,
  ece: Cpu,
  mech: Settings,
  civil: Building
};

const colorMap: Record<string, { text: string; border: string; bg: string }> = {
  cse: { text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/20" },
  aids: { text: "text-gold-400", border: "border-gold-500/30", bg: "bg-gold-500/20" },
  ece: { text: "text-navy-300", border: "border-navy-500/30", bg: "bg-navy-400/20" },
  mech: { text: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/20" },
  civil: { text: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/20" },
};

const defaultColors = { text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/20" };

interface Props {
  department: DepartmentDetail;
}

export default function DepartmentDetailClient({ department: dept }: Props) {
  const [aiOpen, setAiOpen] = useState(false);
  const Icon = iconMap[dept.id] ?? Code2;
  const colors = colorMap[dept.id] ?? defaultColors;

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        {/* Hero */}
        <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Link
              href="/departments"
              className="inline-flex items-center gap-1.5 text-navy-450 hover:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 transition-colors"
            >
              ← All Departments
            </Link>
            <div className="flex items-start gap-6 mb-6">
              <div className={`w-20 h-20 rounded-3xl ${colors.bg} flex items-center justify-center shrink-0 border ${colors.border}`}>
                <Icon className={`w-10 h-10 ${colors.text}`} />
              </div>
              <div>
                <div className={`text-xs font-black uppercase tracking-widest ${colors.text} mb-1`}>{dept.short_name} Department</div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{dept.department_name}</h1>
                <p className="text-navy-300 text-sm">Established Year {dept.established_year}</p>
              </div>
            </div>

            {/* Stat Chips */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { icon: Users, label: `${dept.faculty_count}+ Expert Faculty` },
                { icon: GraduationCap, label: `${dept.student_count}+ Active Students` },
              ].map((chip) => (
                <div key={chip.label} className={`flex items-center gap-2.5 px-4 py-2 rounded-xl bg-navy-900/60 ${colors.border} border`}>
                  <chip.icon className={`w-4 h-4 ${colors.text}`} />
                  <span className={`text-xs font-bold text-white`}>{chip.label}</span>
                </div>
              ))}
            </div>

            <p className="text-navy-200 text-sm sm:text-base leading-relaxed max-w-3xl mb-8">{dept.description}</p>
          </motion.div>
        </section>

        {/* Details Grid */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Head of Department */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass rounded-2xl p-6 border border-navy-700/30"
              >
                <h2 className="text-white font-extrabold text-sm sm:text-base uppercase tracking-wider mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-gold-400" />
                  Head of Department
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/10 to-navy-600/30 flex items-center justify-center text-xl font-black text-emerald-400 border border-emerald-500/20">
                    {dept.head_of_department.split(" ").slice(-1)[0][0]}
                  </div>
                  <div>
                    <div className="text-white font-bold text-base">{dept.head_of_department}</div>
                    <div className="text-navy-300 text-xs">Professor & Department Chair</div>
                    <div className={`text-xs mt-1 ${colors.text} font-bold uppercase tracking-wider`}>SSIET {dept.short_name} Division</div>
                  </div>
                </div>
              </motion.div>

              {/* Department Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass rounded-2xl p-6 border border-navy-700/30"
              >
                <h2 className="text-white font-extrabold text-sm sm:text-base uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-emerald-450" />
                  Department highlights & Facilities
                </h2>
                <div className="space-y-3">
                  {dept.highlights.map((high, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-navy-200 text-xs sm:text-sm leading-relaxed">
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.bg} shrink-0 mt-2`} style={{ backgroundColor: "currentColor" }} />
                      {high}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Faculty Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass rounded-2xl p-6 border border-navy-700/30"
              >
                <h2 className="text-white font-extrabold text-sm sm:text-base uppercase tracking-wider mb-6">Expert Faculty Board</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {dept.faculty.map((fac, idx) => (
                    <div key={idx} className="glass-light p-4 rounded-xl border border-navy-750 text-center">
                      <div className="w-12 h-12 rounded-full bg-navy-800 flex items-center justify-center mx-auto mb-3 font-bold text-white text-sm">
                        {fac.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="text-white font-bold text-xs line-clamp-1">{fac.name}</div>
                      <div className="text-navy-450 text-[10px] uppercase font-bold mt-1">{fac.designation}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Courses Offered */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass rounded-2xl p-6 border border-navy-700/30"
              >
                <h2 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BookOpen className={`w-5 h-5 ${colors.text}`} />
                  Available Courses
                </h2>
                <div className="space-y-3">
                  {dept.courses.map((course) => (
                    <div key={course.id} className="p-3 rounded-xl glass-light border border-navy-750 flex flex-col justify-between">
                      <div className="text-white font-bold text-xs sm:text-sm mb-1">{course.course_name}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-navy-400 font-semibold">{course.duration} | {course.intake} seats</span>
                        <Link href={`/courses/${course.id}`} className={`text-[10px] font-black uppercase tracking-wider ${colors.text} hover:underline inline-flex items-center gap-1`}>
                          Details <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Admission counseling Redirect */}
              <div className="glass rounded-2xl p-6 border border-emerald-500/20 bg-gradient-to-b from-navy-900 to-navy-950">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-2">B.Tech Admissions Open</h3>
                <p className="text-navy-300 text-xs mb-4 leading-relaxed">
                  Secure seat allocation based on EAMCET ranks or inquire at the counseling wing.
                </p>
                <Link
                  href="/admissions"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:from-emerald-400 hover:to-emerald-500 transition-all duration-200"
                >
                  Apply & Counsel
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
