"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Info, Sparkles, Navigation, X, Check, Building2, Eye } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { campusService, type CampusLocation, type InfrastructureItem } from "@/services/campusService";

export default function CampusTourClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [infrastructures, setInfrastructures] = useState<InfrastructureItem[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<CampusLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      campusService.getCampusLocations(),
      campusService.getInfrastructure()
    ]).then(([locRes, infraRes]) => {
      setLocations(locRes.data || []);
      setInfrastructures(infraRes.data || []);
      setLoading(false);
    }).catch((err) => {
      console.error("Error fetching campus details:", err);
      setLoading(false);
    });
  }, []);

  const handleStartTour = () => {
    const mapElement = document.getElementById("interactive-map-section");
    mapElement?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToInfra = () => {
    const infraElement = document.getElementById("infrastructure-section");
    infraElement?.scrollIntoView({ behavior: "smooth" });
  };

  const mapHotspots = [
    { id: "entrance", cx: 120, cy: 380, radius: 20, name: "Main Entrance", color: "from-blue-500 to-indigo-600" },
    { id: "acad-block", cx: 280, cy: 260, radius: 25, name: "Academic Block", color: "from-emerald-500 to-teal-600" },
    { id: "library", cx: 320, cy: 380, radius: 22, name: "Central Library", color: "from-purple-500 to-fuchsia-600" },
    { id: "hostel", cx: 680, cy: 220, radius: 24, name: "Hostel Block", color: "from-pink-500 to-rose-600" },
    { id: "sports", cx: 600, cy: 380, radius: 26, name: "Sports Arena", color: "from-orange-500 to-red-600" },
  ];

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-mesh">
        {/* Immersive Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
          {/* Subtle animated moving blobs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-float" style={{ animationDelay: "3s" }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-emerald text-emerald-350 text-xs font-semibold uppercase tracking-wider mb-6"
            >
              <Sparkles className="w-4 h-4 text-emerald-450" />
              Sri Satya virtual campus tour
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-4xl sm:text-6xl font-black text-white leading-none tracking-tight mb-6"
            >
              Experience Our Campus <br />
              <span className="gradient-text-emerald">Beyond Classrooms</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-navy-200 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Take a high-definition virtual walk through the laboratories, accommodation residencies, green quadrangles, digital libraries, and recreational arenas of SSIET.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <button
                onClick={handleScrollToInfra}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:scale-105"
              >
                Explore Facilities
              </button>
              <button
                onClick={handleStartTour}
                className="px-6 py-3.5 rounded-xl glass border border-navy-700/60 text-white font-bold text-xs uppercase tracking-wider hover:border-emerald-500/40 hover:text-emerald-450 transition-all duration-300 hover:scale-105"
              >
                Start Virtual Tour
              </button>
            </motion.div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 hidden lg:flex">
            {[
              { title: "2D Vector Blueprint", desc: "Interactive map navigation" },
              { title: "Smart Classrooms", desc: "Digital blended setups" },
              { title: "Residencies & Mess", desc: "Boys & Girls Hostel insights" },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
                className="glass rounded-xl p-4 border border-navy-700/35 min-w-[200px] text-center"
              >
                <div className="text-white text-xs font-bold">{card.title}</div>
                <div className="text-[10px] text-navy-450 mt-1">{card.desc}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Infrastructure Section */}
        <section id="infrastructure-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          <SectionTitle
            badge="Campus Infrastructure"
            title="World-Class Facilities &"
            highlight="Academic Spaces"
            description="Our campus provides top-tier structures ensuring research excellence, recreational balance and residential comfort."
          />

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="glass rounded-2xl h-80 animate-pulse border border-navy-700/30" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {infrastructures.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass rounded-2xl border border-navy-700/30 overflow-hidden card-hover group flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Area */}
                    <div className="h-48 bg-navy-950 relative overflow-hidden flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-emerald-500/20 absolute" />
                      <div className="absolute inset-0 bg-mesh opacity-30" />
                      <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                        {item.facility_type}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-white font-extrabold text-base sm:text-lg mb-2 leading-snug group-hover:text-emerald-450 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-navy-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                        {item.description}
                      </p>

                      {/* Location Badge */}
                      <div className="flex items-center gap-1.5 text-navy-450 text-xs font-bold mb-4 uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5 text-emerald-450 shrink-0" />
                        {item.location} {item.capacity ? `| Capacity: ${item.capacity}` : ""}
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1.5">
                        {item.features.map((feat) => (
                          <span key={feat} className="px-2 py-1 rounded bg-navy-900/60 border border-navy-800/40 text-navy-200 text-[10px] font-semibold">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={handleStartTour}
                      className="w-full py-2.5 rounded-xl glass border border-navy-700 hover:border-emerald-500/30 text-white hover:text-emerald-400 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      View on Campus Map
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Blueprint Map Exploration */}
        <section id="interactive-map-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          <SectionTitle
            badge="Virtual Experience"
            title="Interactive Campus"
            highlight="2D Blueprint Radar"
            description="Click on any glowing radar checkpoint to open high-definition land views, capacities and zone directories."
            className="mb-14"
          />

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Map Canvas */}
            <div className="lg:col-span-8 glass rounded-2xl border border-navy-700/30 overflow-hidden p-4 relative">
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-light text-[10px] text-white font-bold uppercase tracking-wider">
                <Navigation className="w-3.5 h-3.5 text-emerald-450 animate-bounce" />
                Active Radar Blueprint
              </div>

              <div className="relative aspect-[4/3] w-full bg-navy-950/65 rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-navy-800/30">
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.2" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#gridPattern)" />
                </svg>

                <svg
                  viewBox="0 0 800 500"
                  className="w-full h-full transition-all relative z-10"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Road pathways */}
                  <path d="M 120 400 L 320 400 L 600 400 L 680 240 M 320 400 L 320 280 L 280 280 M 320 280 L 480 200" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.2" />

                  {/* Entrance Block Drawing */}
                  <rect x="70" y="340" width="100" height="80" rx="8" fill="#1e4080" fillOpacity="0.05" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="3" />
                  
                  {/* Academic Block Drawing */}
                  <rect x="220" y="210" width="120" height="100" rx="8" fill="#065f46" fillOpacity="0.05" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3" />

                  {/* Central Library Drawing */}
                  <circle cx="320" cy="380" r="45" fill="#581c87" fillOpacity="0.05" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3" />

                  {/* Hostel Block Drawing */}
                  <rect x="620" y="160" width="120" height="120" rx="8" fill="#9f1239" fillOpacity="0.05" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3" />

                  {/* Sports Ground Drawing */}
                  <ellipse cx="600" cy="380" rx="60" ry="40" fill="#9a3412" fillOpacity="0.05" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3" />

                  {/* Intersections & Hotspots */}
                  {mapHotspots.map((spot) => {
                    const isSelected = selectedLoc?.id === spot.id;
                    return (
                      <g key={spot.id} className="cursor-pointer" onClick={() => {
                        const target = locations.find((l) => l.id === spot.id);
                        if (target) setSelectedLoc(target);
                      }}>
                        <circle
                          cx={spot.cx}
                          cy={spot.cy}
                          r={spot.radius + 10}
                          className={`fill-transparent stroke-white/20 transition-all duration-300 ${isSelected ? "stroke-emerald-400 scale-110" : ""}`}
                          strokeWidth="1"
                        />
                        <circle
                          cx={spot.cx}
                          cy={spot.cy}
                          r={spot.radius}
                          className={`fill-navy-900 stroke-navy-800/80 transition-all duration-300 ${isSelected ? "scale-105" : "hover:scale-105"}`}
                          strokeWidth="2"
                        />
                        <circle
                          cx={spot.cx}
                          cy={spot.cy}
                          r={spot.radius - 8}
                          className={`bg-gradient-to-r ${spot.color} opacity-75 animate-pulse`}
                        />
                        <text
                          x={spot.cx}
                          y={spot.cy + spot.radius + 18}
                          textAnchor="middle"
                          fill="#90b4e8"
                          fontSize="9"
                          className="pointer-events-none select-none font-bold uppercase tracking-wider"
                        >
                          {spot.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Detail drawer / Panel */}
            <div className="lg:col-span-4 h-full">
              <AnimatePresence mode="wait">
                {selectedLoc ? (
                  <motion.div
                    key={selectedLoc.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.4 }}
                    className="glass rounded-2xl p-6 border border-emerald-500/30 shadow-xl flex flex-col h-full justify-between"
                  >
                    <div>
                      {/* Title header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-extrabold text-sm sm:text-base uppercase tracking-wider flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-emerald-450 shrink-0" />
                          {selectedLoc.name}
                        </h3>
                        <button
                          onClick={() => setSelectedLoc(null)}
                          className="p-1 rounded-lg glass-light text-navy-450 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Image preview */}
                      <div className="h-40 rounded-xl bg-gradient-to-br from-navy-800 to-navy-950 border border-navy-800/40 overflow-hidden relative mb-4 flex items-center justify-center">
                        <div className="absolute inset-0 bg-mesh opacity-55" />
                        <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase">
                          Active Hotspot
                        </div>
                        <div className="text-center p-4">
                          <MapPin className="w-8 h-8 text-emerald-400 mx-auto mb-1 animate-bounce" />
                          <div className="text-white font-bold text-xs">{selectedLoc.name} View</div>
                          <div className="text-[9px] text-navy-450 mt-0.5">Asset placeholders are ready for integration</div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-navy-300 text-xs sm:text-sm leading-relaxed mb-5">
                        {selectedLoc.description}
                      </p>

                      {/* Facilities checklist */}
                      <div className="space-y-2 mb-6">
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider">Infrastructure details</h4>
                        {[
                          "Full optical fiber high speed internet connectivity",
                          "24/7 surveillance cameras & monitoring wings",
                          "Full wheelchair integration and ramps",
                        ].map((hl) => (
                          <div key={hl} className="flex items-start gap-2 text-navy-350 text-[11px]">
                            <Check className="w-4 h-4 text-emerald-450 shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={selectedLoc.id === "hostel" ? "/hostel" : (selectedLoc.id === "library" ? "/library" : "/labs")}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs uppercase tracking-wider text-center hover:from-emerald-400 hover:to-emerald-500 transition-all duration-200"
                      >
                        Explore Sub-Section
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <div className="glass rounded-2xl p-8 border border-navy-700/30 text-center flex flex-col items-center justify-center h-[350px]">
                    <Info className="w-8 h-8 text-navy-500 mb-2" />
                    <h3 className="text-white font-bold text-sm mb-1.5">No Location Selected</h3>
                    <p className="text-navy-400 text-xs max-w-xs mx-auto leading-relaxed">
                      Explore the campus diagram on the left. Click any active radar hotspots to show details.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
