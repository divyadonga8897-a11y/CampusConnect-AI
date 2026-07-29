"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Monitor, Brain, Cpu, BookOpen, Lightbulb, MapPin, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { campusService, type Facility } from "@/services/campusService";

const iconMap: Record<string, React.ElementType> = {
  "smart-classrooms": Monitor,
  "ai-labs": Brain,
  "programming-labs": Cpu,
  "central-library": BookOpen,
  "innovation-center": Lightbulb,
};

export default function InfrastructureClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    campusService.getFacilities().then((res) => {
      setFacilities(res.data);
    });
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="Campus Assets"
            title="Premium Academic"
            highlight="Infrastructure"
            description="Explore our tech-integrated academic assets engineered to facilitate high-intensity learning, computing research, and design innovation."
            className="mb-14"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((fac, i) => {
              const Icon = iconMap[fac.id] ?? Monitor;

              return (
                <motion.div
                  key={fac.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="glass rounded-2xl overflow-hidden border border-navy-700/30 card-hover flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Image placeholder */}
                    <div className="h-44 bg-navy-950/60 relative overflow-hidden flex items-center justify-center border-b border-navy-800/40">
                      <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none" />
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-navy-600/20 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Icon className="w-8 h-8 text-emerald-400" />
                      </div>
                      <span className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg glass-light text-[10px] text-navy-200 font-semibold">
                        <MapPin className="w-3 h-3 text-emerald-450 shrink-0" />
                        {fac.location}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-white font-bold text-base sm:text-lg mb-2 flex items-center gap-2">
                        {fac.name}
                      </h3>
                      <p className="text-navy-300 text-sm leading-relaxed mb-6">
                        {fac.description}
                      </p>
                    </div>
                  </div>

                  {/* Highlights checklist footer */}
                  <div className="px-6 pb-6 pt-2 border-t border-navy-800/20 space-y-2">
                    {[
                      "Fully air-conditioned environments",
                      "24/7 dedicated support technicians",
                      "Integration with student digital IDs",
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-navy-350 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-450 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
