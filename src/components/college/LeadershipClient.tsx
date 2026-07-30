"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { collegeService, type LeadershipMember } from "@/services/collegeService";

export default function LeadershipClient() {
  const [aiOpen, setAiOpen]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [leaders, setLeaders] = useState<LeadershipMember[]>([]);

  useEffect(() => {
    collegeService.getLeadership()
      .then((res) => { setLeaders(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="College Administration"
          title="Visionary"
          highlight="Leadership Board"
          description="Meet the academic board, administrators, and advisors guiding excellence at Sri Satya Institute."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Leadership" }]}
        />

        <div className="container py-12">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-56 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {leaders.map((leader, i) => (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="card p-6 group text-center"
                >
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 text-blue-700 font-black text-xl group-hover:bg-blue-200 transition-colors">
                    {leader.name.charAt(0)}
                  </div>

                  <span className="badge badge-blue text-[10px] mb-2">{leader.designation}</span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                    {leader.name}
                  </h3>
                  {leader.qualification && (
                    <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-2">
                      <GraduationCap className="w-3 h-3" /> {leader.qualification}
                    </div>
                  )}

                  {leader.description && (
                    <blockquote className="text-xs text-slate-500 italic leading-relaxed border-t border-slate-100 pt-3 mt-3 line-clamp-3">
                      "{leader.description}"
                    </blockquote>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
