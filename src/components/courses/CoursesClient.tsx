"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Code2, Brain, Cpu, Settings, Building, Search, ArrowRight, Clock, Users } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { academicService, type CourseSummary } from "@/services/academicService";

const iconMap: Record<string, React.ElementType> = {
  cse: Code2,
  aids: Brain,
  ece: Cpu,
  mech: Settings,
  civil: Building
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  cse: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" },
  aids: { bg: "bg-gold-500/15", text: "text-gold-400", border: "border-gold-500/30" },
  ece: { bg: "bg-navy-400/20", text: "text-navy-300", border: "border-navy-500/30" },
  mech: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30" },
  civil: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
};

const defaultColors = { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" };

export default function CoursesClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    academicService.getCourses()
      .then((res) => {
        setCourses(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses catalog:", err);
        setLoading(false);
      });
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchSearch =
        !searchQuery ||
        course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.department_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = selectedDept === "all" || course.department_id === selectedDept;
      const matchType = selectedType === "all" || course.degree_type === selectedType;
      return matchSearch && matchDept && matchType;
    });
  }, [courses, searchQuery, selectedDept, selectedType]);

  const uniqueDepartments = useMemo(() => {
    const list: { id: string; name: string }[] = [];
    courses.forEach(c => {
      if (!list.find(x => x.id === c.department_id)) {
        list.push({ id: c.department_id, name: c.department_name });
      }
    });
    return list;
  }, [courses]);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="Course Explorer"
            title="Find Your"
            highlight="Engineering Program"
            description="Explore all B.Tech programs at SSIET. Use search and filters to find your ideal course."
            className="mb-10"
          />

          {/* Search & Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-2xl p-4 border border-navy-700/30 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                <input
                  id="course-search"
                  type="text"
                  placeholder="Search courses (e.g. CSE, AI, Mechanical...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-light text-white text-sm placeholder:text-navy-400 border border-navy-700/30 focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all bg-transparent"
                />
              </div>
              {/* Dept Filter */}
              <select
                id="dept-filter"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-2.5 rounded-xl glass-light text-white text-sm border border-navy-700/30 focus:border-emerald-500/40 focus:outline-none bg-navy-900"
              >
                <option value="all">All Departments</option>
                {uniqueDepartments.map((d) => (
                  <option key={d.id} value={d.id}>{d.id.toUpperCase()}</option>
                ))}
              </select>
              {/* Type Filter */}
              <select
                id="type-filter"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2.5 rounded-xl glass-light text-white text-sm border border-navy-700/30 focus:border-emerald-500/40 focus:outline-none bg-navy-900"
              >
                <option value="all">All Types</option>
                <option value="B.Tech">B.Tech</option>
              </select>
            </div>
          </motion.div>

          {/* Results */}
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="glass rounded-2xl p-6 border border-navy-700/30 animate-pulse h-60 space-y-4">
                  <div className="w-12 h-12 bg-navy-800 rounded-xl" />
                  <div className="h-4 bg-navy-800 w-3/4 rounded" />
                  <div className="h-3 bg-navy-900 w-full rounded" />
                  <div className="h-3 bg-navy-900 w-2/3 rounded" />
                </div>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-navy-600 mx-auto mb-4" />
              <p className="text-navy-400 text-lg">No courses found matching &ldquo;{searchQuery}&rdquo;</p>
              <button onClick={() => { setSearchQuery(""); setSelectedDept("all"); }} className="mt-4 text-emerald-400 text-sm hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course, i) => {
                const Icon = iconMap[course.department_id] ?? Code2;
                const colors = colorMap[course.department_id] ?? defaultColors;

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className={`glass rounded-2xl p-6 border ${colors.border} card-hover group flex flex-col justify-between`}
                  >
                    <div>
                      <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <span className={`text-[10px] uppercase font-black tracking-widest ${colors.text} mb-1 block`}>
                        {course.degree_type}
                      </span>
                      <h3 className="text-white font-extrabold text-sm sm:text-base leading-snug mb-2 group-hover:text-emerald-450 transition-colors">
                        {course.course_name}
                      </h3>
                      <p className="text-navy-300 text-xs leading-relaxed mb-4 line-clamp-3">
                        {course.overview}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-navy-450 mb-6">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-emerald-450" /> {course.duration}
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Users className="w-3.5 h-3.5 text-emerald-450" /> {course.intake} seats
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/courses/${course.id}`}
                      className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${colors.text} group/link mt-auto`}
                    >
                      Explore Program
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
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
