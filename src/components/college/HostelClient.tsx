"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Utensils, Home, CheckCircle2, Wifi, Lock } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import { campusService, type HostelInfo } from "@/services/campusService";

export default function HostelClient() {
  const [aiOpen, setAiOpen]   = useState(false);
  const [hostels, setHostels] = useState<HostelInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    campusService.getHostels()
      .then((res) => { setHostels(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Residential Life"
          title="Secure & Comfortable"
          highlight="Student Hostels"
          description="Separate, well-furnished hostels for boys and girls with 24/7 security, Wi-Fi, and hygienic dining facilities."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Hostel" }]}
        />

        <div className="container py-12">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map(i => <div key={i} className="skeleton h-72 rounded-xl" />)}
            </div>
          ) : (
            <>
              {/* Hostel Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                {hostels.map((hostel, i) => (
                  <motion.div
                    key={hostel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="card overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="badge badge-blue text-[11px]">
                          {hostel.hostel_type === "boys" ? "Boys Hostel" : "Girls Hostel"}
                        </span>
                        <span className="badge badge-slate text-[11px]">{hostel.room_type}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <div className="text-label text-slate-400">Capacity</div>
                          <div className="text-xs font-semibold text-slate-900 mt-0.5">{hostel.capacity} students</div>
                        </div>
                        <div>
                          <div className="text-label text-slate-400">Room Type</div>
                          <div className="text-xs font-semibold text-slate-900 mt-0.5">{hostel.room_type}</div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed mb-4">{hostel.description}</p>

                      {/* Facilities */}
                      {hostel.facilities && hostel.facilities.length > 0 && (
                        <div>
                          <div className="text-label text-slate-400 mb-2">Facilities</div>
                          <div className="flex flex-wrap gap-1.5">
                            {hostel.facilities.map((f) => (
                              <span key={f} className="badge badge-green text-[10px]">
                                <CheckCircle2 className="w-2.5 h-2.5" /> {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Security */}
                      {hostel.security_features && hostel.security_features.length > 0 && (
                        <div className="mt-3">
                          <div className="text-label text-slate-400 mb-2">Security</div>
                          <div className="flex flex-wrap gap-1.5">
                            {hostel.security_features.map((s) => (
                              <span key={s} className="badge badge-slate text-[10px]">
                                <ShieldCheck className="w-2.5 h-2.5" /> {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Rules / Info */}
              <div className="card p-6">
                <SectionHeader
                  eyebrow="Guidelines"
                  title="Hostel Rules &"
                  highlight="Policies"
                  align="left"
                  className="mb-5"
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: Lock,        text: "24/7 security with CCTV monitoring"               },
                    { icon: Utensils,    text: "Hygienic vegetarian mess with daily menu"          },
                    { icon: Wifi,        text: "High-speed Wi-Fi available in all rooms"           },
                    { icon: ShieldCheck, text: "Strict visitor policy to ensure resident safety"   },
                    { icon: Home,        text: "Common rooms, TV rooms, and recreation spaces"     },
                    { icon: ShieldCheck, text: "Regular medical check-ups and first aid facilities"},
                  ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <Icon className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
