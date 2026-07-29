"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Shield,
  Medal,
  Heart,
  Calendar,
  CheckCircle2,
  ListOrdered,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { academicService, type ScholarshipItem } from "@/services/academicService";

const iconMap: Record<string, React.ElementType> = {
  Trophy,
  Shield,
  Medal,
  Heart,
};

export default function ScholarshipsClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    academicService.getScholarships()
      .then((res) => {
        setScholarships(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading scholarships:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="Financial Aid"
            title="Scholarships &"
            highlight="Support Programs"
            description="We believe financial limitations should not hinder talent. Explore various college, government, and athletic scholarships available for students."
            className="mb-14"
          />

          {/* Scholarship List */}
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="glass rounded-2xl p-8 border border-navy-700/30 animate-pulse h-64" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {scholarships.map((sch, i) => {
                const Icon = i % 2 === 0 ? Trophy : Medal;
                const isExpanded = activeTab === sch.id;

                return (
                  <motion.div
                    key={sch.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="glass rounded-2xl p-6 sm:p-8 border border-navy-700/30 flex flex-col justify-between card-hover"
                  >
                    <div>
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-navy-600/20 flex items-center justify-center border border-emerald-500/20">
                            <Icon className="w-5 h-5 text-emerald-450" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-450">
                              Financial Concession
                            </span>
                            <h3 className="text-white font-extrabold text-base sm:text-lg mt-0.5">{sch.title}</h3>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-navy-300 text-xs sm:text-sm mb-4 leading-relaxed">
                        {sch.description}
                      </p>

                      {/* Benefits */}
                      <div className="mb-4">
                        <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-2">
                          Key Benefits
                        </h4>
                        <div className="space-y-1.5">
                          {sch.benefits.map((b, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-navy-200 text-xs sm:text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Eligibility summary */}
                      <div className="mb-6">
                        <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-2">
                          Eligibility Requirements
                        </h4>
                        <div className="space-y-1.5">
                          {sch.eligibility.slice(0, 2).map((el, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-navy-300 text-xs sm:text-sm">
                              <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                              <span>{el}</span>
                            </div>
                          ))}
                          {sch.eligibility.length > 2 && (
                            <span className="text-navy-450 text-[10px] font-bold uppercase tracking-widest block mt-1">
                              + {sch.eligibility.length - 2} more conditions
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      {/* Deadline */}
                      <div className="flex items-center gap-1.5 text-navy-450 text-xs mb-4">
                        <Calendar className="w-4 h-4 text-navy-450" />
                        <span>Disbursed during counseling seat verification</span>
                      </div>

                      <button
                        onClick={() => setActiveTab(isExpanded ? null : sch.id)}
                        className="w-full py-2.5 rounded-xl glass border border-navy-600/40 text-white text-xs sm:text-sm font-semibold hover:border-emerald-500/40 hover:text-emerald-400 transition-all duration-200"
                      >
                        {isExpanded ? "Hide Application Steps" : "View Full Application Details"}
                      </button>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden mt-6 pt-6 border-t border-navy-800/60 space-y-5"
                          >
                            {/* Full eligibility */}
                            {sch.eligibility.length > 2 && (
                              <div>
                                <h5 className="text-white text-xs font-extrabold uppercase tracking-wider mb-2">Detailed Eligibility List</h5>
                                <ul className="space-y-1.5">
                                  {sch.eligibility.map((el, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-navy-200 text-xs">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                      <span>{el}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* App Process */}
                            {sch.application_process && sch.application_process.length > 0 && (
                              <div>
                                <h5 className="text-white text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                  <ListOrdered className="w-4 h-4 text-emerald-450" />
                                  Application Instructions
                                </h5>
                                <ol className="space-y-2">
                                  {sch.application_process.map((step, idx) => (
                                    <li key={idx} className="flex gap-2.5 text-navy-300 text-xs">
                                      <span className="font-bold text-emerald-450 text-xs">{idx + 1}.</span>
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Help box */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6 border border-navy-700/30 flex items-start gap-4"
          >
            <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Need Assistance?</h4>
              <p className="text-navy-300 text-xs sm:text-sm leading-relaxed">
                If you have questions about scholarship disbursements, need certificates verified, or want to apply under multiple schemes, please contact the college Admin Wing or check in with our team during admission counseling.
              </p>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
