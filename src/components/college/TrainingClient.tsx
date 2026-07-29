"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Code, Award, CheckCircle2, Sparkles, HelpCircle } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { careerService, type TrainingProgramDetail } from "@/services/careerService";

export default function TrainingClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [programs, setPrograms] = useState<TrainingProgramDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    careerService.getTrainingPrograms()
      .then((res) => {
        setPrograms(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading training catalog:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="Training & Development"
            title="Empowering Student"
            highlight="Capabilities"
            description="Our placement cell organizes structured training modules covering core technologies, logical reasoning, public speaking, and HR interview strategies."
            className="mb-14"
          />

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="glass h-80 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((prog, i) => (
                <motion.div
                  key={prog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass rounded-3xl overflow-hidden border border-navy-700/30 card-hover flex flex-col justify-between"
                >
                  <div className="p-6 sm:p-8 space-y-4">
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider inline-block">
                      {prog.category}
                    </span>
                    <h3 className="text-white font-extrabold text-lg leading-snug">
                      {prog.title}
                    </h3>
                    <p className="text-navy-300 text-xs sm:text-sm leading-relaxed">
                      {prog.description}
                    </p>

                    <div className="flex items-center gap-2 text-navy-450 text-xs py-2 border-y border-navy-800/40">
                      <Clock className="w-4 h-4 text-gold-450" />
                      <span>Duration: {prog.duration}</span>
                    </div>

                    {prog.skills_covered && prog.skills_covered.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <div className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Skills Covered</div>
                        <div className="flex flex-wrap gap-1.5">
                          {prog.skills_covered.map((skill, idx) => (
                            <span key={idx} className="text-[9px] font-medium text-white bg-navy-900 border border-navy-800 px-2 py-0.5 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Help note */}
          <div className="mt-12 glass rounded-2xl p-6 border border-navy-750 flex items-start gap-4">
            <HelpCircle className="w-5 h-5 text-emerald-450 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Corporate Readiness Assessments</h4>
              <p className="text-navy-305 text-xs sm:text-sm leading-relaxed">
                All training modules are accompanied by weekly AMCAT/CoCubes diagnostic test sets. Students are required to maintain a minimum of 80% attendance to secure options registration slots.
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
