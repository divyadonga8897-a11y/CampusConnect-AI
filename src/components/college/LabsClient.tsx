"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Cpu, Users } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { campusService, type LaboratoryItem } from "@/services/campusService";

const deptFilters: Record<string, string> = {
  all: "All", cse: "CSE", aids: "AI & DS", ece: "ECE",
};

export default function LabsClient() {
  const [aiOpen, setAiOpen]           = useState(false);
  const [labs, setLabs]               = useState<LaboratoryItem[]>([]);
  const [loading, setLoading]         = useState(true);
  const [selectedDept, setSelectedDept] = useState("all");

  useEffect(() => {
    campusService.getLabs()
      .then((res) => { setLabs(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredLabs = labs.filter((lab) =>
    selectedDept === "all" || lab.department_id === selectedDept
  );

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Laboratories"
          title="State-of-the-Art"
          highlight="Labs & Research Spaces"
          description="Over 15 specialized labs with modern equipment, GPU clusters, and dedicated research zones for every engineering department."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Laboratories" }]}
        />

        <div className="container py-12">
          {/* Department Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.entries(deptFilters).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setSelectedDept(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                  selectedDept === id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-48 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLabs.map((lab, i) => (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="card p-5 group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                      <FlaskConical className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {lab.lab_name}
                      </h3>
                      {lab.department_id && (
                        <span className="badge badge-blue text-[10px] mt-0.5">
                          {deptFilters[lab.department_id] ?? lab.department_id}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{lab.description}</p>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                    {lab.capacity > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {lab.capacity} seats
                      </span>
                    )}
                    {lab.equipment_details?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3" /> {lab.equipment_details.length}+ equipment
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
