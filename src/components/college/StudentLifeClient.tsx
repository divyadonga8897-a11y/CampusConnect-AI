"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Users, Trophy, Code2, Music, Layers, Bot } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import { campusService, type ClubItem } from "@/services/campusService";

const categories = ["All", "Technical", "Cultural", "Sports", "Innovation"];

const catColors: Record<string, string> = {
  Technical:  "badge-blue",
  Cultural:   "badge-amber",
  Sports:     "badge-green",
  Innovation: "badge-slate",
};

const journeySteps = [
  { year: "Year 1", title: "Campus Introduction & Foundation",     color: "bg-blue-500",
    desc: "Comprehensive induction, club registrations, computational thinking, and core engineering fundamentals." },
  { year: "Year 2", title: "Skill Development & Projects",         color: "bg-emerald-500",
    desc: "Mini lab projects, tech clubs, local workshops, and developer certifications in core engineering streams." },
  { year: "Year 3", title: "Industry Preparation & Internships",   color: "bg-amber-500",
    desc: "Industrial internships, hackathons, system architecture study, and placement training bootcamps." },
  { year: "Year 4", title: "Major Project & Career Launch",        color: "bg-purple-500",
    desc: "Capstone projects, research papers, 100+ company placement interviews, graduation as industry-ready engineers." },
];

export default function StudentLifeClient() {
  const [aiOpen, setAiOpen]             = useState(false);
  const [clubs, setClubs]               = useState<ClubItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [selectedCat, setSelectedCat]   = useState("All");

  useEffect(() => {
    campusService.getClubs()
      .then((res) => { setClubs(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredClubs = clubs.filter((c) =>
    selectedCat === "All" || c.category?.toLowerCase() === selectedCat.toLowerCase()
  );

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Student Life"
          title="Life at"
          highlight="SSIET"
          description="Clubs, sports, cultural events, and a 4-year journey designed to make you an industry-ready engineer."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Student Life" }]}
          actions={
            <button onClick={() => setAiOpen(true)} className="btn btn-secondary">
              <Bot className="w-4 h-4 text-emerald-500" /> Ask Campus AI
            </button>
          }
        />

        {/* Student Journey Timeline */}
        <section className="section bg-white">
          <div className="container">
            <SectionHeader eyebrow="Student Journey" title="4 Years of" highlight="Growth" className="mb-10" />
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 max-w-2xl mx-auto">
              {journeySteps.map((step, i) => (
                <motion.div
                  key={step.year}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="relative pl-10"
                >
                  <span className={`absolute -left-[17px] top-0.5 flex h-8 w-8 items-center justify-center rounded-full ${step.color} text-xs text-white font-black shadow-sm`}>
                    {i + 1}
                  </span>
                  <div className="card p-5">
                    <span className="text-label text-slate-400 mb-1">{step.year}</span>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Clubs */}
        <section className="section bg-slate-50">
          <div className="container">
            <SectionHeader eyebrow="Clubs & Associations" title="Student" highlight="Clubs" className="mb-8" />

            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                    selectedCat === cat
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-36 rounded-xl" />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClubs.map((club, i) => {
                  const badge = catColors[club.category] ?? "badge-slate";
                  return (
                    <motion.div
                      key={club.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="card p-5 group"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{club.club_name}</h3>
                          <span className={`badge ${badge} text-[10px] mt-0.5`}>{club.category}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{club.description}</p>
                      {club.activities && club.activities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                          {club.activities.slice(0, 3).map((a) => (
                            <span key={a} className="badge badge-slate text-[10px]">{a}</span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
