"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Eye, Target, CheckCircle2, Trophy, Medal, Microscope,
  Building2, MapPin, Calendar, Award, Globe, Mail, Phone,
  BookmarkCheck, ArrowRight, GraduationCap, Sparkles
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  collegeService,
  type CollegeProfile, type VisionMission,
  type CollegeAchievement, type CollegeAccreditation
} from "@/services/collegeService";

const achievementIconMap: Record<string, React.ElementType> = {
  Academic:    Trophy,
  Research:    Microscope,
  Awards:      Award,
  Recognition: Medal,
};

export default function AboutPageClient() {
  const [aiOpen, setAiOpen]               = useState(false);
  const [loading, setLoading]             = useState(true);
  const [profile, setProfile]             = useState<CollegeProfile | null>(null);
  const [vision, setVision]               = useState<VisionMission | null>(null);
  const [achievements, setAchievements]   = useState<CollegeAchievement[]>([]);
  const [accreditations, setAccreditations] = useState<CollegeAccreditation[]>([]);
  const [collegeInfo, setCollegeInfo]     = useState<any>(null);

  useEffect(() => {
    Promise.all([
      collegeService.getProfile(),
      collegeService.getVision(),
      collegeService.getAchievements(),
      collegeService.getAccreditation(),
      collegeService.getCollege(),
    ]).then(([profRes, visRes, achRes, accRes, colRes]) => {
      setProfile(profRes.data);
      setVision(visRes.data);
      setAchievements(achRes.data);
      setAccreditations(accRes.data);
      setCollegeInfo(colRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="About SSIET"
          title="A Legacy of Engineering"
          highlight="Excellence"
          description="Two decades of innovation, quality education, and shaping engineers who build the future."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
          actions={
            <>
              <Link href="/admissions" className="btn btn-primary">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
              <button onClick={() => setAiOpen(true)} className="btn btn-secondary">
                <Sparkles className="w-4 h-4 text-emerald-500" /> Ask AI
              </button>
            </>
          }
        />

        {/* College Info Cards */}
        <section className="container py-10">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="skeleton h-28 rounded-xl" />)}
            </div>
          ) : collegeInfo && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Established",        value: collegeInfo.established,      icon: Calendar,        color: "text-blue-600",    bg: "bg-blue-50"   },
                { label: "Location",           value: collegeInfo.location,          icon: MapPin,         color: "text-emerald-600", bg: "bg-emerald-50"},
                { label: "Affiliation",        value: collegeInfo.affiliation,       icon: GraduationCap,  color: "text-amber-600",   bg: "bg-amber-50"  },
                { label: "Website",            value: collegeInfo.website,           icon: Globe,          color: "text-purple-600",  bg: "bg-purple-50" },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="card p-5"
                >
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="text-xs text-slate-400 font-medium mb-0.5">{label}</div>
                  <div className="text-sm font-bold text-slate-900 line-clamp-2">{value}</div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* College Profile */}
        <section className="section bg-white">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/campus/academic-block.webp"
                    alt="SSIET Academic Block"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute -bottom-5 -right-5 bg-white border border-slate-200 rounded-xl shadow-lg p-4">
                  <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Est.</div>
                  <div className="text-2xl font-black text-slate-900">1999</div>
                </div>
                <div className="absolute inset-0 -z-10 translate-x-3 translate-y-3 rounded-2xl bg-blue-100" />
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <SectionHeader
                  eyebrow="Our Story"
                  title="Who We"
                  highlight="Are"
                  align="left"
                  className="mb-5"
                />
                {loading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="skeleton h-4 rounded" />)}
                  </div>
                ) : (
                  <p className="text-slate-500 text-base leading-relaxed mb-6">
                    {profile?.full_description ?? "Sri Satya Institute of Engineering and Technology (SSIET) is a premier NAAC accredited engineering institution in Andhra Pradesh, offering quality education through innovative programs and experienced faculty."}
                  </p>
                )}

                {/* Core Values from vision */}
                {vision?.core_values && vision.core_values.length > 0 && (
                  <div className="mb-6">
                    <div className="text-label text-slate-400 mb-3">Core Values</div>
                    <div className="flex flex-wrap gap-2">
                      {vision.core_values.map((v: string) => (
                        <span key={v} className="badge badge-blue text-xs">{v}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accreditations */}
                {!loading && accreditations.length > 0 && (
                  <div className="border-t border-slate-100 pt-5">
                    <div className="text-label text-slate-400 mb-3">Accreditations</div>
                    <div className="flex flex-wrap gap-2">
                      {accreditations.map((acc) => (
                        <div key={acc.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white">
                          <BookmarkCheck className="w-3 h-3 text-emerald-500" />
                          <span className="text-xs font-semibold text-slate-700">{acc.certificate_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="section bg-slate-50">
          <div className="container">
            <SectionHeader
              eyebrow="Philosophy"
              title="Vision &"
              highlight="Mission"
              className="mb-10"
            />
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="skeleton h-48 rounded-xl" />
                <div className="skeleton h-48 rounded-xl" />
              </div>
            ) : vision && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Vision */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="card p-6"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-3">Our Vision</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{vision.vision}</p>
                </motion.div>

                {/* Mission */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="card p-6"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                    <Target className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-3">Our Mission</h3>
                  {Array.isArray(vision.mission) && vision.mission.length > 0 ? (
                    <ul className="space-y-2">
                      {(vision.mission as string[]).map((m, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /> {m}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 leading-relaxed">{vision.mission}</p>
                  )}
                </motion.div>
              </div>
            )}
          </div>
        </section>

        {/* Key Achievements */}
        <section className="section bg-white">
          <div className="container">
            <SectionHeader
              eyebrow="Achievements"
              title="Our Key"
              highlight="Milestones"
              className="mb-10"
            />
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1,2,3].map(i => <div key={i} className="skeleton h-36 rounded-xl" />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {achievements.slice(0, 6).map((ach, i) => {
                  const Icon = achievementIconMap[ach.category] ?? Trophy;
                  return (
                    <motion.div
                      key={ach.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                      className="card p-5 group"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                          <Icon className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <span className="badge badge-amber text-[10px] mb-1">{ach.category}</span>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {ach.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{ach.description}</p>
                      <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {ach.year}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
            <div className="text-center mt-8">
              <Link href="/achievements" className="btn btn-outline">
                View All Achievements <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Strip */}
        <section className="section bg-slate-900">
          <div className="container text-center">
            <h2 className="heading-section text-white mb-3">
              Have Questions? <span className="gradient-text-blue-light">We're Here</span>
            </h2>
            <p className="text-slate-400 text-base mb-8 max-w-xl mx-auto">
              Reach out to the admissions office or chat with our AI for instant answers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn btn-primary">
                <Phone className="w-4 h-4" /> Contact Us
              </Link>
              <button onClick={() => setAiOpen(true)} className="btn bg-white/10 text-white border border-white/10 hover:bg-white/20">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Ask Campus AI
              </button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
