"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase, TrendingUp, Users, Award, Building2,
  ArrowUpRight, ArrowRight, Target, Sparkles
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { careerService, type PlacementOverviewData, type RecruiterDetail, type PlacementStep } from "@/services/careerService";

function StatCard({ icon: Icon, value, label, color, bg, delay = 0 }: {
  icon: React.ElementType; value: string; label: string;
  color: string; bg: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="card p-6 text-center"
    >
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">{value}</div>
      <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</div>
    </motion.div>
  );
}

export default function PlacementsClient() {
  const [aiOpen, setAiOpen]                 = useState(false);
  const [overview, setOverview]             = useState<PlacementOverviewData | null>(null);
  const [recruiters, setRecruiters]         = useState<RecruiterDetail[]>([]);
  const [processSteps, setProcessSteps]     = useState<PlacementStep[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    Promise.all([
      careerService.getPlacementOverview(),
      careerService.getRecruiters(),
      careerService.getPlacementProcess(),
    ]).then(([overRes, recRes, procRes]) => {
      setOverview(overRes.data?.[0] || null);
      setRecruiters(recRes.data || []);
      setProcessSteps(procRes.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const industries   = ["All", ...Array.from(new Set(recruiters.map((r) => r.industry)))];
  const filteredRecs = recruiters.filter((r) => selectedIndustry === "All" || r.industry.toLowerCase() === selectedIndustry.toLowerCase());

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Placements"
          title="Building Careers"
          highlight="Beyond Classrooms"
          description="92% placement rate, 100+ recruiter companies, and structured career training — SSIET's placement record speaks for itself."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Placements" }]}
          actions={
            <>
              <Link href="/success-stories" className="btn btn-primary">
                Success Stories <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/career-training" className="btn btn-secondary">
                Career Training
              </Link>
            </>
          }
        />

        {/* Stats */}
        <section className="container py-10">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="skeleton h-32 rounded-xl" />)}
            </div>
          ) : overview ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={TrendingUp}  value={`${overview.placement_percentage}%`} label="Placement Rate"    color="text-emerald-600" bg="bg-emerald-50" delay={0}   />
              <StatCard icon={Users}       value={String(overview.students_placed)}    label="Students Placed"   color="text-blue-600"    bg="bg-blue-50"    delay={0.08} />
              <StatCard icon={Award}       value={`${overview.highest_package} LPA`}   label="Highest Package"   color="text-amber-600"   bg="bg-amber-50"   delay={0.16} />
              <StatCard icon={Briefcase}   value={`${overview.average_package} LPA`}   label="Average Package"   color="text-purple-600"  bg="bg-purple-50"  delay={0.24} />
            </div>
          ) : null}
        </section>

        {/* Recruiters + Process */}
        <section className="container pb-16">
          <div className="grid lg:grid-cols-12 gap-10">

            {/* Recruiters */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" /> Recruiter Showcase
              </h2>

              {/* Industry Filters */}
              <div className="flex flex-wrap gap-2">
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setSelectedIndustry(ind)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                      selectedIndustry === ind
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1,2,3,4].map(i => <div key={i} className="skeleton h-36 rounded-xl" />)}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredRecs.map((rec) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className="card p-5 group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {rec.company_name}
                        </h3>
                        {rec.website && (
                          <a href={rec.website} target="_blank" rel="noreferrer"
                            className="text-slate-300 hover:text-blue-500 transition-colors">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <span className="badge badge-slate text-[10px] mb-3">{rec.industry}</span>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">{rec.description}</p>
                      {rec.hiring_roles && rec.hiring_roles.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {rec.hiring_roles.map((role, idx) => (
                            <span key={idx} className="badge badge-green text-[10px]">{role}</span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Process Timeline */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" /> Recruitment Journey
              </h2>

              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}
                </div>
              ) : (
                <div className="relative border-l-2 border-blue-100 ml-4 space-y-6">
                  {processSteps.map((step, i) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                      className="relative pl-8"
                    >
                      <span className="absolute -left-[17px] top-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs text-white font-black shadow-sm">
                        {step.step_number < 10 ? `0${step.step_number}` : step.step_number}
                      </span>
                      <div className="card-bordered p-4 hover-lift">
                        <h3 className="text-sm font-bold text-slate-900 mb-1">{step.step_title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Related Links */}
              <div className="space-y-3 mt-8">
                {[
                  { label: "Internship Portal", desc: "Industrial learning opportunities", href: "/internships" },
                  { label: "Career Training",   desc: "Mock interviews & coding prep", href: "/career-training" },
                  { label: "Alumni Network",    desc: "Connect with SSIET alumni",     href: "/alumni" },
                ].map((l) => (
                  <Link key={l.href} href={l.href} className="card p-4 flex items-center justify-between group hover-lift">
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{l.label}</div>
                      <div className="text-xs text-slate-400">{l.desc}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </Link>
                ))}
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
