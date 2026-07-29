"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, MessagesSquare, Percent, Laptop, Star, CheckCircle } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";

const trainingPrograms = [
  { icon: Code2, title: "Data Structures & Algorithms", desc: "Rigorous coding bootcamps covering lists, trees, search techniques, and dynamic programming patterns to clear MNC coding screenings." },
  { icon: MessagesSquare, title: "Soft Skills & Communication", desc: "Interactive modules focusing on mock group discussions, email etiquettes, professional resume formats, and pitch delivery." },
  { icon: Percent, title: "Quantitative & Logic Aptitude", desc: "Special training runs highlighting speed mathematics, logical charts, arithmetic shortcuts, and mental reasoning questions." },
  { icon: Laptop, title: "Technical Mock Interviews", desc: "Mock interviews with industry experts, structural system design tutorials, and live review feedback to build student confidence." },
];

const timelineSteps = [
  { year: "Year 1", phase: "Foundation Skills", desc: "Introduction to logical problem solving, algorithmic thinking, basic programming syntax, and english vocabulary drills." },
  { year: "Year 2", phase: "Technical Development", desc: "Core database concepts, data structures laboratory, web dev frameworks, and mini-project creations." },
  { year: "Year 3", phase: "Industry Preparation", desc: "Industrial internships, full-stack capstone projects, placement mock interviews, and advanced aptitude practice." },
  { year: "Year 4", phase: "Placement Success", desc: "On-campus placement drives, hiring rounds, portfolio presentations, and career transitions to corporatized offices." },
];

export default function CareerDevelopmentClient() {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        {/* Header */}
        <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionTitle
            badge="CDC Division"
            title="Career Development"
            highlight="Center"
            description="Our dedicated training wing ensures students are equipped with coding depth, logical aptitude, and communication confidence required to pass recruitment loops."
            className="mb-14"
          />

          {/* Programs Grid */}
          <div className="grid sm:grid-cols-2 gap-6 mb-20">
            {trainingPrograms.map((prog, i) => (
              <motion.div
                key={prog.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-2xl p-6 sm:p-8 border border-navy-700/35 card-hover flex gap-5 items-start group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-navy-600/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <prog.icon className="w-6 h-6 text-emerald-450" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base mb-2">{prog.title}</h3>
                  <p className="text-navy-355 text-xs sm:text-sm leading-relaxed">{prog.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Timeline prep journey */}
          <SectionTitle
            badge="CDC Roadmap"
            title="Placement Preparation"
            highlight="Timeline Journey"
            description="A step-by-step CDC roadmap mapped from the very first semester up to final year placement selections."
            className="mb-14"
          />

          <div className="relative max-w-4xl mx-auto pl-8 md:pl-0">
            {/* Timeline center line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 to-navy-750 -translate-x-1/2" />

            <div className="space-y-10">
              {timelineSteps.map((step, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={step.year}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`relative flex items-center ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}
                  >
                    {/* Content */}
                    <div className={`w-full md:w-[calc(50%-2.5rem)] ${isLeft ? "md:pr-8" : "md:pl-8"}`}>
                      <div className="glass rounded-2xl p-6 border border-navy-700/35 card-hover">
                        <div className="flex items-center gap-3 mb-2.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold uppercase border border-emerald-500/20">
                            {step.year}
                          </span>
                          <h3 className="text-white font-bold text-sm sm:text-base">{step.phase}</h3>
                        </div>
                        <p className="text-navy-300 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-navy-950 border-2 border-emerald-450 shadow-md shadow-emerald-450/40" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
