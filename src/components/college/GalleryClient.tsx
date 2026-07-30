"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { collegeService, type GalleryItem } from "@/services/collegeService";

const categories = [
  { value: "all",          label: "All" },
  { value: "campus",       label: "Campus" },
  { value: "labs",         label: "Labs" },
  { value: "events",       label: "Events" },
  { value: "student_life", label: "Student Life" },
  { value: "achievements", label: "Achievements" },
];

export default function GalleryClient() {
  const [aiOpen, setAiOpen]               = useState(false);
  const [gallery, setGallery]             = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const cat = activeCategory === "all" ? undefined : activeCategory;
    collegeService.getGallery(cat).then((res) => setGallery(res.data));
  }, [activeCategory]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((p) => (p! === 0 ? gallery.length - 1 : p! - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((p) => (p! === gallery.length - 1 ? 0 : p! + 1));
  };

  const selected = lightboxIndex !== null ? gallery[lightboxIndex] : null;

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Gallery"
          title="SSIET Visual"
          highlight="Showcase"
          description="Campus moments, lab facilities, events, and student life — all in one gallery."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
        />

        <div className="container py-12">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => { setActiveCategory(cat.value); setLightboxIndex(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                  activeCategory === cat.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {gallery.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer group bg-slate-200"
                  onClick={() => setLightboxIndex(idx)}
                >
                  <Image
                    src={item.image_url}
                    alt={item.title || "Gallery"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                  {/* Overlay text */}
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-semibold">{item.title}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {gallery.length === 0 && (
            <div className="card p-12 text-center">
              <Images className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No images in this category.</p>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              onClick={handlePrev}
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              onClick={handleNext}
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div
              className="relative max-w-4xl max-h-[80vh] w-full h-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selected.image_url}
                alt={selected.title ?? "Gallery"}
                fill
                className="object-contain"
              />
            </div>

            {selected.title && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm">
                {selected.title}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
