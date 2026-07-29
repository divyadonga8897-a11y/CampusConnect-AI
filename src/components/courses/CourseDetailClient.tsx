"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Code2,
  Brain,
  Cpu,
  Settings,
  Building,
  GraduationCap,
  Calendar,
  Clock,
  ArrowRight,
  Briefcase,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Trophy,
  Award,
  ShieldCheck,
  Search
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import type { CourseDetail } from "@/services/academicService";

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Brain,
  Cpu,
  Settings,
  Building,
  Trophy,
  Award,
  Sparkles
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  cse: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" },
  aids: { bg: "bg-gold-500/15", text: "text-gold-400", border: "border-gold-500/30" },
  ece: { bg: "bg-navy-400/20", text: "text-navy-300", border: "border-navy-500/30" },
  mech: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30" },
  civil: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
};

const defaultColors = { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" };

interface Props {
  course: CourseDetail;
}

export default function CourseDetailClient({ course }: Props) {
  const [aiOpen, setAiOpen] = useState(false);
  const colors = colorMap[course.department_id] ?? defaultColors;

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        {/* Header Hero */}
        <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-navy-450 hover:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 transition-colors"
            >
              ← Back to Catalog
            </Link>
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
              <div className={`w-20 h-20 rounded-3xl ${colors.bg} flex items-center justify-center shrink-0 border ${colors.border}`}>
                {/* Fallback to Code2 if dynamic icon map is missing */}
                <Code2 className={`w-10 h-10 ${colors.text}`} />
              </div>
              <div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${colors.bg} ${colors.text} mb-2 inline-block`}>
                  {course.degree_type} Program
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
                  {course.course_name}
                </h1>
                <p className="text-navy-300 text-sm">
                  Hosted by Department of {course.department_name}
                </p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { icon: Clock, label: "Duration", value: course.duration },
                { icon: GraduationCap, label: "Intake capacity", value: `${course.intake} Seats` },
                { icon: Calendar, label: "Academic Year", value: "2024-25" },
              ].map((item) => (
                <div key={item.label} className="glass rounded-xl px-4 py-2.5 border border-navy-700/30 flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-xs">{item.value}</div>
                    <div className="text-navy-450 text-[10px] font-semibold uppercase">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Detail Content Modules */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content Blocks */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 sm:p-8 border border-navy-700/30"
              >
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Course Overview</h2>
                <p className="text-navy-200 text-sm sm:text-base leading-relaxed">
                  {course.overview}
                </p>
              </motion.div>

              {/* Course Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 sm:p-8 border border-navy-700/30"
              >
                <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gold-400" />
                  Course Highlights
                </h2>
                <p className="text-navy-300 text-xs mb-6">
                  Key curriculum structures, laboratory exposures, and research initiatives that set this program apart.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {course.features.map((feat) => {
                    const FeatureIcon = iconMap[feat.icon.toLowerCase()] ?? Sparkles;
                    return (
                      <div
                        key={feat.id}
                        className="glass-light p-5 rounded-xl border border-navy-700/20 hover:border-emerald-500/20 card-hover flex gap-3"
                      >
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
                          <FeatureIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm mb-1">{feat.feature_title}</h4>
                          <p className="text-navy-300 text-xs leading-relaxed">{feat.feature_description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Career Opportunities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 sm:p-8 border border-navy-700/30"
              >
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                  Career Pathways & Opportunities
                </h2>
                <p className="text-navy-300 text-xs mb-4">
                  Graduates from this specialization secure entry roles and research pathways inside top tech structures.
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {course.career_scope.map((career) => (
                    <div
                      key={career}
                      className="glass-light p-4 rounded-xl border border-navy-700/20 text-center card-hover flex flex-col justify-center"
                    >
                      <div className="text-white font-bold text-xs sm:text-sm mb-1">{career}</div>
                      <div className="text-[10px] text-navy-450 font-semibold uppercase tracking-wider">Industry Designation</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar Columns */}
            <div className="space-y-6">
              {/* Eligibility Criteria */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 border border-navy-700/30"
              >
                <h2 className="text-white font-bold text-sm sm:text-base mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Academic Eligibility
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] font-black uppercase text-navy-450 tracking-widest mb-1.5">Required Qualification</div>
                    <p className="text-white text-xs sm:text-sm leading-relaxed">{course.admission_requirements?.qualification}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-navy-450 tracking-widest mb-1.5">Entrance Requirement</div>
                    <p className="text-white text-xs sm:text-sm leading-relaxed">{course.admission_requirements?.entrance_exam}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-navy-450 tracking-widest mb-1.5">Cut-off Criteria</div>
                    <p className="text-white text-xs sm:text-sm leading-relaxed">Minimum {course.admission_requirements?.minimum_percentage}% aggregate in qualifying board exam.</p>
                  </div>
                </div>
              </motion.div>

              {/* Required Documents Checklist */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 border border-navy-700/30"
              >
                <h2 className="text-white font-bold text-sm sm:text-base mb-4">Required Documents</h2>
                <ul className="space-y-2.5">
                  {course.admission_requirements?.required_documents.slice(0, 5).map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-navy-200 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Quota Fees Link Card */}
              <div className="glass rounded-2xl p-6 border border-emerald-500/20 bg-gradient-to-b from-navy-900 to-navy-950">
                <h3 className="text-white font-extrabold text-base mb-2">Check Course Fees</h3>
                <p className="text-navy-300 text-xs mb-4 leading-relaxed">
                  Analyze tuition structures for Convener vs Management quotas, hostel boarding and transport concessions.
                </p>
                <Link
                  href="/fees"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:from-emerald-400 hover:to-emerald-500 transition-all duration-205"
                >
                  View Quota Fees
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
