"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag, Clock, ArrowRight, Sparkles, MapPin } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { campusService, type CampusEventItem } from "@/services/campusService";

const categories = ["All", "Hackathons", "Festivals", "Workshops", "Technical Events", "Cultural Events"];

export default function EventsClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [events, setEvents] = useState<CampusEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState("All");

  useEffect(() => {
    campusService.getEvents()
      .then((res) => {
        setEvents(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading events list:", err);
        setLoading(false);
      });
  }, []);

  const filteredEvents = events.filter((evt) => {
    return selectedCat === "All" || evt.category.toLowerCase() === selectedCat.toLowerCase();
  });

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="Campus Events & Fests"
            title="What's Happening at"
            highlight="Sri Satya Campus"
            description="Explore our campus calendar! Join state-level hackathons, coding workshops, guest conferences, and massive cultural fests."
            className="mb-10"
          />

          {/* Event Category filter bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                  selectedCat === cat
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-500/20 shadow-md shadow-emerald-500/10"
                    : "glass border-navy-750 text-navy-300 hover:text-white hover:border-navy-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Timeline / Cards grid */}
          {loading ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="glass rounded-2xl h-40 animate-pulse border border-navy-700/30" />
              ))}
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {filteredEvents.map((evt, i) => (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="glass rounded-2xl p-6 border border-navy-700/30 card-hover relative overflow-hidden group flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-emerald-550/5 blur-xl pointer-events-none" />

                  {/* Left Detail Side */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {evt.category}
                      </span>
                      <span className="text-navy-450 text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5 text-emerald-450" />
                        {evt.event_date}
                      </span>
                    </div>

                    <h3 className="text-white font-extrabold text-base sm:text-lg group-hover:text-emerald-455 transition-colors">
                      {evt.event_name}
                    </h3>
                    <p className="text-navy-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                      {evt.description}
                    </p>
                  </div>

                  {/* Right Status / Action Side */}
                  <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 md:border-l border-navy-800/40 pt-4 md:pt-0 md:pl-6 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-navy-450 font-bold uppercase block">Venue Placement</span>
                      <span className="text-white text-xs font-bold flex items-center gap-1 mt-0.5 justify-start md:justify-end">
                        <MapPin className="w-3.5 h-3.5 text-emerald-450" />
                        Central Campus Block
                      </span>
                    </div>

                    <button
                      onClick={() => setAiOpen(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-1 group/btn"
                    >
                      Inquire Details
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {filteredEvents.length === 0 && (
                <div className="glass rounded-2xl p-8 border border-navy-700/30 text-center">
                  <span className="text-navy-400 text-sm">No events listed in this category right now. Check back soon!</span>
                </div>
              )}
            </div>
          )}

          {/* AI Visual Preparation */}
          <div className="mt-12 max-w-4xl mx-auto glass rounded-2xl p-6 border border-emerald-500/20 bg-gradient-to-r from-navy-950 to-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-450 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-bold text-sm">Live Coverage & Highlights</h4>
                <p className="text-navy-300 text-xs leading-relaxed max-w-xl">
                  Future platform releases will support video broadcast channels and live image gallery streams direct from fests workshops and tech events.
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
