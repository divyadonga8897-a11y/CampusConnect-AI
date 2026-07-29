"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  CheckCircle2, 
  FileText, 
  Calendar, 
  GraduationCap, 
  ArrowRight,
  ChevronRight,
  ClipboardList,
  Sparkles,
  Search,
  BookmarkCheck,
  ShieldCheck,
  Building
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { enquiryService, type ProcessStep, type RequiredDoc, type TimelineEvent, type EligibilityDetail } from "@/services/enquiryService";

const availableCourses = [
  { id: "b-tech-cse", name: "B.Tech Computer Science Engineering (CSE)" },
  { id: "b-tech-aids", name: "B.Tech Artificial Intelligence & Data Science (AI&DS)" },
  { id: "b-tech-ece", name: "B.Tech Electronics & Communication Engineering (ECE)" }
];

export default function AdmissionsClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [docs, setDocs] = useState<RequiredDoc[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("b-tech-cse");
  const [eligibility, setEligibility] = useState<EligibilityDetail | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      enquiryService.getAdmissionProcess(),
      enquiryService.getDocuments(),
      enquiryService.getTimeline()
    ]).then(([procRes, docRes, timeRes]) => {
      setSteps(procRes.data || []);
      setDocs(docRes.data || []);
      setTimeline(timeRes.data || []);
      setLoading(false);
    }).catch((err) => {
      console.error("Error loading admissions info:", err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setEligibilityLoading(true);
    enquiryService.getEligibility(selectedCourse)
      .then((res) => {
        setEligibility(res.data);
        setEligibilityLoading(false);
      })
      .catch((err) => {
        console.error("Error loading eligibility for course:", err);
        setEligibilityLoading(false);
      });
  }, [selectedCourse]);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        {/* Admission-focused Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-float" style={{ animationDelay: "3.s" }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-emerald text-emerald-350 text-xs font-semibold uppercase tracking-wider mb-6"
            >
              <Sparkles className="w-4 h-4 text-emerald-450 animate-pulse" />
              Admissions Open 2026-27
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-4xl sm:text-6xl font-black text-white leading-none tracking-tight mb-6"
            >
              Your Journey <br />
              <span className="gradient-text-emerald">Starts Here</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-navy-200 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Step into a world-class technology academy. Explore engineering disciplines, eligibility guidelines, documentation requirements and complete your enquiry.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/enquiry"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:from-emerald-400 hover:to-emerald-500 transition-all duration-350 shadow-lg shadow-emerald-500/20 hover:scale-105"
              >
                Submit Enquiry
              </Link>
              <Link
                href="/courses"
                className="px-6 py-3.5 rounded-xl glass border border-navy-700/60 text-white font-bold text-xs uppercase tracking-wider hover:border-emerald-500/40 hover:text-emerald-450 transition-all duration-350 hover:scale-105"
              >
                Explore Courses
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Steps & Eligibility */}
            <div className="lg:col-span-2 space-y-12">
              {/* Process steps */}
              <div className="glass p-6 sm:p-8 rounded-3xl border border-navy-700/30">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <ClipboardList className="w-6 h-6 text-emerald-400" />
                  Step-by-Step Admissions Procedure
                </h2>

                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="glass rounded-xl h-24" />
                    ))}
                  </div>
                ) : (
                  <div className="relative border-l border-navy-800 ml-4 sm:ml-6 space-y-8">
                    {steps.map((st, i) => (
                      <motion.div
                        key={st.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="relative pl-8 sm:pl-10"
                      >
                        {/* Step Indicator */}
                        <span className="absolute -left-[17px] top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-navy-800 text-xs text-white font-bold border-2 border-navy-950 shadow-lg">
                          0{st.step_number}
                        </span>

                        {/* Content Card */}
                        <div className="glass-light p-5 rounded-2xl border border-navy-800/30 hover:border-emerald-500/20 transition-all duration-300">
                          <h3 className="text-white font-bold text-sm sm:text-base mb-2">
                            {st.title}
                          </h3>
                          <p className="text-navy-300 text-xs sm:text-sm leading-relaxed">
                            {st.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Eligibility Explorer */}
              <div className="glass p-6 sm:p-8 rounded-3xl border border-navy-700/30">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-emerald-400" />
                  Eligibility Explorer
                </h2>
                <p className="text-navy-300 text-xs mb-6">
                  Select a B.Tech program below to check details of required qualifications, Board percentages, and cut-off exams.
                </p>

                <div className="mb-6">
                  <label htmlFor="eligibility-course-select" className="text-navy-450 text-[10px] font-black uppercase tracking-wider block mb-2">
                    Choose B.Tech Stream
                  </label>
                  <select
                    id="eligibility-course-select"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-light border border-navy-700 text-white font-semibold text-xs sm:text-sm focus:border-emerald-500/50 focus:outline-none bg-navy-900"
                  >
                    {availableCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <AnimatePresence mode="wait">
                  {eligibilityLoading ? (
                    <div className="p-8 glass rounded-2xl text-center animate-pulse text-navy-300 text-xs">
                      Loading eligibility parameters...
                    </div>
                  ) : (
                    eligibility && (
                      <motion.div
                        key={eligibility.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6 p-6 rounded-2xl bg-navy-950/40 border border-navy-800/40"
                      >
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <div className="text-[10px] font-black uppercase text-navy-450 tracking-widest mb-1">Required Qualification</div>
                            <div className="text-white text-xs sm:text-sm font-bold">{eligibility.qualification}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-black uppercase text-navy-450 tracking-widest mb-1">Board Percent Cutoff</div>
                            <div className="text-white text-xs sm:text-sm font-bold">Minimum {eligibility.minimum_percentage}% aggregate</div>
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] font-black uppercase text-navy-450 tracking-widest mb-1">Entrance Exams</div>
                          <div className="text-white text-xs sm:text-sm font-bold">{eligibility.entrance_requirement}</div>
                        </div>

                        {eligibility.additional_requirements && eligibility.additional_requirements.length > 0 && (
                          <div>
                            <div className="text-[10px] font-black uppercase text-navy-450 tracking-widest mb-2">Additional Guidelines</div>
                            <ul className="space-y-1.5">
                              {eligibility.additional_requirements.map((req, idx) => (
                                <li key={idx} className="text-navy-300 text-xs flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-450 shrink-0 mt-0.5" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    )
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar docs and timelines */}
            <div className="space-y-8">
              {/* Timeline */}
              <div className="glass p-6 rounded-3xl border border-navy-700/30">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Important Dates
                </h2>

                {loading ? (
                  <div className="space-y-3 animate-pulse h-28 glass rounded-xl" />
                ) : (
                  <div className="space-y-4">
                    {timeline.map((dt) => (
                      <div key={dt.id} className="pb-3 border-b border-navy-800/40 last:border-0 last:pb-0">
                        <span className="text-[10px] text-navy-400 uppercase font-semibold block mb-1">
                          {dt.event_name}
                        </span>
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-white font-bold text-xs sm:text-sm">{dt.start_date} - {dt.end_date}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {dt.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Document Checklist */}
              <div className="glass p-6 rounded-3xl border border-navy-700/30">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  Credentials Checklist
                </h2>

                {loading ? (
                  <div className="space-y-3 animate-pulse h-40 glass rounded-xl" />
                ) : (
                  <ul className="space-y-3">
                    {docs.map((doc) => (
                      <li key={doc.id} className="flex items-start gap-2.5 text-navy-200 text-xs sm:text-sm leading-relaxed">
                        <BookmarkCheck className={`w-4 h-4 shrink-0 mt-0.5 ${doc.mandatory ? "text-emerald-450" : "text-navy-500"}`} />
                        <div>
                          <div className="text-white font-bold text-xs">{doc.document_name}</div>
                          <div className="text-[10px] text-navy-450 mt-0.5">{doc.description}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Call out */}
              <div className="relative rounded-3xl overflow-hidden p-6 border border-emerald-500/20 bg-gradient-to-br from-navy-950 to-emerald-950/20 flex flex-col justify-between group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-20 h-20 text-emerald-450" />
                </div>
                <div className="mb-6">
                  <h3 className="text-white font-bold text-base mb-2">Submit Enquiry Form</h3>
                  <p className="text-navy-350 text-xs leading-relaxed">
                    Have additional questions about branches, fee structures or counseling codes? Submit a form to our admissions counselor desk.
                  </p>
                </div>
                <Link
                  href="/enquiry"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs sm:text-sm font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-all duration-200 shadow-lg group-hover:scale-105 text-center"
                >
                  Go to Enquiry Desk
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
