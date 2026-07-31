"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function CampusPreview() {
  const router = useRouter();

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-100">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight uppercase">
              CAMPUS LIFE
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-1">
              Explore student experiences, events, and cultural festivals.
            </p>
          </div>
          {/* Carousel Controls */}
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer border border-slate-200/50 shadow-sm">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer border border-slate-200/50 shadow-sm">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Campus Life Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Card 1: Vibrant Campus Life */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-slate-200/50 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
          >
            <div>
              {/* Card Image */}
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-slate-100 shadow-sm mb-6 bg-slate-100">
                <Image
                  src="/images/campus/vibrant-campus-life.png"
                  alt="Students performing on stage"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>

              {/* Text Info */}
              <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                Vibrant Campus Life
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                Explore our annual fests, technical symposia, dramatic arts acts, and collaborative club activities defining SSIET student experiences.
              </p>
            </div>

            <button
              onClick={() => router.push("/student-life")}
              className="text-xs sm:text-sm font-extrabold text-[#2E3192] flex items-center gap-1.5 hover:underline tracking-wider uppercase group cursor-pointer"
            >
              Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Card 2: Sports & Recreation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="bg-white border border-slate-200/50 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
          >
            <div>
              {/* Card Image */}
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-slate-100 shadow-sm mb-6 bg-slate-100">
                <Image
                  src="/images/campus/sports-ground.png"
                  alt="Sports Ground Complex"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>

              {/* Text Info */}
              <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                Athletics & Sports
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                Sprawling athletic complex supporting cricket, football, running tracks, and indoor basketball arenas to promote physical well-being.
              </p>
            </div>

            <button
              onClick={() => router.push("/student-life")}
              className="text-xs sm:text-sm font-extrabold text-[#2E3192] flex items-center gap-1.5 hover:underline tracking-wider uppercase group cursor-pointer"
            >
              Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Card 3: Hostel Residency */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-slate-200/50 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
          >
            <div>
              {/* Card Image */}
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-slate-100 shadow-sm mb-6 bg-slate-100">
                <Image
                  src="/images/hostel/hostel-room.png"
                  alt="Student hostel room layout"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>

              {/* Text Info */}
              <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                Student Residences
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                Clean, safe, and secure residential hostel facilities with Wi-Fi connectivity, recreation cells, and multi-cuisine dining options.
              </p>
            </div>

            <button
              onClick={() => router.push("/hostel")}
              className="text-xs sm:text-sm font-extrabold text-[#2E3192] flex items-center gap-1.5 hover:underline tracking-wider uppercase group cursor-pointer"
            >
              Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
