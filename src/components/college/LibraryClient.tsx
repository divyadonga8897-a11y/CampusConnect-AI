"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, BookMarked, Globe, Users2, Laptop, Library, Sparkles, ScrollText } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { campusService, type LibraryInfo } from "@/services/campusService";

export default function LibraryClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [libraryData, setLibraryData] = useState<LibraryInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    campusService.getLibrary()
      .then((res) => {
        setLibraryData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading library details:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="Central Library Hub"
            title="Dr. A.P.J. Abdul Kalam"
            highlight="Central Library"
            description="Explore our massive multi-level digital catalog carrying standard engineering texts, international scientific journals, silent cabins, and e-learning resources."
            className="mb-12"
          />

          {loading || !libraryData ? (
            <div className="glass rounded-3xl p-8 border border-navy-700/30 animate-pulse h-96" />
          ) : (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Column - Library Overview & Stats */}
              <div className="lg:col-span-8 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="glass rounded-3xl p-6 sm:p-8 border border-navy-700/30 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Library className="w-40 h-40 text-emerald-450" />
                  </div>

                  <h3 className="text-white font-extrabold text-xl sm:text-2xl mb-4">
                    {libraryData.title}
                  </h3>
                  <p className="text-navy-300 text-xs sm:text-sm leading-relaxed mb-6">
                    {libraryData.description}
                  </p>

                  {/* High Impact Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { icon: BookMarked, value: `${libraryData.book_count.toLocaleString()}+`, label: "Textbook Volumes" },
                      { icon: Users2, value: `${libraryData.seating_capacity}+ Seats`, label: "Reading Capacity" },
                      { icon: Laptop, value: "Digital Hub", label: "E-Reference Desks" }
                    ].map((stat, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-navy-950/40 border border-navy-800/40 text-center">
                        <stat.icon className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                        <div className="text-white font-black text-sm sm:text-base">{stat.value}</div>
                        <div className="text-navy-450 text-[10px] font-bold uppercase mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Subscriptions / Journals */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="glass rounded-3xl p-6 sm:p-8 border border-navy-700/30"
                >
                  <h4 className="text-white font-extrabold text-sm sm:text-base uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-450" />
                    Electronic Journals & Databases
                  </h4>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {libraryData.digital_resources.map((res, idx) => (
                      <div key={idx} className="glass-light p-4 rounded-xl border border-navy-850 flex items-center gap-3 card-hover">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
                          <ScrollText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-xs sm:text-sm">{res}</div>
                          <div className="text-[9px] text-navy-450 font-bold uppercase mt-0.5">Subscribed Access</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Amenities & Cabin Facilities */}
              <div className="lg:col-span-4 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="glass rounded-3xl p-6 border border-navy-700/30"
                >
                  <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    Library Facilities
                  </h4>

                  <div className="space-y-3">
                    {libraryData.facilities.map((fac, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-navy-950/40 border border-navy-800/40 flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                        <span className="text-navy-200 text-xs sm:text-sm leading-relaxed">{fac}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Digital Reference QR Box */}
                <div className="glass rounded-3xl p-6 border border-emerald-500/20 bg-gradient-to-b from-navy-900 to-navy-950">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-2">OPAC Catalog Search</h3>
                  <p className="text-navy-300 text-xs mb-4 leading-relaxed">
                    Search and reserve textbooks online from any terminal inside campus boundaries.
                  </p>
                  <button
                    onClick={() => setAiOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:from-emerald-400 hover:to-emerald-500 transition-all duration-200"
                  >
                    Open OPAC AI Search
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI visuals warning placeholder */}
          <div className="mt-12 glass rounded-2xl p-6 border border-gold-550/20 bg-gold-900/5 flex items-start gap-4">
            <Sparkles className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Visual Verification & Virtual Tours</h4>
              <p className="text-navy-300 text-xs sm:text-sm leading-relaxed">
                Future phases will incorporate interactive 360-degree walking views inside library reading halls, indexing book positions by aisles using digital coordinates.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
