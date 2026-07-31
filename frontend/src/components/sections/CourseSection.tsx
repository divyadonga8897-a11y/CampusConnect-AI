"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function CourseSection() {
  const router = useRouter();

  return (
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight uppercase">
              ACADEMICS
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-1">
              Explore our innovative programs, laboratories, and curriculum hierarchy.
            </p>
          </div>
          {/* Carousel Controls */}
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer border border-slate-200/30">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer border border-slate-200/30">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Academics Grid */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Card 1: Innovative Programs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-[#F8FAFC] border border-slate-200/50 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
          >
            <div>
              {/* Card Image */}
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-slate-100 shadow-sm mb-6 bg-slate-200">
                <Image
                  src="/images/campus/academic-block.webp"
                  alt="Modern academic building"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>

              {/* Text Info */}
              <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                Innovative Programs
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                Explore our modern, AI-integrated engineering programs designed to meet current industrial requirements and future technology streams.
              </p>
            </div>

            <button
              onClick={() => router.push("/courses")}
              className="text-xs sm:text-sm font-extrabold text-blue-600 flex items-center gap-1.5 hover:underline tracking-wider uppercase group cursor-pointer"
            >
              Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Card 2: World-Class Labs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="bg-[#F8FAFC] border border-slate-200/50 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
          >
            <div>
              {/* Card Image */}
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-slate-100 shadow-sm mb-6 bg-slate-200">
                <Image
                  src="/images/campus/computer-lab.png"
                  alt="Students working in computer lab"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>

              {/* Text Info */}
              <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                World-Class Labs
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                Students working in modern campus computer laboratories equipped with high-end workstations and advanced computing tools.
              </p>
            </div>

            <button
              onClick={() => router.push("/labs")}
              className="text-xs sm:text-sm font-extrabold text-blue-600 flex items-center gap-1.5 hover:underline tracking-wider uppercase group cursor-pointer"
            >
              Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Card 3: Research Focus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[#F8FAFC] border border-slate-200/50 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
          >
            <div>
              {/* Card Image */}
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-slate-100 shadow-sm mb-6 bg-slate-200">
                <Image
                  src="/images/campus/library-interior.png"
                  alt="APJ Abdul Kalam Central Library"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>

              {/* Text Info */}
              <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                Scholarly Research
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                Our central library houses massive text references, digital databases, and index journals to support student patent research.
              </p>
            </div>

            <button
              onClick={() => router.push("/research")}
              className="text-xs sm:text-sm font-extrabold text-blue-600 flex items-center gap-1.5 hover:underline tracking-wider uppercase group cursor-pointer"
            >
              Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
