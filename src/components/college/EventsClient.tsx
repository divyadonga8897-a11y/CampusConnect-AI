"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { campusService, type CampusEventItem } from "@/services/campusService";

const categories = ["All", "Hackathons", "Festivals", "Workshops", "Technical Events", "Cultural Events"];

const catColors: Record<string, string> = {
  "Hackathons":       "badge-blue",
  "Festivals":        "badge-amber",
  "Workshops":        "badge-green",
  "Technical Events": "badge-blue",
  "Cultural Events":  "badge-amber",
};

export default function EventsClient() {
  const [aiOpen, setAiOpen]           = useState(false);
  const [events, setEvents]           = useState<CampusEventItem[]>([]);
  const [loading, setLoading]         = useState(true);
  const [selectedCat, setSelectedCat] = useState("All");

  useEffect(() => {
    campusService.getEvents()
      .then((res) => { setEvents(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) =>
    selectedCat === "All" || e.category?.toLowerCase() === selectedCat.toLowerCase()
  );

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Events & Activities"
          title="Campus Life &"
          highlight="Events"
          description="Hackathons, tech fests, cultural events, workshops — a vibrant student life calendar throughout the year."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Events" }]}
        />

        <div className="container py-12">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                  selectedCat === cat
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-52 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="card p-5 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`badge ${catColors[event.category] ?? "badge-slate"} text-[10px]`}>
                      {event.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {event.event_name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">{event.description}</p>

                  <div className="space-y-1.5 text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {event.event_date}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="card p-10 text-center">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No events in this category.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
