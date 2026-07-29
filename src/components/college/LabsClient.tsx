"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Microscope, Cpu, Layers, HardDrive, Terminal, Users, Filter, Sparkles } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { campusService, type LaboratoryItem } from "@/services/campusService";

const departmentLabels: Record<string, string> = {
  all: "All Departments",
  cse: "Computer Science (CSE)",
  aids: "Artificial Intelligence (AI&DS)",
  ece: "Electronics (ECE)"
};

export default function LabsClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [labs, setLabs] = useState<LaboratoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState("all");

  useEffect(() => {
    campusService.getLabs()
      .then((res) => {
        setLabs(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading laboratories:", err);
        setLoading(false);
      });
  }, []);

  const filteredLabs = labs.filter((lab) => {
    return selectedDept === "all" || lab.department_id === selectedDept;
  });

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="Laboratory Showcase"
            title="Scientific Innovation &"
            highlight="Practical Centers"
            description="Explore our industry-aligned research hubs and technology blocks featuring GPU grids, communications analyzer boards and software suites."
            className="mb-10"
          />

          {/* Department filter bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {Object.entries(departmentLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedDept(key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                  selectedDept === key
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-500/20 shadow-md shadow-emerald-500/10"
                    : "glass border-navy-750 text-navy-300 hover:text-white hover:border-navy-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Laboratories Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="glass rounded-2xl h-96 animate-pulse border border-navy-700/30" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredLabs.map((lab, i) => (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 sm:p-8 border border-navy-700/30 flex flex-col justify-between card-hover relative overflow-hidden group"
                >
                  <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-emerald-550/5 blur-xl pointer-events-none" />

                  <div>
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-5 pb-4 border-b border-navy-800/40">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20">
                        {lab.department_id === "ece" ? <Cpu className="w-6 h-6" /> : <Microscope className="w-6 h-6" />}
                      </div>
                      <div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider">
                          Department: {lab.department_id.toUpperCase()}
                        </span>
                        <h3 className="text-white font-extrabold text-base sm:text-lg mt-1 group-hover:text-emerald-450 transition-colors">
                          {lab.lab_name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-navy-300 text-xs sm:text-sm leading-relaxed mb-6">
                      {lab.description}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6 mb-6">
                      {/* Equipment Details */}
                      <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <HardDrive className="w-4 h-4 text-emerald-450" />
                          Key Equipment
                        </h4>
                        <ul className="space-y-1.5">
                          {lab.equipment_details.map((eq, idx) => (
                            <li key={idx} className="text-navy-200 text-xs flex items-start gap-2">
                              <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                              <span>{eq}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Software Details */}
                      <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <Terminal className="w-4 h-4 text-gold-450" />
                          Software Toolsets
                        </h4>
                        <ul className="space-y-1.5">
                          {lab.software_details.map((sw, idx) => (
                            <li key={idx} className="text-navy-200 text-xs flex items-start gap-2">
                              <span className="w-1 h-1 rounded-full bg-gold-400 shrink-0 mt-1.5" />
                              <span>{sw}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Footer Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-navy-800/40">
                    <span className="text-navy-450 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      Capacity: {lab.capacity} seats
                    </span>
                    <span className="text-emerald-450 text-[10px] uppercase font-black tracking-widest flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      Active Node
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* AI generated visual callout */}
          <div className="mt-12 glass rounded-2xl p-6 border border-emerald-500/20 bg-gradient-to-r from-navy-950 to-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-450 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="text-white font-bold text-sm">Visual Verification & Virtual Tours</h4>
                <p className="text-navy-300 text-xs leading-relaxed max-w-xl">
                  We are preparing high-resolution 360-degree photography views and live telemetry streams to display computing clusters workloads directly in future updates.
                </p>
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
