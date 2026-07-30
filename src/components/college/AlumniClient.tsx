"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, GraduationCap, Building, Award } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { careerService, type AlumniProfile } from "@/services/careerService";

export default function AlumniClient() {
  const [aiOpen, setAiOpen]           = useState(false);
  const [alumni, setAlumni]           = useState<AlumniProfile[]>([]);
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    careerService.getAlumni()
      .then((res) => { setAlumni(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const years = ["All", ...Array.from(new Set(alumni.map((a) => a.graduation_year.toString()))).sort()];

  const filtered = alumni.filter((al) => {
    const matchSearch = al.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        al.current_company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        al.achievement.toLowerCase().includes(searchQuery.toLowerCase());
    const matchYear   = selectedYear === "All" || al.graduation_year.toString() === selectedYear;
    return matchSearch && matchYear;
  });

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Alumni Network"
          title="SSIET Proud"
          highlight="Alumni"
          description="Our graduates are building careers at top companies worldwide. Explore the SSIET alumni community."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Alumni" }]}
        />

        <div className="container py-12">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="alumni-search"
                type="search"
                placeholder="Search by name, company, or achievement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-11"
              />
            </div>
            <select
              id="alumni-year-filter"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="input select w-40 shrink-0"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y === "All" ? "All Years" : `Batch ${y}`}</option>
              ))}
            </select>
          </div>

          {/* Alumni Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-44 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No alumni match your search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((al, i) => (
                <motion.div
                  key={al.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="card p-5 group"
                >
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-700 font-black text-sm">
                      {al.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {al.name}
                      </h3>
                      <div className="text-[10px] text-slate-400">Batch {al.graduation_year}</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Building className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="font-semibold">{al.designation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Building className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      {al.current_company}
                    </div>
                  </div>

                  {al.achievement && (
                    <div className="flex items-start gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{al.achievement}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
