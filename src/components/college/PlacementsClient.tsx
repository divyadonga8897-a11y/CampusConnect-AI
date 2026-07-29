"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  Award, 
  Building2, 
  ArrowUpRight, 
  Calendar,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  Target
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { careerService, type PlacementOverviewData, type RecruiterDetail, type PlacementStep } from "@/services/careerService";

export default function PlacementsClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [overview, setOverview] = useState<PlacementOverviewData | null>(null);
  const [recruiters, setRecruiters] = useState<RecruiterDetail[]>([]);
  const [processSteps, setProcessSteps] = useState<PlacementStep[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      careerService.getPlacementOverview(),
      careerService.getRecruiters(),
      careerService.getPlacementProcess()
    ]).then(([overRes, recRes, procRes]) => {
      setOverview(overRes.data?.[0] || null);
      setRecruiters(recRes.data || []);
      setProcessSteps(procRes.data || []);
      setLoading(false);
    }).catch((err) => {
      console.error("Error loading placements dashboard:", err);
      setLoading(false);
    });
  }, []);

  const industries = ["All", ...Array.from(new Set(recruiters.map((r) => r.industry)))];

  const filteredRecruiters = recruiters.filter((r) => 
    selectedIndustry === "All" || r.industry.toLowerCase() === selectedIndustry.toLowerCase()
  );

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        {/* Placement Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-float" style={{ animationDelay: "3s" }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-emerald text-emerald-350 text-xs font-semibold uppercase tracking-wider mb-6"
            >
              <Sparkles className="w-4 h-4 text-emerald-450" />
              94.5% Placement Success Record
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-4xl sm:text-6xl font-black text-white leading-none tracking-tight mb-6"
            >
              Building Careers <br />
              <span className="gradient-text-emerald">Beyond Classrooms</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-navy-200 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Discover placement achievements, recruiting partners, training modules, and student success narratives driving career excellence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/success-stories"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:from-emerald-400 hover:to-emerald-500 transition-all duration-350 shadow-lg shadow-emerald-500/20 hover:scale-105"
              >
                Success Stories
              </Link>
              <Link
                href="/career-resources"
                className="px-6 py-3.5 rounded-xl glass border border-navy-700/60 text-white font-bold text-xs uppercase tracking-wider hover:border-emerald-500/40 hover:text-emerald-450 transition-all duration-350 hover:scale-105"
              >
                Preparation Resources
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Stats Dashboard Grid */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="glass h-32 rounded-2xl" />
              ))}
            </div>
          ) : (
            overview && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass p-5 rounded-2xl border border-navy-800/40 text-center relative overflow-hidden"
                >
                  <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                  <div className="text-3xl sm:text-4xl font-extrabold text-white">{overview.placement_percentage}%</div>
                  <div className="text-[10px] sm:text-xs text-navy-350 uppercase tracking-widest font-black mt-1">Placement rate</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="glass p-5 rounded-2xl border border-navy-800/40 text-center relative overflow-hidden"
                >
                  <Users className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                  <div className="text-3xl sm:text-4xl font-extrabold text-white">{overview.students_placed}</div>
                  <div className="text-[10px] sm:text-xs text-navy-350 uppercase tracking-widest font-black mt-1">Students placed</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="glass p-5 rounded-2xl border border-navy-800/40 text-center relative overflow-hidden"
                >
                  <Award className="w-5 h-5 text-gold-450 mx-auto mb-2" />
                  <div className="text-3xl sm:text-4xl font-extrabold text-white">{overview.highest_package} LPA</div>
                  <div className="text-[10px] sm:text-xs text-navy-350 uppercase tracking-widest font-black mt-1">Highest package</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="glass p-5 rounded-2xl border border-navy-800/40 text-center relative overflow-hidden"
                >
                  <Briefcase className="w-5 h-5 text-emerald-450 mx-auto mb-2" />
                  <div className="text-3xl sm:text-4xl font-extrabold text-white">{overview.average_package} LPA</div>
                  <div className="text-[10px] sm:text-xs text-navy-350 uppercase tracking-widest font-black mt-1">Average package</div>
                </motion.div>
              </div>
            )
          )}
        </section>

        {/* Recruiters & Processes Side-by-side */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid lg:grid-cols-12 gap-12">
          {/* Recruiter Showcase */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <Building2 className="w-6 h-6 text-emerald-450" />
              Recruiter Showcase
            </h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 border ${
                    selectedIndustry === ind
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-500/20"
                      : "glass border-navy-800 text-navy-300 hover:text-white"
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 gap-6 animate-pulse">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="glass h-40 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredRecruiters.map((rec) => (
                  <div
                    key={rec.id}
                    className="glass rounded-xl p-5 border border-navy-800/40 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-white font-extrabold text-sm sm:text-base group-hover:text-emerald-400 transition-colors">
                        {rec.company_name}
                      </h3>
                      {rec.website && (
                        <a
                          href={rec.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-navy-400 hover:text-emerald-450 transition-colors"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-navy-900 border border-navy-800 text-navy-350 uppercase mb-3 inline-block">
                      {rec.industry}
                    </span>
                    <p className="text-navy-300 text-xs leading-relaxed mb-4">
                      {rec.description}
                    </p>
                    {rec.hiring_roles && rec.hiring_roles.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {rec.hiring_roles.map((role, idx) => (
                          <span key={idx} className="text-[9px] font-medium text-emerald-450 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                            {role}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Process Timeline */}
          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <Target className="w-6 h-6 text-emerald-450 animate-pulse" />
              Recruitment Journey
            </h2>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="glass rounded-xl h-20" />
                ))}
              </div>
            ) : (
              <div className="relative border-l border-navy-850 ml-4 sm:ml-6 space-y-8">
                {processSteps.map((step, i) => (
                  <div key={step.id} className="relative pl-8 sm:pl-10">
                    {/* Circle step number */}
                    <span className="absolute -left-[17px] top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-navy-800 text-xs text-white font-bold border-2 border-navy-950 shadow-md">
                      0{step.step_number}
                    </span>

                    {/* Card content */}
                    <div className="glass p-5 rounded-2xl border border-navy-800/40 hover:border-emerald-500/20 transition-all duration-300">
                      <h3 className="text-white font-bold text-sm sm:text-base mb-1">
                        {step.step_title}
                      </h3>
                      <p className="text-navy-305 text-xs leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Explore Links footer */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-2xl border border-navy-800/30 flex flex-col justify-between h-44">
              <div>
                <h3 className="text-white font-bold text-base mb-1.5">Internship Portals</h3>
                <p className="text-navy-300 text-xs leading-relaxed">Explore industrial learning internships in software services and R&D pipelines.</p>
              </div>
              <Link href="/internships" className="flex items-center gap-1 text-emerald-450 hover:text-emerald-350 text-xs font-bold uppercase tracking-wider transition-colors pt-4">
                View Internships
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="glass p-6 rounded-2xl border border-navy-800/30 flex flex-col justify-between h-44">
              <div>
                <h3 className="text-white font-bold text-base mb-1.5">Career Prep</h3>
                <p className="text-navy-300 text-xs leading-relaxed">Access placement mock interviews schedules, verbal reasoning and coding training.</p>
              </div>
              <Link href="/career-training" className="flex items-center gap-1 text-emerald-450 hover:text-emerald-350 text-xs font-bold uppercase tracking-wider transition-colors pt-4">
                Explore Programs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="glass p-6 rounded-2xl border border-navy-800/30 flex flex-col justify-between h-44">
              <div>
                <h3 className="text-white font-bold text-base mb-1.5">Alumni Registry</h3>
                <p className="text-navy-300 text-xs leading-relaxed">Search through our elite alumni directories placed at global technology firms.</p>
              </div>
              <Link href="/alumni" className="flex items-center gap-1 text-emerald-450 hover:text-emerald-350 text-xs font-bold uppercase tracking-wider transition-colors pt-4">
                Search Alumni
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
