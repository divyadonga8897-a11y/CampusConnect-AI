"use client";

import { motion } from "framer-motion";
import { TrendingUp, Building2, IndianRupee, Users, Award, ShieldCheck, Cpu } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { PLACEMENT_STATS, RECRUITERS } from "@/constants/collegeData";

const stats = [
  {
    icon: TrendingUp,
    label: "Placement Success Rate",
    value: `${PLACEMENT_STATS.placementRate}%`,
    color: "emerald",
    desc: "Consistent annual placements track"
  },
  {
    icon: Award,
    label: "Highest Package Secured",
    value: PLACEMENT_STATS.highestPackage,
    color: "gold",
    desc: "Offered by top multinational tech firms"
  },
  {
    icon: IndianRupee,
    label: "Average Annual Package",
    value: PLACEMENT_STATS.averagePackage,
    color: "navy",
    desc: "Industry leading entry levels"
  },
  {
    icon: Building2,
    label: "Recruiting Corporate Partners",
    value: `${PLACEMENT_STATS.companies}+`,
    color: "emerald",
    desc: "Major tech & production companies"
  },
];

export default function PlacementSection() {
  return (
    <section className="relative section-padding bg-grid overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/10 to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionTitle
          badge="Careers & Placements"
          title="Building Global Careers Through"
          highlight="Industry Connections"
          description={`Academic Year ${PLACEMENT_STATS.year} Placement Report — our students are placed at leading software, AI, and hardware companies.`}
          className="mb-16"
        />

        {/* Statistics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass rounded-3xl p-6 border border-white/5 card-hover group relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-blue-500/5 blur-lg group-hover:bg-blue-500/10 transition-all" />
              
              <div>
                {/* Icon Container */}
                <div className={`w-11 h-11 rounded-xl ${
                  stat.color === "emerald"
                    ? "bg-emerald-500/15"
                    : stat.color === "gold"
                    ? "bg-yellow-500/15"
                    : "bg-blue-500/15"
                } flex items-center justify-center mb-5 border border-white/5 group-hover:scale-105 transition-transform duration-300`}>
                  <stat.icon className={`w-5 h-5 ${
                    stat.color === "emerald"
                      ? "text-emerald-450"
                      : stat.color === "gold"
                      ? "text-yellow-400"
                      : "text-blue-400"
                  }`} />
                </div>

                {/* Counter */}
                <div className="text-3xl font-black text-white mb-2 tracking-tight group-hover:text-blue-300 transition-colors">
                  {stat.value}
                </div>
              </div>

              <div>
                <div className="text-white font-bold text-xs sm:text-sm mb-1">{stat.label}</div>
                <div className="text-[10px] sm:text-xs text-navy-450 leading-relaxed">{stat.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Placement Training Programs */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-8 border border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              Career Readiness & Bootcamps
            </h3>
            <p className="text-navy-300 text-xs sm:text-sm leading-relaxed mb-4">
              We conduct structured training bootcamps starting from the 3rd year. This includes technical coding classes, algorithms training, full-stack systems projects, and custom aptitude assessments.
            </p>
            <ul className="space-y-2 text-navy-200 text-xs sm:text-sm font-semibold">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                120+ hours of dedicated coding bootcamps
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Mock technical interviews and communication training
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-8 border border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-450" />
              Industry Projects & Internships
            </h3>
            <p className="text-navy-300 text-xs sm:text-sm leading-relaxed mb-4">
              Students get direct opportunities to work on industry-sponsored research projects inside our smart technology hubs and secure internships with leading corporate partners.
            </p>
            <ul className="space-y-2 text-navy-200 text-xs sm:text-sm font-semibold">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Direct internship drives with leading IT partners
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Opportunities to publish research papers with mentors
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Recruiters Board */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl p-8 border border-white/5 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/20 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-2.5 mb-6 justify-center">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-white font-bold text-sm tracking-wider uppercase">Our Premium Recruiting Partners</span>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {RECRUITERS.map((company, i) => (
              <motion.div
                key={company}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="px-4 py-2 rounded-xl glass-light text-xs sm:text-sm text-navy-250 font-bold border border-white/5 hover:border-blue-500/35 hover:text-blue-300 transition-all duration-300 shadow-sm"
              >
                {company}
              </motion.div>
            ))}
            <div className="px-4 py-2 rounded-xl glass-emerald text-xs sm:text-sm text-emerald-300 font-bold border border-emerald-500/25">
              & 90+ more companies
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
