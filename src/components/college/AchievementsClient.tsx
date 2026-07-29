"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Microscope, Building2, Award, Calendar, Filter, Sparkles } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { collegeService, type CollegeAchievement } from "@/services/collegeService";

const categories = [
  { value: "all", label: "All Milestones" },
  { value: "Academic", label: "Academic" },
  { value: "Research", label: "Research" },
  { value: "Awards", label: "Awards & Honors" },
  { value: "Recognition", label: "Recognitions" }
];

const iconMap: Record<string, React.ElementType> = {
  "Trophy": Trophy,
  "Medal": Medal,
  "Microscope": Microscope,
  "Building2": Building2,
  "Award": Award
};

export default function AchievementsClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<CollegeAchievement[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    setLoading(true);
    const categoryQuery = activeCategory === "all" ? undefined : activeCategory;
    
    collegeService.getAchievements(categoryQuery)
      .then((res) => {
        setAchievements(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading achievements:", err);
        setLoading(false);
      });
  }, [activeCategory]);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Header */}
          <SectionTitle
            badge="Institute Achievements"
            title="Recognitions &"
            highlight="Academic Milestones"
            description="Explore our historical awards, state board toppers, research publications, and corporate accolades representing engineering excellence."
            className="mb-10"
          />

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass rounded-2xl p-3 border border-navy-700/30 mb-10 flex flex-wrap items-center justify-center gap-2"
          >
            <div className="flex items-center gap-2 text-navy-400 text-xs px-3 font-semibold uppercase tracking-wider hidden sm:flex border-r border-navy-800 mr-2">
              <Filter className="w-3.5 h-3.5 text-emerald-450" />
              <span>Filter By</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => { setActiveCategory(cat.value); }}
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

          {loading ? (
            /* Skeletons */
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="glass rounded-2xl p-6 border border-navy-700/30 animate-pulse h-56 space-y-4">
                  <div className="w-12 h-12 bg-navy-800 rounded-xl mx-auto" />
                  <div className="h-4 bg-navy-800 w-3/4 mx-auto rounded" />
                  <div className="h-3 bg-navy-900 w-1/2 mx-auto rounded" />
                  <div className="h-3 bg-navy-900 w-5/6 mx-auto rounded" />
                </div>
              ))}
            </div>
          ) : (
            /* Achievements Grid */
            <motion.div 
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {achievements.map((ach, idx) => {
                  const Icon = iconMap[ach.title.includes("NAAC") ? "Award" : (idx % 2 === 0 ? "Trophy" : "Medal")] ?? Trophy;
                  return (
                    <motion.div
                      key={ach.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="glass rounded-2xl p-6 border border-navy-700/30 card-hover flex flex-col justify-between group"
                    >
                      <div>
                        {/* Icon Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/25 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Icon className="w-6 h-6 text-gold-400" />
                          </div>
                          <span className="flex items-center gap-1 text-[10px] text-navy-450 font-bold bg-navy-950 px-2.5 py-1 rounded-lg">
                            <Calendar className="w-3 h-3 text-emerald-450 shrink-0" />
                            {ach.year}
                          </span>
                        </div>

                        {/* Title and category */}
                        <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mb-3">
                          {ach.category}
                        </span>
                        <h3 className="text-white font-extrabold text-sm sm:text-base leading-snug mb-2 group-hover:text-emerald-400 transition-colors">
                          {ach.title}
                        </h3>
                        <p className="text-navy-300 text-xs leading-relaxed">
                          {ach.description}
                        </p>
                      </div>

                      {/* Sparkles bottom note */}
                      <div className="mt-6 pt-3 border-t border-navy-800/20 flex items-center gap-1.5 text-[10px] text-navy-450 font-semibold uppercase">
                        <Sparkles className="w-3 h-3 text-gold-400 animate-pulse" />
                        Verified Milestone
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && achievements.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 glass rounded-3xl border border-navy-700/30 max-w-xl mx-auto"
            >
              <Trophy className="w-12 h-12 text-navy-600 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-1">No Milestones Found</h3>
              <p className="text-navy-350 text-sm max-w-sm mx-auto">There are no records currently available for the selected category. Check back later as our administrative board posts updates.</p>
            </motion.div>
          )}
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
