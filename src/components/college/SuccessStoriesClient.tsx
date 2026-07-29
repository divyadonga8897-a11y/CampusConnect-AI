"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, User, Building, Landmark, Award } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { careerService, type SuccessStory } from "@/services/careerService";

export default function SuccessStoriesClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    careerService.getStudentStories()
      .then((res) => {
        setStories(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading success stories:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="Inspiring Journeys"
            title="Student Success"
            highlight="Stories"
            description="Read inspiring career path stories from engineering students who successfully converted academic training into placements at multinational firms."
            className="mb-14"
          />

          {loading ? (
            <div className="grid md:grid-cols-2 gap-8 animate-pulse">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="glass h-64 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {stories.map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="glass rounded-3xl p-6 sm:p-8 border border-navy-700/30 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/20"
                >
                  <div className="absolute top-6 right-6 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors pointer-events-none">
                    <Quote className="w-16 h-16 transform rotate-180" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-navy-900 border border-navy-800 flex items-center justify-center text-emerald-450">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-white font-extrabold text-base sm:text-lg">{story.student_name}</h3>
                        <div className="text-[10px] text-navy-450 uppercase font-bold tracking-wider">
                          Batch of {story.graduation_year} | {story.department_id.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <p className="text-navy-300 text-xs sm:text-sm leading-relaxed italic relative z-10 pl-4 border-l-2 border-emerald-500/30">
                      "{story.story}"
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-navy-800/40 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-navy-400">
                      <Building className="w-4 h-4 text-emerald-450" />
                      <span>Company: <strong className="text-white">{story.current_company}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-navy-400">
                      <Award className="w-4 h-4 text-gold-450" />
                      <span>Role: <strong className="text-white">{story.current_role}</strong></span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
