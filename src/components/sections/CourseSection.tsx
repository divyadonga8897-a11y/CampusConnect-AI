"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code2, Brain, Cpu, Settings, Building } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { DEPARTMENTS } from "@/constants/collegeData";

const iconMap: Record<string, React.ElementType> = { Code2, Brain, Cpu, Settings, Building };
const colorMap: Record<string, { badge: string; dot: string }> = {
  emerald: { badge: "badge-green",  dot: "bg-emerald-500" },
  gold:    { badge: "badge-amber",  dot: "bg-amber-500"   },
  navy:    { badge: "badge-blue",   dot: "bg-blue-500"    },
  orange:  { badge: "badge-amber",  dot: "bg-orange-500"  },
  amber:   { badge: "badge-amber",  dot: "bg-amber-600"   },
};

const deptImages: Record<string, string> = {
  cse:  "/images/campus/ai-lab.webp",
  aids: "/images/campus/ai-lab.webp",
  ece:  "/images/campus/ai-lab.webp",
  mech: "/images/campus/academic-block.webp",
  civil:"/images/campus/academic-block.webp",
};

export default function CourseSection() {
  return (
    <section className="section bg-slate-50">
      <div className="container">
        <SectionHeader
          eyebrow="Academic Programs"
          title="Engineering Departments &"
          highlight="B.Tech Programs"
          description="Five specialized engineering departments with modern labs, expert faculty, and strong industry connections."
          className="mb-12"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEPARTMENTS.map((dept, i) => {
            const Icon = iconMap[dept.icon] ?? Code2;
            const colors = colorMap[dept.color] ?? colorMap.navy;
            const img = deptImages[dept.id] ?? "/images/campus/ai-lab.webp";

            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="card overflow-hidden group flex flex-col"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <Image
                    src={img}
                    alt={dept.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-black text-slate-700">
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                      {dept.shortName}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                      {dept.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1 line-clamp-3">
                    {dept.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-3 border-t border-slate-100 mb-4">
                    <span>{dept.intake} seats</span>
                    <span>{dept.facultyCount} faculty</span>
                    <span>Est. {dept.established}</span>
                  </div>

                  <Link
                    href={`/departments/${dept.id}`}
                    className="btn btn-secondary btn-sm w-full justify-center"
                  >
                    Explore Program <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/courses" className="btn btn-outline">
            View All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
