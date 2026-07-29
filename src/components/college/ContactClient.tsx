"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Navigation, HelpCircle, Sparkles } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { enquiryService, type ContactDetail } from "@/services/enquiryService";

export default function ContactClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [contacts, setContacts] = useState<ContactDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    enquiryService.getContactInfo()
      .then((res) => {
        setContacts(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading contact list:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="Contact & Location"
            title="Connect With Our"
            highlight="Guidance Desk"
            description="Find contact details for the admissions office, engineering departments, administrative wings, and locate us on the map."
            className="mb-14"
          />

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Contact Cards */}
            <div className="lg:col-span-6 space-y-6">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <div key={idx} className="glass rounded-2xl h-48 animate-pulse" />
                  ))}
                </div>
              ) : (
                contacts.map((contact, i) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="glass rounded-2xl p-6 sm:p-8 border border-navy-700/30 card-hover group"
                  >
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider mb-3.5 inline-block">
                      Support desk
                    </span>
                    <h3 className="text-white font-extrabold text-base sm:text-lg mb-4">
                      {contact.department}
                    </h3>

                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3 text-navy-200 text-xs sm:text-sm">
                        <Phone className="w-4.5 h-4.5 text-emerald-450 shrink-0" />
                        <span className="font-semibold">{contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-navy-200 text-xs sm:text-sm">
                        <Mail className="w-4.5 h-4.5 text-emerald-450 shrink-0" />
                        <span className="font-semibold">{contact.email}</span>
                      </div>
                      <div className="flex items-start gap-3 text-navy-200 text-xs sm:text-sm">
                        <MapPin className="w-4.5 h-4.5 text-emerald-450 shrink-0 mt-0.5" />
                        <span>{contact.address}</span>
                      </div>
                      <div className="flex items-center gap-3 text-navy-200 text-xs sm:text-sm pt-2 border-t border-navy-800/40">
                        <Clock className="w-4.5 h-4.5 text-gold-450 shrink-0" />
                        <span className="text-navy-350">{contact.office_hours}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Maps / Vector Blueprint Visual */}
            <div className="lg:col-span-6 glass rounded-3xl border border-navy-700/30 overflow-hidden p-4 relative h-[450px]">
              <div className="absolute top-8 left-8 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-light text-[10px] text-white font-bold uppercase tracking-wider">
                <Navigation className="w-3.5 h-3.5 text-emerald-450 animate-bounce" />
                GPS Campus Locator
              </div>

              <div className="relative w-full h-full bg-navy-950/65 rounded-2xl overflow-hidden shadow-inner flex flex-col items-center justify-center border border-navy-800/30">
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-45" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="contactGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563eb" strokeWidth="0.5" strokeOpacity="0.25" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#contactGrid)" />
                </svg>

                <div className="text-center p-6 z-10 relative">
                  <MapPin className="w-10 h-10 text-emerald-400 mx-auto mb-2 animate-bounce" />
                  <h4 className="text-white font-black text-sm uppercase tracking-wider">SSIET Campus Coordinates</h4>
                  <p className="text-navy-300 text-xs mt-1 max-w-sm mx-auto leading-relaxed">
                    Sri Satya Nagar, Narsapur Road, West Godavari, Andhra Pradesh - 534001, India.
                  </p>
                  <div className="text-[10px] text-navy-450 mt-4 uppercase font-bold tracking-widest border border-navy-800/40 px-3 py-1 rounded bg-navy-900/60 inline-block">
                    Lat: 16.6358° N | Lon: 81.7248° E
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 glass rounded-2xl p-6 border border-emerald-500/20 bg-gradient-to-r from-navy-950 to-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-450 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-bold text-sm">Admissions Helpline</h4>
                <p className="text-navy-300 text-xs leading-relaxed max-w-xl">
                  For immediate processing of documents guidelines or scholarship applications status checks, please contact our general counselor registry directly.
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
