"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Mic, Filter, BookOpen, ChevronDown, Compass } from "lucide-react";
import Image from "next/image";

interface HeroSectionProps {
  onAIClick: () => void;
}

const HERO_SLIDES = [
  {
    src: "/images/campus/ssiet-campus-hero.png",
    alt: "SSIET Campus Main Entrance",
    title: "SSIET Campus Entrance",
    description: "Welcome to our state-of-the-art campus, designed for learning and excellence."
  },
  {
    src: "/images/campus/academic-block.webp",
    alt: "SSIET Academic Block",
    title: "Modern Academic Blocks",
    description: "Spacious lecture halls equipped with advanced interactive learning technologies."
  },
  {
    src: "/images/campus/computer-lab.png",
    alt: "SSIET Advanced Computer Labs",
    title: "High-Tech Computation Labs",
    description: "Advanced computing facilities with high-end workstations and modern tools."
  },
  {
    src: "/images/campus/sports-ground.png",
    alt: "SSIET Sports Complex",
    title: "Vast Athletic Complexes",
    description: "Indoor sports auditoriums, athletic running tracks, and standard football grounds."
  },
  {
    src: "/images/campus/library-interior.png",
    alt: "SSIET Central Library",
    title: "Dr. APJ Abdul Kalam Digital Library",
    description: "Thousands of national journals, computational catalogs, and quiet study wings."
  }
];

const DEPT_CHIPS = [
  { id: "cse", label: "CSE" },
  { id: "aids", label: "AI & DS" },
  { id: "ece", label: "ECE" },
  { id: "mech", label: "Mechanical" },
  { id: "civil", label: "Civil" }
];

