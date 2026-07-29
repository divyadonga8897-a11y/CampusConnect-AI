"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Users, Trophy, Code2, Music, Check, Layers, HelpCircle } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { campusService, type ClubItem } from "@/services/campusService";

const categories = ["All", "Technical", "Cultural", "Sports", "Innovation"];

const journeySteps = [
  {
    year: "Year 1",
    title: "Campus Introduction & Foundation",
    desc: "Students undergo a comprehensive induction program, register for hobby clubs, learn computational thinking, and build core engineering physics/math foundations.",
    color: "from-blue-500 to-indigo-650",
  },
  {
    year: "Year 2",
    title: "Skill Development & Projects",
    desc: "Entering core engineering streams, students run laboratory mini-projects, join tech clubs, participate in local workshops, and obtain developer certifications.",
    color: "from-emerald-500 to-teal-655",
  },
  {
    year: "Year 3",
    title: "Industry Preparation & Internships",
    desc: "Focus shifts to career readiness. Students participate in industrial internships, code at national-level hackathons, study system architectures, and attend placement training bootcamps.",
    color: "from-gold-400 to-amber-600",
  },
  {
    year: "Year 4",
    title: "Major Project & Career Launch",
    desc: "In their final year, students engineer capstone projects, write research papers, sit for campus placement interviews with 100+ partner companies, and graduate as industry-ready engineers.",
    color: "from-fuchsia-500 to-rose-655",
  },
];

export default function StudentLifeClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState("All");

  useEffect(() => {
    campusService.getClubs()
      .then((res) => {
        setClubs(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading clubs list:", err);
        setLoading(false);
      });
  }, []);

  const filteredClubs = clubs.filter((c) => {
    return selectedCat === "All" || c.category.toLowerCase() === selectedCat.toLowerCase();
  });

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        {/* Header */}
        <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="Student Life & Clubs"
            title="Life & Clubs at"
            highlight="Sri Satya Institute"
            description="Academics at SSIET is balanced by a rich ecosystem of technical clubs, sports meets, cultural celebrations, and social programs."
            className="mb-14"
          />

          {/* Club Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                  selectedCat === cat
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-500/20 shadow-md shadow-emerald-500/10"
                    : "glass border-navy-750 text-navy-300 hover:text-white hover:border-navy-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Clubs Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-6 mb-20">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="glass rounded-2xl h-64 animate-pulse border border-navy-700/30" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6 mb-20">
              {filteredClubs.map((club, i) => {
                const Icon = club.category.toLowerCase() === "cultural" ? Music : (club.category.toLowerCase() === "sports" ? Trophy : Code2);
                return (
                  <motion.div
                    key={club.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="glass rounded-2xl p-6 sm:p-8 border border-navy-700/30 flex flex-col justify-between card-hover group"
                  >
                    <div>
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4 pb-3 border-b border-navy-800/40">
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider">
                            {club.category}
                          </span>
                          <h3 className="text-white font-extrabold text-sm sm:text-base mt-1.5">{club.club_name}</h3>
                        </div>
                      </div>

                      <p className="text-navy-300 text-xs sm:text-sm leading-relaxed mb-6">
                        {club.description}
                      </p>

                      {/* Activities */}
                      <div className="space-y-2 mb-6">
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider">Core Activities</h4>
                        {club.activities.map((act, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-navy-200 text-xs">
                            <Check className="w-4 h-4 text-emerald-450 shrink-0 mt-0.5" />
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-navy-800/40 text-[10px] text-navy-450 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        Student Led
                      </span>
                      <span>SSIET Clubs Wing</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Student Journey timeline */}
          <SectionTitle
            badge="Student Growth"
            title="The 4-Year"
            highlight="Student Journey"
            description="Follow the educational roadmap and milestones of a student at Sri Satya Institute."
            className="mb-14"
          />

          <div className="relative max-w-4xl mx-auto pl-8 md:pl-0">
            {/* Timeline center line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-emerald-500 to-rose-500 -translate-x-1/2" />

            <div className="space-y-12">
              {journeySteps.map((step, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={step.year}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`relative flex items-center ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}
                  >
                    {/* Content Box */}
                    <div className={`w-full md:w-[calc(50%-2.5rem)] ${isLeft ? "md:pr-8" : "md:pl-8"}`}>
                      <div className="glass rounded-2xl p-6 border border-navy-700/35 card-hover">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${step.color}`}>
                            {step.year}
                          </span>
                          <h3 className="text-white font-bold text-sm sm:text-base leading-snug">{step.title}</h3>
                        </div>
                        <p className="text-navy-300 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-navy-950 border-2 border-emerald-450 shadow-lg shadow-emerald-450/40" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
