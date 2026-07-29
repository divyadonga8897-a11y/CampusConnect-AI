"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  IndianRupee,
  Download,
  Info,
  CheckCircle2,
  Calendar,
  Filter,
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { academicService, type FeeItem, type CourseSummary } from "@/services/academicService";

export default function FeesClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedYear, setSelectedYear] = useState("2024-25");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    Promise.all([
      academicService.getFees(),
      academicService.getCourses()
    ]).then(([feeRes, courseRes]) => {
      setFees(feeRes.data || []);
      setCourses(courseRes.data || []);
      setLoading(false);
    }).catch(err => {
      console.error("Error loading fees catalog:", err);
      setLoading(false);
    });
  }, []);

  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const matchCourse = selectedCourse === "all" || fee.course_id === selectedCourse;
      const matchYear = fee.academic_year === selectedYear;
      return matchCourse && matchYear;
    });
  }, [fees, selectedCourse, selectedYear]);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(
        "Fee Brochure Download Started!\n\nThis is a placeholder PDF file structure. Real brochure generation will be completed in later phases."
      );
    }, 1500);
  };

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="Financial Information"
            title="Complete Fee"
            highlight="Transparency"
            description="Explore annual tuition fees, hostel charges, and other charges categorised by seats quotas (Government vs Management vs Scholarships)."
            className="mb-10"
          />

          {/* Controls / Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-2xl p-4 border border-navy-700/30 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-navy-300 text-sm">
                <Filter className="w-4 h-4 text-emerald-450" />
                <span>Filters:</span>
              </div>
              <select
                id="fee-course-filter"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-3 py-2 rounded-xl glass-light text-white text-xs sm:text-sm border border-navy-700/30 focus:border-emerald-500/40 focus:outline-none bg-navy-900"
              >
                <option value="all">All Programs</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.course_name}
                  </option>
                ))}
              </select>
              <select
                id="fee-year-filter"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 rounded-xl glass-light text-white text-xs sm:text-sm border border-navy-700/30 focus:border-emerald-500/40 focus:outline-none bg-navy-900"
              >
                <option value="2024-25">A.Y. 2024-25</option>
                <option value="2023-24">A.Y. 2023-24</option>
              </select>
            </div>

            <button
              onClick={handleDownload}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs sm:text-sm font-black uppercase tracking-wider hover:from-emerald-400 hover:to-emerald-500 transition-all duration-200 shadow-lg hover:shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              {downloading ? "Generating PDF..." : "Download Fee Brochure"}
            </button>
          </motion.div>

          {/* Fee Cards Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="glass rounded-2xl p-6 border border-navy-700/30 animate-pulse h-80" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {filteredFees.map((fee, i) => (
                <motion.div
                  key={fee.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 sm:p-8 border border-navy-700/30 flex flex-col justify-between card-hover relative overflow-hidden"
                >
                  <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-emerald-550/10 blur-xl pointer-events-none" />

                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-450 border border-emerald-500/20">
                          {fee.fee_type}
                        </span>
                        <h3 className="text-white font-extrabold text-sm sm:text-base mt-2.5 leading-snug">
                          {fee.course_name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-navy-450 text-xs font-bold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-450" />
                          {fee.academic_year}
                        </div>
                      </div>
                    </div>

                    {/* Fee Breakdown */}
                    <div className="space-y-3 py-4 border-t border-b border-navy-800/40 my-4">
                      {[
                        { label: "Annual Tuition Fee", value: fee.tuition_fee },
                        { label: "Hostel Fee (Optional)", value: fee.hostel_fee },
                        { label: "Other Admin Charges", value: fee.other_charges },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-navy-200">{item.label}</span>
                          <span className="text-white font-bold flex items-center gap-0.5">
                            <IndianRupee className="w-3.5 h-3.5 text-navy-450" />
                            {item.value.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {/* Total Fee */}
                    <div className="flex items-center justify-between py-2 mb-4">
                      <span className="text-white font-extrabold text-xs sm:text-sm">Total Fee / Year</span>
                      <span className="text-xl sm:text-2xl font-black gradient-text-gold flex items-center gap-0.5">
                        <IndianRupee className="w-5 h-5 shrink-0" />
                        {fee.total_fee.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Scholarships Applicable
                      </span>
                      <Link
                        href="/scholarships"
                        className="text-xs text-navy-300 hover:text-emerald-400 underline transition-colors"
                      >
                        View Scholarship Criteria
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Guidelines Alert */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6 border border-gold-550/20 bg-gold-900/5 flex items-start gap-4"
          >
            <Info className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Important Fee Guidelines</h4>
              <p className="text-navy-300 text-xs sm:text-sm leading-relaxed">
                Tuition fee is subject to state government guidelines and university regulations. Optional hostel fee
                includes accommodation and boarding charges. Fee payment details can be requested at the office.
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
