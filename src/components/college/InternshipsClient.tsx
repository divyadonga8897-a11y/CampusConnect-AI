"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, GraduationCap, FileText, Info, HelpCircle } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { careerService, type InternshipDetail } from "@/services/careerService";

export default function InternshipsClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [internships, setInternships] = useState<InternshipDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    careerService.getInternships()
      .then((res) => {
        setInternships(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading internships list:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="Practical Learning"
            title="Industry Internship"
            highlight="Opportunities"
            description="Bridge your classroom engineering fundamentals with active product development by matching with internships at top technology firms."
            className="mb-14"
          />

          {loading ? (
            <div className="grid sm:grid-cols-2 gap-8 animate-pulse">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="glass h-56 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-8">
              {internships.map((intern, i) => (
                <motion.div
                  key={intern.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass rounded-3xl p-6 sm:p-8 border border-navy-700/30 card-hover flex flex-col justify-between"
                >
                  <div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider mb-3 inline-block">
                      {intern.domain}
                    </span>
                    <h3 className="text-white font-extrabold text-lg sm:text-xl mb-1">
                      {intern.company_name}
                    </h3>
                    <div className="flex items-center gap-2 text-navy-400 text-xs mb-4">
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <span>Duration: {intern.duration}</span>
                    </div>

                    <p className="text-navy-300 text-xs sm:text-sm leading-relaxed mb-6">
                      {intern.description}
                    </p>

                    <div className="space-y-3.5 pt-4 border-t border-navy-800/40">
                      {intern.eligibility && (
                        <div className="flex items-start gap-2 text-navy-355 text-xs">
                          <GraduationCap className="w-4 h-4 text-gold-450 shrink-0 mt-0.5" />
                          <span><strong>Eligibility:</strong> {intern.eligibility}</span>
                        </div>
                      )}
                      {intern.application_information && (
                        <div className="flex items-start gap-2 text-navy-355 text-xs">
                          <Info className="w-4 h-4 text-emerald-450 shrink-0 mt-0.5" />
                          <span><strong>Application Info:</strong> {intern.application_information}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Guidelines box */}
          <div className="mt-12 glass rounded-2xl p-6 border border-navy-750 flex items-start gap-4">
            <HelpCircle className="w-5 h-5 text-emerald-450 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Internships Credit Auditing</h4>
              <p className="text-navy-305 text-xs sm:text-sm leading-relaxed">
                Industrial projects completed during the 6th or 7th semesters can be mapped to academic credits subject to validation audits by the department HOD boards.
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
