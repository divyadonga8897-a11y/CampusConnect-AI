"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Sparkles, Navigation } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { COLLEGE_INFO } from "@/constants/collegeData";
import { enquiryService, type ContactDetail } from "@/services/enquiryService";

export default function ContactClient() {
  const [aiOpen, setAiOpen]     = useState(false);
  const [contacts, setContacts] = useState<ContactDetail[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    enquiryService.getContactInfo()
      .then((res) => { setContacts(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Contact Us"
          title="Connect With"
          highlight="SSIET"
          description="Find contact details for our admissions office, departments, and campus location."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
          actions={
            <button onClick={() => setAiOpen(true)} className="btn btn-primary">
              <Sparkles className="w-4 h-4 text-emerald-300" /> Ask AI Assistant
            </button>
          }
        />

        <div className="container py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* Contact Cards */}
            <div className="space-y-5">
              {loading ? (
                [1, 2].map(i => <div key={i} className="skeleton h-40 rounded-xl" />)
              ) : (
                contacts.map((contact, i) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                    className="card p-6"
                  >
                    <span className="badge badge-blue mb-3">Support Desk</span>
                    <h3 className="text-base font-bold text-slate-900 mb-4">{contact.department}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                        <a href={`tel:${contact.phone}`} className="font-semibold hover:text-blue-600 transition-colors">
                          {contact.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                        <a href={`mailto:${contact.email}`} className="font-semibold hover:text-blue-600 transition-colors">
                          {contact.email}
                        </a>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span>{contact.address}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-500 pt-3 border-t border-slate-100">
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{contact.office_hours}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}

              {/* Helpline Card */}
              <div className="card p-5 bg-blue-600 border-blue-700 text-white">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-200 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">Admissions Helpline</h4>
                    <p className="text-blue-100 text-xs leading-relaxed">
                      For immediate help with documents, scholarships, and admission queries — contact our counselors directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map / Location Card */}
            <div className="card overflow-hidden">
              <div className="bg-slate-100 p-4 flex items-center gap-2 border-b border-slate-200">
                <Navigation className="w-4 h-4 text-blue-500 animate-bounce" />
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Campus Location</span>
              </div>
              <div className="p-6 flex flex-col items-center justify-center text-center gap-4" style={{ minHeight: 300 }}>
                <MapPin className="w-12 h-12 text-blue-500" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">SSIET Campus</h4>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                    {COLLEGE_INFO.address}
                  </p>
                  <div className="badge badge-slate mt-3 text-[10px]">
                    16.6358° N | 81.7248° E
                  </div>
                </div>
                <a
                  href="https://maps.google.com/?q=Sri+Satya+Institute+Engineering+West+Godavari+Andhra+Pradesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  Open in Google Maps
                </a>
              </div>

              {/* Quick Info Row */}
              <div className="border-t border-slate-200 grid grid-cols-2 divide-x divide-slate-200">
                <div className="p-4 text-center">
                  <div className="text-xs font-black text-slate-900">Mon – Sat</div>
                  <div className="text-xs text-slate-400">Office Hours</div>
                </div>
                <div className="p-4 text-center">
                  <div className="text-xs font-black text-slate-900">9AM – 5PM</div>
                  <div className="text-xs text-slate-400">Working Hours</div>
                </div>
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
