"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, CheckCircle2, ListOrdered, ChevronDown, ChevronUp, ArrowRight
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { academicService, type ScholarshipItem } from "@/services/academicService";

export default function ScholarshipsClient() {
  const [aiOpen, setAiOpen]             = useState(false);
  const [loading, setLoading]           = useState(true);
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [activeTab, setActiveTab]       = useState<string | null>(null);

  useEffect(() => {
    academicService.getScholarships()
      .then((res) => { setScholarships(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Scholarships & Financial Aid"
          title="Fund Your"
          highlight="Education"
          description="Merit, government, sports, and disability scholarships available to help every deserving student at SSIET."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Scholarships" }]}
          actions={
            <>
              <Link href="/admissions" className="btn btn-primary">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
              <button onClick={() => setAiOpen(true)} className="btn btn-secondary">
                Ask AI About Scholarships
              </button>
            </>
          }
        />

        <div className="container py-12">
          {loading ? (
            <div className="space-y-4 max-w-3xl mx-auto">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {scholarships.map((s, i) => {
                const isOpen = activeTab === s.id;
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className={`bg-white border rounded-xl overflow-hidden transition-colors ${
                      isOpen ? "border-blue-200 shadow-sm" : "border-slate-200"
                    }`}
                  >
                    {/* Header (toggle) */}
                    <button
                      onClick={() => setActiveTab(isOpen ? null : s.id)}
                      className="w-full flex items-center gap-4 p-5 text-left cursor-pointer"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isOpen ? "bg-blue-600" : "bg-blue-50"}`}>
                        <Trophy className={`w-5 h-5 ${isOpen ? "text-white" : "text-blue-600"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 mb-0.5">{s.title}</div>
                        <div className="text-xs text-slate-400 line-clamp-1">{s.description}</div>
                      </div>
                      {isOpen
                        ? <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      }
                    </button>

                    {/* Expandable content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 border-t border-slate-100 pt-4 grid sm:grid-cols-2 gap-5">
                            {/* Eligibility */}
                            <div>
                              <h4 className="text-label text-slate-400 mb-2 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Eligibility
                              </h4>
                              <ul className="space-y-1.5">
                                {s.eligibility.map((e, idx) => (
                                  <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />{e}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Benefits */}
                            <div>
                              <h4 className="text-label text-slate-400 mb-2 flex items-center gap-1.5">
                                <Trophy className="w-3.5 h-3.5 text-amber-500" /> Benefits
                              </h4>
                              <ul className="space-y-1.5">
                                {s.benefits.map((b, idx) => (
                                  <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />{b}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Application Process */}
                            {s.application_process && s.application_process.length > 0 && (
                              <div className="sm:col-span-2">
                                <h4 className="text-label text-slate-400 mb-2 flex items-center gap-1.5">
                                  <ListOrdered className="w-3.5 h-3.5 text-blue-500" /> Application Process
                                </h4>
                                <ol className="space-y-1.5">
                                  {s.application_process.map((step, idx) => (
                                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                                      <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                                      {step}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="card p-6 bg-blue-50 border-blue-100 mt-10 max-w-3xl mx-auto text-center">
            <h3 className="text-base font-bold text-slate-900 mb-2">Need Help With Scholarships?</h3>
            <p className="text-sm text-slate-500 mb-4">Our AI can instantly answer questions about eligibility, deadlines, and the application process.</p>
            <button onClick={() => setAiOpen(true)} className="btn btn-primary btn-sm mx-auto">
              Ask Campus AI
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
