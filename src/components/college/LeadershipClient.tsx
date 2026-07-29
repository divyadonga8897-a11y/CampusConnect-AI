"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, ChevronRight, UserCheck, Sparkles } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { collegeService, type LeadershipMember } from "@/services/collegeService";

export default function LeadershipClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leaders, setLeaders] = useState<LeadershipMember[]>([]);

  useEffect(() => {
    collegeService.getLeadership()
      .then((res) => {
        setLeaders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading leadership team:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Title Header */}
          <SectionTitle
            badge="College Administration"
            title="Visionary"
            highlight="Leadership Board"
            description="Meet the core academic board, administrative leaders, and advisors committing to elevate learning environments at Sri Satya Institute."
            className="mb-14"
          />

          {loading ? (
            /* Skeleton Loading Grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="glass rounded-3xl p-6 border border-navy-700/30 animate-pulse space-y-4">
                  <div className="w-full h-64 bg-navy-900 rounded-2xl" />
                  <div className="h-5 bg-navy-800 rounded w-1/2" />
                  <div className="h-4 bg-navy-850 rounded w-1/3" />
                  <div className="h-3 bg-navy-900 rounded w-full" />
                  <div className="h-3 bg-navy-900 rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : (
            /* Leadership Grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leaders.map((leader, i) => (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass rounded-3xl overflow-hidden border border-navy-700/30 card-hover flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Image placeholder */}
                    <div className="h-64 bg-navy-950/60 relative overflow-hidden flex items-center justify-center border-b border-navy-800/40">
                      <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/10 to-navy-600/30 border border-emerald-500/20 flex items-center justify-center relative shadow-xl group-hover:scale-105 transition-transform duration-500">
                        {/* Mock Avatar initials if avatar image placeholder is set */}
                        <div className="text-3xl font-black text-emerald-450 tracking-wider">
                          {leader.name.split(" ").map(w => w[0]).join("")}
                        </div>
                        <div className="absolute bottom-1 right-1 bg-emerald-500 rounded-full p-1.5 shadow-md">
                          <UserCheck className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                      <span className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg glass-light text-[10px] text-emerald-350 uppercase tracking-widest font-extrabold shadow-sm">
                        <Award className="w-3 h-3 text-emerald-450 shrink-0 animate-pulse" />
                        {leader.qualification}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-white font-extrabold text-lg sm:text-xl group-hover:text-emerald-400 transition-colors">
                          {leader.name}
                        </h3>
                        <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mt-1">
                          {leader.designation}
                        </p>
                      </div>
                      <p className="text-navy-300 text-sm leading-relaxed">
                        {leader.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Checklist */}
                  <div className="px-6 pb-6 pt-3 border-t border-navy-800/20 flex items-center justify-between text-navy-450 text-xs">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-emerald-450 shrink-0" />
                      Board Member
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-gold-400" />
                      Established Faculty
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
