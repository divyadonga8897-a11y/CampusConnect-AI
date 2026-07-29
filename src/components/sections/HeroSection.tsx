"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, Star, GraduationCap, TrendingUp, Award, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  onAIClick: () => void;
}

export default function HeroSection({ onAIClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero bg-grid pt-28 lg:pt-20">
      {/* Glow shapes */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-3xl animate-float pointer-events-none" style={{ animationDelay: "3s" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-6 text-left space-y-6">
            
            {/* Small pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-emerald text-emerald-300 text-xs font-bold border border-emerald-500/20 shadow-lg shadow-emerald-950/20"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI Powered College Discovery Platform
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight"
            >
              Discover Your{" "}
              <span className="gradient-text-blue block sm:inline">Future</span>
              <br />
              at Sri Satya{" "}
              <span className="gradient-text-emerald">Engineering</span>
              <br />
              and{" "}
              <span className="gradient-text-gold">Success</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-navy-200 text-base sm:text-lg leading-relaxed max-w-lg"
            >
              Explore courses, campus life, fees, admissions, placements and opportunities with AI-powered guidance.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/courses"
                id="explore-programs-btn"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-650 to-blue-800 text-white font-bold text-sm shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 border border-blue-500/20"
              >
                Explore College
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <button
                id="hero-ai-btn"
                onClick={onAIClick}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl glass border border-white/10 text-white font-bold text-sm hover:border-emerald-550/30 hover:bg-white/5 transition-all duration-300 hover:scale-105"
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                Ask Campus AI
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="pt-6 border-t border-white/5 grid grid-cols-3 gap-4"
            >
              <div>
                <div className="text-white font-black text-lg">NAAC A</div>
                <div className="text-navy-300 text-2xs uppercase tracking-wider font-bold">Accredited</div>
              </div>
              <div>
                <div className="text-white font-black text-lg">25+ Yrs</div>
                <div className="text-navy-300 text-2xs uppercase tracking-wider font-bold">Excellence</div>
              </div>
              <div>
                <div className="text-white font-black text-lg">92%</div>
                <div className="text-navy-300 text-2xs uppercase tracking-wider font-bold">Placement Success</div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Premium Visual & Floating Cards */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] lg:min-h-[500px]">
            
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-emerald-500/5 rounded-3xl blur-2xl pointer-events-none" />

            {/* Large Campus Image Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="relative w-full max-w-[460px] h-[340px] sm:h-[400px] rounded-3xl overflow-hidden glass border border-white/10 shadow-2xl glow-accent"
            >
              <Image
                src="/images/campus/main-building.webp"
                alt="SSIET campus"
                fill
                priority
                className="object-cover object-center transform hover:scale-105 transition-transform duration-700 opacity-80"
              />
              {/* Overlay gradient mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-black/20" />
            </motion.div>

            {/* Card 1: NAAC A Grade (Top Left) */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute top-2 left-2 sm:-left-4 glass rounded-2xl p-3 border border-white/10 shadow-lg min-w-[130px] animate-float-slow"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>
                <div>
                  <div className="text-white font-black text-xs leading-none">A Grade</div>
                  <div className="text-[9px] text-navy-300 font-bold uppercase tracking-wider mt-0.5">NAAC Rating</div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: 5000+ Students (Bottom Left) */}
            <motion.div
              initial={{ opacity: 0, x: -35, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -bottom-4 left-6 sm:-left-6 glass rounded-2xl p-3 border border-white/10 shadow-lg min-w-[130px] animate-float-fast"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-white font-black text-xs leading-none">5000+</div>
                  <div className="text-[9px] text-navy-300 font-bold uppercase tracking-wider mt-0.5">Students</div>
                </div>
              </div>
            </motion.div>

            {/* Card 3: 92% Placement (Top Right) */}
            <motion.div
              initial={{ opacity: 0, x: 35, y: -30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="absolute -top-4 right-6 sm:-right-4 glass rounded-2xl p-3 border border-white/10 shadow-lg min-w-[130px] animate-float"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-white font-black text-xs leading-none">92%</div>
                  <div className="text-[9px] text-navy-300 font-bold uppercase tracking-wider mt-0.5">Placement</div>
                </div>
              </div>
            </motion.div>

            {/* Card 4: 25+ Years Excellence (Bottom Right) */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute bottom-2 right-2 sm:-right-6 glass rounded-2xl p-3 border border-white/10 shadow-lg min-w-[130px] animate-float-slow"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Award className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-white font-black text-xs leading-none">25+ Yrs</div>
                  <div className="text-[9px] text-navy-300 font-bold uppercase tracking-wider mt-0.5">Excellence</div>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-navy-950 to-transparent pointer-events-none" />
    </section>
  );
}