export default function HeroSection({ onAIClick }: HeroSectionProps) {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = `/courses?search=${encodeURIComponent(searchVal.trim())}`;
    if (selectedDept !== "all") {
      url += `&dept=${encodeURIComponent(selectedDept)}`;
    }
    router.push(url);
  };

  const handleChipClick = (deptId: string) => {
    router.push(`/courses?dept=${deptId}`);
  };

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div className="relative w-full overflow-visible pb-10 bg-slate-50 select-none">

      {/* ── Immersive Full-Width Image Banner (Large Height) ── */}
      <div className="relative w-full h-[75vh] min-h-[800px] max-h-[900px] overflow-hidden bg-slate-950">

        {/* Slideshow background */}
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={HERO_SLIDES[activeSlide].src}
              alt={HERO_SLIDES[activeSlide].alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-90 transition-all duration-700"
            />
          </motion.div>
        </AnimatePresence>

        {/* Sophisticated dark gradient mask for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/20 z-10 pointer-events-none" />

        {/* ── Text Content Overlay (Lower-Left Positioned) ── */}
        <div className="absolute inset-x-0 bottom-16 sm:bottom-20 md:bottom-24 z-10 pointer-events-none">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 text-left">

            {/* Small eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                SSIET ADMISSIONS 2026-27 OPEN
              </span>
            </motion.div>

            {/* Large title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] font-black !text-white leading-[1.1] mt-3.5 max-w-4xl tracking-tight uppercase"
              style={{ color: "white" }}
            >
              Sri Satya Institute of <br className="hidden sm:inline" />
              Engineering and Technology
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-200 text-xs sm:text-sm md:text-base max-w-2xl mt-3.5 font-medium leading-relaxed"
            >
              Nurturing innovation, academic excellence, and ethical leadership in engineering. Explore accredited B.Tech and postgraduate courses backed by premier placement records.
            </motion.p>

            {/* Side-by-side action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3 mt-6 sm:mt-7 pointer-events-auto"
            >
              <button
                onClick={() => router.push("/admissions")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 transition-all cursor-pointer uppercase tracking-wider hover:scale-105 active:scale-95"
              >
                Apply Online
              </button>
              <button
                onClick={() => router.push("/campus")}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 backdrop-blur-sm font-bold text-xs px-5 py-2.5 rounded-full transition-all cursor-pointer uppercase tracking-wider hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-blue-300" />
                Virtual Tour
              </button>
            </motion.div>

          </div>
        </div>

        {/* Carousel controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm cursor-pointer z-20 hover:scale-105 active:scale-95 border border-white/5"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm cursor-pointer z-20 hover:scale-105 active:scale-95 border border-white/5"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" />
        </button>

        {/* Dot indicators in bottom right of full banner */}
        <div className="absolute bottom-6 right-6 md:right-8 flex gap-1.5 z-20">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === activeSlide ? "bg-white w-5" : "bg-white/40 hover:bg-white/60"
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>

      {/* ── Search Panel (Positioned Down/Below the campus images, in flow) ── */}
      <div className="max-w-4xl mx-auto w-full px-6 mt-8 sm:mt-10 mb-2 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-3xl p-4 sm:p-5 focus-within:shadow-[0_22px_60px_rgba(37,99,235,0.08)] focus-within:bg-white/30 transition-all duration-300"
        >
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4">

            {/* Search Pill Row */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 bg-white/45 border border-white/30 shadow-sm focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 focus-within:bg-white/75 transition-all rounded-full px-5 py-2 sm:py-2.5 flex items-center gap-2.5 backdrop-blur-md">
                <Search className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="What program or course are you looking for?"
                  className="w-full text-slate-800 text-xs sm:text-sm focus:outline-none bg-transparent placeholder-slate-400 font-semibold"
                />

                {/* Voice simulation mic */}
                <button
                  type="button"
                  onClick={onAIClick}
                  title="Ask Campus AI"
                  className="p-1 rounded-full hover:bg-white/30 text-slate-400 hover:text-blue-600 transition-colors shrink-0 cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>

                {/* Keyboard pill */}
                <span className="hidden sm:inline-flex items-center text-[9px] font-bold text-slate-400 bg-white/50 border border-white/20 px-1.5 py-0.5 rounded shrink-0 mr-1 select-none">
                  Ctrl+K
                </span>
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black text-xs sm:text-sm px-6 py-2.5 sm:py-3 rounded-full transition-all duration-300 shadow-md shadow-blue-900/10 cursor-pointer uppercase tracking-wider active:scale-95 shrink-0"
              >
                Search
              </button>
            </div>

            {/* Filter Dropdowns and chips row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/20">

              {/* Select filters */}
              <div className="flex flex-wrap items-center gap-2">

                {/* Department select filter */}
                <div className="relative shrink-0">
                  <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="appearance-none bg-white/40 hover:bg-white/60 border border-white/30 text-slate-700 text-[10px] sm:text-xs font-bold pl-9 pr-8 py-1.5 sm:py-2 rounded-full outline-none transition-all cursor-pointer backdrop-blur-sm"
                  >
                    <option value="all">All Departments</option>
                    <option value="cse">Computer Science (CSE)</option>
                    <option value="aids">AI & Data Science (AIDS)</option>
                    <option value="ece">Electronics (ECE)</option>
                    <option value="mech">Mechanical Engineering</option>
                    <option value="civil">Civil Engineering</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                </div>

                {/* Level select filter */}
                <div className="relative shrink-0">
                  <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="appearance-none bg-white/40 hover:bg-white/60 border border-white/30 text-slate-700 text-[10px] sm:text-xs font-bold pl-9 pr-8 py-1.5 sm:py-2 rounded-full outline-none transition-all cursor-pointer backdrop-blur-sm"
                  >
                    <option value="all">All Levels</option>
                    <option value="undergraduate">B.Tech (Undergrad)</option>
                    <option value="postgraduate">M.Tech (Postgrad)</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                </div>

              </div>

              {/* Department chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-bold hidden md:inline">Quick Links:</span>
                {DEPT_CHIPS.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleChipClick(chip.id)}
                    className="bg-white/40 hover:bg-blue-50/70 border border-white/20 hover:border-blue-300 text-slate-600 hover:text-blue-700 text-[9px] sm:text-[10px] font-black tracking-wide px-2.5 py-1 rounded-full cursor-pointer transition-all select-none hover:scale-105 backdrop-blur-sm"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

            </div>

          </form>
        </motion.div>
      </div>

    </div>
  );
}
