"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, GraduationCap, Building, Award, ShieldAlert, Sparkles, Filter } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { careerService, type AlumniProfile } from "@/services/careerService";

export default function AlumniClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    careerService.getAlumni()
      .then((res) => {
        setAlumni(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading alumni list:", err);
        setLoading(false);
      });
  }, []);

  const years = ["All", ...Array.from(new Set(alumni.map((a) => a.graduation_year.toString())))].sort();

  const filteredAlumni = alumni.filter((al) => {
    const matchesSearch = al.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          al.current_company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          al.achievement.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = selectedYear === "All" || al.graduation_year.toString() === selectedYear;
    return matchesSearch && matchesYear;
  });

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="SSIET Network"
            title="Alumni Network"
            highlight="Showcase"
            description="Our alumni lead technical and business innovations at top companies worldwide. Connect with our graduates to explore career opportunities."
            className="mb-10"
          />

          {/* Search and Filters side-by-side */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {/* Search */}
            <div className="relative sm:col-span-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-450" />
              <input
                id="alumni-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alumni by name, company or achievements..."
                className="w-full pl-12 pr-4 py-3 rounded-xl glass-light border border-navy-705 text-white placeholder-navy-450 focus:outline-none focus:border-emerald-500/50 bg-navy-900/60 text-xs sm:text-sm"
              />
            </div>

            {/* Filter Year */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-450 pointer-events-none" />
              <select
                id="alumni-year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-light border border-navy-705 text-white focus:outline-none focus:border-emerald-500/50 bg-navy-900 text-xs sm:text-sm"
              >
                <option value="All">All Graduation Years</option>
                {years.filter(y => y !== "All").map((yr) => (
                  <option key={yr} value={yr}>
                    Class of {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="glass h-64 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAlumni.map((al, i) => (
                <motion.div
                  key={al.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="glass rounded-3xl p-6 border border-navy-700/30 card-hover flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider inline-block">
                      Alumni Profile
                    </span>
                    <h3 className="text-white font-extrabold text-base sm:text-lg mb-1">{al.name}</h3>

                    <div className="space-y-2 pt-2 border-t border-navy-800/40">
                      <div className="flex items-center gap-2 text-navy-300 text-xs">
                        <GraduationCap className="w-4 h-4 text-emerald-450 shrink-0" />
                        <span>Class of {al.graduation_year} | {al.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-navy-300 text-xs">
                        <Building className="w-4 h-4 text-emerald-450 shrink-0" />
                        <span>Placed at: <strong className="text-white">{al.current_company}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-navy-300 text-xs">
                        <Award className="w-4 h-4 text-gold-450 shrink-0" />
                        <span>Designation: <strong className="text-white">{al.designation}</strong></span>
                      </div>
                    </div>

                    <p className="text-navy-305 text-xs sm:text-sm leading-relaxed mt-2 pl-3 border-l border-navy-750">
                      {al.achievement}
                    </p>
                  </div>
                </motion.div>
              ))}

              {filteredAlumni.length === 0 && (
                <div className="glass rounded-3xl p-8 border border-navy-700/30 text-center sm:col-span-2 lg:col-span-3">
                  <span className="text-navy-400 text-sm">No alumni profiles found matching your search.</span>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
