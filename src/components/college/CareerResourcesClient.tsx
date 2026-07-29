"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, ArrowRight, Download, HelpCircle, Award } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { careerService, type CareerResourceDetail } from "@/services/careerService";

export default function CareerResourcesClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [resources, setResources] = useState<CareerResourceDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    careerService.getCareerResources()
      .then((res) => {
        setResources(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading career resources:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="Preparation Desk"
            title="Career Guidance"
            highlight="Resources"
            description="Access self-study coding roadmaps, verbal reasoning guides, sample resumes, and common aptitude interview question lists curated by experts."
            className="mb-14"
          />

          {loading ? (
            <div className="grid sm:grid-cols-2 gap-8 animate-pulse">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="glass h-48 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-8">
              {resources.map((res, i) => (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass rounded-3xl p-6 sm:p-8 border border-navy-700/30 card-hover flex flex-col justify-between"
                >
                  <div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider mb-3.5 inline-block">
                      {res.resource_type}
                    </span>
                    <h3 className="text-white font-extrabold text-base sm:text-lg mb-2">
                      {res.title}
                    </h3>
                    <p className="text-navy-300 text-xs sm:text-sm leading-relaxed mb-6">
                      {res.description}
                    </p>
                  </div>

                  <a
                    href={res.link}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-800 text-white hover:text-emerald-400 hover:border-emerald-500/35 transition-all text-xs font-bold uppercase tracking-wider w-full sm:w-auto self-start mt-4"
                  >
                    <Download className="w-4 h-4 text-emerald-450" />
                    Download PDF Resource
                  </a>
                </motion.div>
              ))}
            </div>
          )}

          {/* Help box */}
          <div className="mt-12 glass rounded-2xl p-6 border border-navy-750 flex items-start gap-4">
            <HelpCircle className="w-5 h-5 text-emerald-450 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Corporate Guest Lectures</h4>
              <p className="text-navy-305 text-xs sm:text-sm leading-relaxed">
                Stay updated on industry trends. We organize guest panels from Google, Amazon, and Microsoft tech leads on weekly schedule streams. Keep checking notification banners.
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
