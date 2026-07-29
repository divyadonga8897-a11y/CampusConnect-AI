"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Monitor, Brain, BookOpen, Home, Dumbbell, UtensilsCrossed } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { FACILITIES } from "@/constants/collegeData";

const iconMap: Record<string, React.ElementType> = {
  Monitor, Brain, BookOpen, Home, Dumbbell, UtensilsCrossed,
};

export default function CampusPreview() {
  return (
    <section className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionTitle
          badge="Campus Life"
          title="World-Class"
          highlight="Campus Facilities"
          description="Experience a vibrant campus designed to inspire learning, creativity, and holistic development."
          className="mb-16"
        />

        {/* Facilities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACILITIES.map((facility, i) => {
            const Icon = iconMap[facility.icon] ?? Monitor;
            // Get the image path or fallback to central library
            const imgPath = facility.image || "/images/library.png";

            return (
              <motion.div
                key={facility.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-3xl overflow-hidden border border-white/5 card-hover group flex flex-col justify-between h-[360px]"
              >
                {/* Image Section */}
                <div className="h-52 w-full relative overflow-hidden bg-navy-950">
                  {/* Actual generated image */}
                  <Image
                    src={imgPath}
                    alt={facility.name}
                    fill
                    sizes="(max-w-7xl) 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  {/* Card overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-950/20 to-black/10" />
                  
                  {/* Floating Icon Pill */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl glass-light border border-white/10 shadow-lg">
                    <Icon className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-white">
                      {facility.name}
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-5 flex-1 flex flex-col justify-center bg-navy-900/60 backdrop-blur-sm border-t border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-bold text-sm sm:text-base group-hover:text-blue-300 transition-colors">
                      {facility.name}
                    </h3>
                  </div>
                  <p className="text-navy-300 text-xs sm:text-sm leading-relaxed">
                    {facility.description}
                  </p>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
