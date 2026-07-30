"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Microscope, Building2, Award, Calendar } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { collegeService, type CollegeAchievement } from "@/services/collegeService";

const categories = [
  { value: "all",         label: "All" },
  { value: "Academic",   label: "Academic" },
  { value: "Research",   label: "Research" },
  { value: "Awards",     label: "Awards" },
  { value: "Recognition",label: "Recognition" },
];

const categoryIconMap: Record<string, React.ElementType> = {
  Academic:    Trophy,
  Research:    Microscope,
  Awards:      Award,
  Recognition: Medal,
};

const catColors: Record<string, string> = {
  Academic:    "badge-blue",
  Research:    "badge-green",
  Awards:      "badge-amber",
  Recognition: "badge-slate",
};

export default function AchievementsClient() {
  const [aiOpen, setAiOpen]               = useState(false);
  const [loading, setLoading]             = useState(true);
  const [achievements, setAchievements]   = useState<CollegeAchievement[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    setLoading(true);
    const cat = activeCategory === "all" ? undefined : activeCategory;
    collegeService.getAchievements(cat)
      .then((res) => { setAchievements(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeCategory]);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Achievements"
          title="Milestones of"
          highlight="Excellence"
          description="SSIET's record of awards, academic recognitions, research breakthroughs, and institutional achievements."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Achievements" }]}
        />

        <div className="container py-12">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
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
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-44 rounded-xl" />)}
            </div>
          ) : (
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {achievements.map((ach, i) => {
                  const Icon  = categoryIconMap[ach.category] ?? Trophy;
                  const badge = catColors[ach.category] ?? "badge-slate";
                  return (
                    <motion.div
                      key={ach.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="card p-5 group"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                          <Icon className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`badge ${badge} text-[10px] mb-1`}>{ach.category}</span>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                            {ach.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-3">{ach.description}</p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-3 border-t border-slate-100">
                        <Calendar className="w-3 h-3" />
                        {ach.year}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && achievements.length === 0 && (
            <div className="card p-12 text-center">
              <Trophy className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No achievements in this category.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
