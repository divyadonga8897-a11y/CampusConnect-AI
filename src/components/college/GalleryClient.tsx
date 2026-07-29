"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { collegeService, type GalleryItem } from "@/services/collegeService";

const categories = [
  { value: "all", label: "All Media" },
  { value: "campus", label: "Campus Grounds" },
  { value: "labs", label: "Research Labs" },
  { value: "events", label: "Events & Festivals" },
  { value: "student_life", label: "Student Activities" },
  { value: "achievements", label: "Achievements" },
];

export default function GalleryClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const categoryQuery = activeCategory === "all" ? undefined : activeCategory;
    collegeService.getGallery(categoryQuery).then((res) => {
      setGallery(res.data);
    });
  }, [activeCategory]);

  const filteredGallery = gallery;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! === 0 ? filteredGallery.length - 1 : prev! - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! === filteredGallery.length - 1 ? 0 : prev! + 1));
  };

  const selectedItem = lightboxIndex !== null ? filteredGallery[lightboxIndex] : null;

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="Media Gallery"
            title="SSIET Visual"
            highlight="Showcase"
            description="Browse categorizable cinematic moments, project exhibits, campus spaces, and student celebrations at Sri Satya Institute."
            className="mb-10"
          />

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass rounded-2xl p-3 border border-navy-700/30 mb-8 flex flex-wrap items-center justify-center gap-2"
          >
            <div className="flex items-center gap-2 text-navy-400 text-xs px-3 font-semibold uppercase tracking-wider hidden sm:flex border-r border-navy-800 mr-2">
              <Filter className="w-3.5 h-3.5 text-emerald-450" />
              <span>Category</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => { setActiveCategory(cat.value); setLightboxIndex(null); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat.value
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                    : "text-navy-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Photo Masonry Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setLightboxIndex(index)}
                  className="glass rounded-2xl overflow-hidden border border-navy-700/30 h-64 relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-mesh opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent opacity-65 group-hover:opacity-85 transition-opacity z-10" />

                  {/* Top Badge */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded glass-light text-[9px] text-emerald-350 uppercase tracking-widest font-bold z-20">
                    {item.category}
                  </span>

                  {/* Hover icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <div className="w-10 h-10 rounded-full glass-emerald flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div className="absolute bottom-4 left-4 z-20">
                    <h4 className="text-white font-bold text-sm leading-snug">{item.title}</h4>
                    {item.description && (
                      <p className="text-navy-300 text-xs mt-1 line-clamp-1">{item.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Lightbox Overlay */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxIndex(null)}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 p-2.5 rounded-lg glass-light text-navy-300 hover:text-white transition-all z-[110]"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-4 p-3 rounded-xl glass-light text-white hover:bg-white/10 transition-all z-[110] hidden sm:block"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 p-3 rounded-xl glass-light text-white hover:bg-white/10 transition-all z-[110] hidden sm:block"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Lightbox Container */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass rounded-2xl max-w-3xl w-full border border-navy-700/35 overflow-hidden flex flex-col justify-between shadow-2xl relative"
              >
                {/* Image Area */}
                <div className="h-96 w-full bg-navy-950 flex items-center justify-center relative p-6">
                  <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none" />
                  {/* Decorative big Icon */}
                  <div className="text-center">
                    <ImageIcon className="w-20 h-20 text-navy-800 mx-auto mb-2" />
                    <h3 className="text-white/30 text-sm font-bold">{selectedItem.title} Visual</h3>
                    <p className="text-[10px] text-navy-500 mt-1">Asset placeholder is fully configurable in public folder</p>
                  </div>
                </div>

                {/* Info Bar */}
                <div className="p-6 bg-navy-950/90 border-t border-navy-800/40">
                  <span className="px-2 py-0.5 rounded glass-emerald text-[9px] text-emerald-350 uppercase tracking-widest font-bold mb-2 inline-block">
                    {selectedItem.category}
                  </span>
                  <h3 className="text-white font-bold text-base sm:text-lg mb-1">{selectedItem.title}</h3>
                  {selectedItem.description && (
                    <p className="text-navy-300 text-xs sm:text-sm leading-relaxed">{selectedItem.description}</p>
                  )}

                  {/* Mobile nav buttons */}
                  <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-navy-850 sm:hidden">
                    <button onClick={handlePrev} className="px-4 py-2 rounded-lg glass-light text-white text-xs font-semibold">
                      Prev
                    </button>
                    <span className="text-navy-450 text-xs font-medium">
                      {lightboxIndex! + 1} of {filteredGallery.length}
                    </span>
                    <button onClick={handleNext} className="px-4 py-2 rounded-lg glass-light text-white text-xs font-semibold">
                      Next
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
