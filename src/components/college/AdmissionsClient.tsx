"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2, FileText, Calendar, GraduationCap, ArrowRight,
  ClipboardList, Sparkles, BookmarkCheck, ChevronDown
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import {
  enquiryService,
  type ProcessStep, type RequiredDoc, type TimelineEvent, type EligibilityDetail
} from "@/services/enquiryService";

const availableCourses = [
  { id: "b-tech-cse",  name: "B.Tech Computer Science Engineering (CSE)"         },
  { id: "b-tech-aids", name: "B.Tech AI & Data Science (AI&DS)"                  },
  { id: "b-tech-ece",  name: "B.Tech Electronics & Communication (ECE)"          },
  { id: "b-tech-mech", name: "B.Tech Mechanical Engineering (MECH)"              },
  { id: "b-tech-civil",name: "B.Tech Civil Engineering (CIVIL)"                  },
];

function SkeletonBlock() {
  return <div className="skeleton h-16 w-full rounded-xl" />;
}

export default function AdmissionsClient() {
  const [aiOpen, setAiOpen]               = useState(false);
  const [steps, setSteps]                 = useState<ProcessStep[]>([]);
  const [docs, setDocs]                   = useState<RequiredDoc[]>([]);
  const [timeline, setTimeline]           = useState<TimelineEvent[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("b-tech-cse");
  const [eligibility, setEligibility]     = useState<EligibilityDetail | null>(null);
  const [loading, setLoading]             = useState(true);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      enquiryService.getAdmissionProcess(),
      enquiryService.getDocuments(),
      enquiryService.getTimeline(),
    ]).then(([procRes, docRes, timeRes]) => {
      setSteps(procRes.data || []);
      setDocs(docRes.data || []);
      setTimeline(timeRes.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setEligibilityLoading(true);
    enquiryService.getEligibility(selectedCourse)
      .then((res) => { setEligibility(res.data); setEligibilityLoading(false); })
      .catch(() => setEligibilityLoading(false));
  }, [selectedCourse]);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Admissions 2026-27 Open"
          title="Your Engineering Journey"
          highlight="Starts Here"
          description="Step-by-step guide to joining SSIET — eligibility, process, documentation and key dates."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admissions" }]}
          actions={
            <>
              <Link href="/enquiry" className="btn btn-primary">Submit Enquiry <ArrowRight className="w-4 h-4" /></Link>
              <button onClick={() => setAiOpen(true)} className="btn btn-secondary">
                <Sparkles className="w-4 h-4 text-emerald-500" /> Ask AI
              </button>
            </>
          }
        />

        <div className="container py-12">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Main: Steps + Eligibility ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Admission Steps */}
              <div className="card p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                  Admission Process
                </h2>
                {loading ? (
                  <div className="space-y-3">{[1,2,3].map(i => <SkeletonBlock key={i} />)}</div>
                ) : (
                  <div className="relative border-l-2 border-blue-100 ml-4 space-y-6">
                    {steps.map((st, i) => (
                      <motion.div
                        key={st.id}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="relative pl-8"
                      >
                        <span className="absolute -left-[17px] top-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs text-white font-black shadow-sm">
                          {st.step_number < 10 ? `0${st.step_number}` : st.step_number}
                        </span>
                        <div className="card-bordered p-4 hover-lift">
                          <h3 className="text-sm font-bold text-slate-900 mb-1">{st.title}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed">{st.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Eligibility Explorer */}
              <div className="card p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Eligibility Explorer
                </h2>
                <p className="text-xs text-slate-400 mb-5">Select a program to check eligibility criteria.</p>

                <select
                  id="eligibility-course-select"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="input select mb-6"
                >
                  {availableCourses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <AnimatePresence mode="wait">
                  {eligibilityLoading ? (
                    <div className="space-y-3"><SkeletonBlock /><SkeletonBlock /></div>
                  ) : eligibility && (
                    <motion.div
                      key={eligibility.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-blue-50 border border-blue-100 rounded-xl p-5 space-y-4"
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <div className="text-label text-slate-400 mb-1">Required Qualification</div>
                          <div className="text-sm font-bold text-slate-900">{eligibility.qualification}</div>
                        </div>
                        <div>
                          <div className="text-label text-slate-400 mb-1">Minimum Percentage</div>
                          <div className="text-sm font-bold text-slate-900">{eligibility.minimum_percentage}% aggregate</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-label text-slate-400 mb-1">Entrance Exam</div>
                        <div className="text-sm font-bold text-slate-900">{eligibility.entrance_requirement}</div>
                      </div>
                      {eligibility.additional_requirements && eligibility.additional_requirements.length > 0 && (
                        <ul className="space-y-1.5">
                          {eligibility.additional_requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /> {req}
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Sidebar: Dates, Docs, CTA ── */}
            <div className="space-y-6">

              {/* Key Dates */}
              <div className="card p-5">
                <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" /> Important Dates
                </h2>
                {loading ? <SkeletonBlock /> : (
                  <div className="space-y-3">
                    {timeline.map((dt) => (
                      <div key={dt.id} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="text-label text-slate-400 mb-0.5">{dt.event_name}</div>
                        <div className="text-xs font-bold text-slate-900">{dt.start_date} – {dt.end_date}</div>
                        <span className="badge badge-blue text-[10px] mt-1">{dt.category}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Document Checklist */}
              <div className="card p-5">
                <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" /> Documents Required
                </h2>
                {loading ? <SkeletonBlock /> : (
                  <ul className="space-y-3">
                    {docs.map((doc) => (
                      <li key={doc.id} className="flex items-start gap-2.5 text-xs text-slate-600">
                        <BookmarkCheck className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${doc.mandatory ? "text-emerald-500" : "text-slate-300"}`} />
                        <div>
                          <div className="font-semibold text-slate-900">{doc.document_name}</div>
                          {doc.description && <div className="text-slate-400 mt-0.5">{doc.description}</div>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* CTA Card */}
              <div className="card p-5 bg-blue-600 border-blue-700 text-white">
                <Sparkles className="w-5 h-5 text-blue-200 mb-3" />
                <h3 className="text-sm font-bold mb-2">Ready to Apply?</h3>
                <p className="text-xs text-blue-100 leading-relaxed mb-4">
                  Submit your enquiry and our admissions counselors will contact you within 24 hours.
                </p>
                <Link href="/enquiry" className="btn btn-sm bg-white text-blue-700 hover:bg-blue-50 w-full justify-center">
                  Submit Enquiry <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
