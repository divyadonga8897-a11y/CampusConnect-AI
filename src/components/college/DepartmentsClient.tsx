"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Code2, Brain, Cpu, Settings, Building, ArrowRight, Users, GraduationCap, FlaskConical } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { academicService, type DepartmentSummary } from "@/services/academicService";

const iconMap: Record<string, React.ElementType> = {
  cse: Code2, aids: Brain, ece: Cpu, mech: Settings, civil: Building,
};

const colorMap: Record<string, { badge: string; icon: string; iconBg: string }> = {
  cse:  { badge: "badge-green",  icon: "text-emerald-600", iconBg: "bg-emerald-50" },
  aids: { badge: "badge-amber",  icon: "text-amber-600",   iconBg: "bg-amber-50"   },
  ece:  { badge: "badge-blue",   icon: "text-blue-600",    iconBg: "bg-blue-50"    },
  mech: { badge: "badge-slate",  icon: "text-orange-600",  iconBg: "bg-orange-50"  },
  civil:{ badge: "badge-slate",  icon: "text-amber-700",   iconBg: "bg-amber-50"   },
};

const deptImages: Record<string, string> = {
  cse:  "/images/campus/ai-lab.webp",
  aids: "/images/campus/ai-lab.webp",
  ece:  "/images/campus/ai-lab.webp",
  mech: "/images/campus/academic-block.webp",
  civil:"/images/campus/academic-block.webp",
};

export default function DepartmentsClient() {
  const [aiOpen, setAiOpen]         = useState(false);
  const [loading, setLoading]       = useState(true);
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);

  useEffect(() => {
    academicService.getDepartments()
      .then((res) => { setDepartments(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Engineering Departments"
          title="Our Academic"
          highlight="Departments"
          description="Five specialized engineering departments with expert faculty, cutting-edge labs, and strong industry connections."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Departments" }]}
        />

        <div className="container py-12">
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-72 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {departments.map((dept, i) => {
                const Icon   = iconMap[dept.id] ?? Code2;
                const colors = colorMap[dept.id] ?? colorMap.cse;
                const img    = deptImages[dept.id] ?? "/images/campus/ai-lab.webp";

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
                        sizes="33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-black text-slate-700">
                          {dept.short_name}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-9 h-9 rounded-lg ${colors.iconBg} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4 h-4 ${colors.icon}`} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                          {dept.name}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1 line-clamp-3">
                        {dept.description}
                      </p>

                      {/* Meta */}
                      <div className="grid grid-cols-3 gap-2 text-center mb-4 py-3 border-y border-slate-100">
                        <div>
                          <div className="text-sm font-black text-slate-900">{dept.faculty_count}+</div>
                          <div className="text-[10px] text-slate-400 font-medium">Faculty</div>
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900">{dept.student_count}+</div>
                          <div className="text-[10px] text-slate-400 font-medium">Students</div>
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900">{dept.established_year}</div>
                          <div className="text-[10px] text-slate-400 font-medium">Since</div>
                        </div>
                      </div>

                      <Link
                        href={`/departments/${dept.id}`}
                        className="btn btn-secondary btn-sm w-full justify-center"
                      >
                        Explore Department <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
