"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Eye, 
  Target, 
  CheckCircle2, 
  Trophy, 
  Medal, 
  Microscope, 
  Building2, 
  MapPin, 
  Calendar,
  Award,
  Globe,
  Mail,
  Phone,
  BookmarkCheck
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { 
  collegeService, 
  type CollegeProfile, 
  type VisionMission, 
  type CollegeAchievement, 
  type CollegeAccreditation 
} from "@/services/collegeService";

const achievementIconMap: Record<string, React.ElementType> = {
  Trophy, 
  Medal, 
  Microscope, 
  Building2,
  Award
};

export default function AboutPageClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [profile, setProfile] = useState<CollegeProfile | null>(null);
  const [vision, setVision] = useState<VisionMission | null>(null);
  const [achievements, setAchievements] = useState<CollegeAchievement[]>([]);
  const [accreditations, setAccreditations] = useState<CollegeAccreditation[]>([]);
  const [collegeInfo, setCollegeInfo] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      collegeService.getProfile(),
      collegeService.getVision(),
      collegeService.getAchievements(),
      collegeService.getAccreditation(),
      collegeService.getCollege()
    ])
      .then(([profRes, visRes, achRes, accRes, colRes]) => {
        setProfile(profRes.data);
        setVision(visRes.data);
        setAchievements(achRes.data);
        setAccreditations(accRes.data);
        setCollegeInfo(colRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load about page data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        {/* Hero Banner */}
        <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-emerald text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              About Sri Satya Institute
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              A Legacy of{" "}
              <span className="gradient-text-gold">Engineering Excellence</span>
            </h1>
            <p className="text-navy-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Two decades of innovation, quality education, and shaping the engineers who build the future.
            </p>
          </motion.div>

          {/* College Info Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="glass rounded-xl p-6 border border-navy-700/30 animate-pulse space-y-3">
                  <div className="w-6 h-6 rounded bg-navy-800 mx-auto" />
                  <div className="h-4 bg-navy-800 w-3/4 mx-auto rounded" />
                  <div className="h-3 bg-navy-850 w-1/2 mx-auto rounded" />
                </div>
              ))
            ) : (
              [
                { icon: Calendar, label: "Established", value: profile?.established_year.toString() || "2000" },
                { icon: MapPin, label: "Location", value: profile?.location.split(",")[0] || "West Godavari" },
                { icon: Building2, label: "Departments", value: "5 Specializations" },
                { icon: Trophy, label: "Accreditation", value: "NAAC A-Grade & NBA" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass rounded-xl p-4 text-center border border-navy-700/30"
                >
                  <item.icon className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <div className="text-white font-semibold text-sm">{item.value}</div>
                  <div className="text-navy-400 text-xs">{item.label}</div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* College Overview */}
        <section className="pb-20 bg-gradient-to-b from-transparent to-navy-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Who We <span className="gradient-text-emerald">Are</span>
                </h2>
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-navy-800 rounded w-full" />
                    <div className="h-4 bg-navy-800 rounded w-full" />
                    <div className="h-4 bg-navy-800 rounded w-5/6" />
                    <div className="h-4 bg-navy-850 rounded w-full mt-6" />
                    <div className="h-4 bg-navy-850 rounded w-4/5" />
                  </div>
                ) : (
                  <>
                    <p className="text-navy-200 text-base leading-relaxed mb-4">
                      {profile?.full_description}
                    </p>
                    <p className="text-navy-300 text-sm leading-relaxed flex flex-col gap-2">
                      <span className="flex items-center gap-2">
                        <BookmarkCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        {profile?.affiliation}
                      </span>
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        {profile?.approval_details}
                      </span>
                    </p>
                  </>
                )}
              </motion.div>

              {/* Decorative Progress Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass rounded-2xl p-8 border border-navy-700/30"
              >
                <div className="space-y-4">
                  {[
                    { label: "Total Students", value: "5000+", bar: 85 },
                    { label: "Faculty Members", value: "150+", bar: 75 },
                    { label: "Placement Rate", value: "92%", bar: 92 },
                    { label: "Industry Partners", value: "100+", bar: 80 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-navy-200 text-sm">{item.label}</span>
                        <span className="text-emerald-400 text-sm font-bold">{item.value}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-navy-800">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.bar}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Vision & Mission */}
            <div className="grid lg:grid-cols-2 gap-6 mb-20">
              {loading ? (
                <>
                  <div className="glass rounded-2xl p-8 border border-navy-700/30 animate-pulse h-48" />
                  <div className="glass rounded-2xl p-8 border border-navy-700/30 animate-pulse h-48" />
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="glass rounded-2xl p-8 border border-gold-500/20"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-gold-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Our Vision</h2>
                    </div>
                    <p className="text-navy-200 text-base leading-relaxed italic border-l-2 border-gold-500/40 pl-4">
                      &ldquo;{vision?.vision}&rdquo;
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="glass rounded-2xl p-8 border border-emerald-500/20"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Target className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Our Mission</h2>
                    </div>
                    <ul className="space-y-3">
                      {vision?.mission.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-navy-200 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </>
              )}
            </div>

            {/* Core Values Section */}
            <SectionTitle
              badge="Core Values"
              title="Principles That Guide"
              highlight="SSIET Excellence"
              description="Our fundamental beliefs that shape our organizational culture and educational pedagogy."
              className="mb-12"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-20">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="glass rounded-2xl p-6 border border-navy-700/30 animate-pulse h-28" />
                ))
              ) : (
                vision?.core_values.map((val, i) => (
                  <motion.div
                    key={val}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="glass rounded-2xl p-6 border border-navy-800/40 text-center hover:border-emerald-500/20 card-hover flex flex-col justify-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-2 text-emerald-400 text-xs font-bold">
                      {i + 1}
                    </div>
                    <h3 className="text-white font-bold text-sm">{val}</h3>
                  </motion.div>
                ))
              )}
            </div>

            {/* Achievements Section */}
            <SectionTitle
              badge="Achievements"
              title="Our"
              highlight="Milestones"
              description="Recognitions and milestones that define our commitment to excellence."
              className="mb-12"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="glass rounded-2xl p-6 border border-navy-700/30 animate-pulse h-48" />
                ))
              ) : (
                achievements.map((ach, i) => {
                  const Icon = achievementIconMap[ach.title.includes("NAAC") ? "Award" : (i % 2 === 0 ? "Trophy" : "Medal")] ?? Trophy;
                  return (
                    <motion.div
                      key={ach.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="glass rounded-2xl p-6 border border-navy-700/30 card-hover text-center group"
                    >
                      <div className="w-12 h-12 mx-auto rounded-xl bg-gold-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-gold-400" />
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2 block">
                        {ach.category}
                      </span>
                      <h3 className="text-white font-semibold text-sm mb-2">{ach.title}</h3>
                      <p className="text-navy-300 text-xs leading-relaxed">{ach.description}</p>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Accreditation Section ("Recognized and Approved By") */}
            <SectionTitle
              badge="Recognitions"
              title="Recognized and"
              highlight="Approved By"
              description="SSIET is validated by key governing boards ensuring premium standard engineering degrees."
              className="mb-12"
            />
            <div className="grid sm:grid-cols-3 gap-6 mb-20">
              {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="glass rounded-2xl p-6 border border-navy-700/30 animate-pulse h-36" />
                ))
              ) : (
                accreditations.map((acc, i) => (
                  <motion.div
                    key={acc.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="glass rounded-2xl p-6 border border-navy-750 flex flex-col justify-between hover:border-emerald-500/20 card-hover"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-emerald-400 font-extrabold text-sm tracking-wider">{acc.organization_name}</span>
                        <span className="text-[10px] text-navy-450 font-bold bg-navy-950 px-2 py-0.5 rounded">{acc.year}</span>
                      </div>
                      <h3 className="text-white font-bold text-sm mb-2">{acc.certificate_name}</h3>
                      <p className="text-navy-300 text-xs leading-relaxed">{acc.description}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Timeline History */}
            <SectionTitle
              badge="Our Journey"
              title="College"
              highlight="History Timeline"
              description="A journey of growth, innovation, and academic excellence."
              className="mb-12"
            />
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-navy-600 to-navy-800 -translate-x-1/2" />

              <div className="space-y-8">
                {loading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="relative flex justify-start pl-10 md:pl-0 animate-pulse">
                      <div className="w-full md:w-[calc(50%-2rem)] h-24 glass border border-navy-700/30 rounded-xl" />
                    </div>
                  ))
                ) : (
                  collegeInfo?.timeline?.map((event: any, i: number) => {
                    const isLeft = i % 2 === 0;
                    return (
                      <motion.div
                        key={event.year}
                        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className={`relative flex items-center ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-row pl-10 md:pl-0`}
                      >
                        {/* Content */}
                        <div className={`w-full md:w-[calc(50%-2rem)] ${isLeft ? "md:pr-8" : "md:pl-8"}`}>
                          <div className="glass rounded-xl p-5 border border-navy-700/30 card-hover">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-emerald-400 font-black text-xl">{event.year}</span>
                            </div>
                            <h3 className="text-white font-semibold text-sm mb-1">{event.title}</h3>
                            <p className="text-navy-300 text-xs leading-relaxed">{event.description}</p>
                          </div>
                        </div>

                        {/* Timeline dot */}
                        <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-400 border-2 border-navy-900 shadow-lg shadow-emerald-400/30" />
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Footer contact info callout */}
            {!loading && profile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-20 p-6 rounded-2xl glass border border-navy-750 flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div>
                  <h3 className="text-white font-bold text-base mb-1">Get in Touch with SSIET</h3>
                  <p className="text-navy-300 text-xs">Reach our administrative office for any queries or campus visit schedules.</p>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-xs text-navy-200">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <a href={`http://${profile.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{profile.website}</a>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <a href={`mailto:${profile.email}`} className="hover:underline">{profile.email}</a>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>{profile.phone}</span>
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
