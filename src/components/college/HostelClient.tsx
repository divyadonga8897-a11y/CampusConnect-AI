"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Utensils, Home, Compass, Layers, CheckCircle2, AlertCircle } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { campusService, type HostelInfo } from "@/services/campusService";

export default function HostelClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [hostels, setHostels] = useState<HostelInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    campusService.getHostels()
      .then((res) => {
        setHostels(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading hostel info:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="Residential Living"
            title="Secure & Nutritious"
            highlight="Student Accommodations"
            description="Our campus provides separate, fully-furnished hostels for boys and girls with strict perimeter security, recreation spaces and healthy vegetarian dining halls."
            className="mb-12"
          />

          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="glass rounded-2xl h-[500px] animate-pulse border border-navy-700/30" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {hostels.map((hostel, i) => (
                <motion.div
                  key={hostel.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="glass rounded-3xl p-6 sm:p-8 border border-navy-700/30 flex flex-col justify-between card-hover relative overflow-hidden"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-navy-800/40">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20">
                        <Home className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-450">
                          {hostel.room_type}
                        </span>
                        <h3 className="text-white font-extrabold text-lg sm:text-xl mt-0.5">{hostel.hostel_type}</h3>
                      </div>
                    </div>

                    <p className="text-navy-300 text-xs sm:text-sm leading-relaxed mb-6">
                      {hostel.description}
                    </p>

                    <div className="space-y-6">
                      {/* Accommodation Facilities */}
                      <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-emerald-455" />
                          Boarding Amenities
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {hostel.facilities.map((fac, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-navy-200 text-xs">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{fac}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mess & Dining info */}
                      <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <Utensils className="w-4 h-4 text-gold-450" />
                          Food & Dining Mess
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {hostel.mess_information.map((mess, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-navy-200 text-xs">
                              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                              <span>{mess}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Security Parameters */}
                      <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-blue-450" />
                          Safety & Surveillance
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {hostel.security_features.map((sec, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-navy-200 text-xs">
                              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                              <span>{sec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Capacity Info */}
                  <div className="mt-8 pt-4 border-t border-navy-800/40 flex items-center justify-between">
                    <span className="text-navy-450 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      Total Capacity: {hostel.capacity} Candidates
                    </span>
                    <span className="text-[10px] text-navy-450 font-bold uppercase">SSIET Residential Registry</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Guidelines Box */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6 border border-gold-550/20 bg-gold-900/5 flex items-start gap-4 mt-12"
          >
            <AlertCircle className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm mb-1.5">Important Residency Rules</h4>
              <p className="text-navy-300 text-xs sm:text-sm leading-relaxed">
                Hostel allotments are processed strictly on first-come-first-served basis during admission seat locking. Mandatory curfew rules are enforced (10:00 PM for Boys, 8:30 PM for Girls). Visitors and parents are requested to obtain pass receipts at the security gateway prior to entry.
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
