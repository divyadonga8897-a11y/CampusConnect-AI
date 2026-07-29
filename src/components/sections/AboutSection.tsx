"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Eye, Target, CheckCircle2 } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { COLLEGE_INFO } from "@/constants/collegeData";

export default function AboutSection() {
  return (
    <section className="relative section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="About College"
          title="Shaping Engineers Who"
          highlight="Lead the Future"
          description="Sri Satya Institute of Engineering and Technology has been at the forefront of technical education for over two decades."
          className="mb-14"
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-navy-200 text-base leading-relaxed mb-6">
              {COLLEGE_INFO.description}
            </p>
            <p className="text-navy-300 text-sm leading-relaxed mb-8">
              Established in {COLLEGE_INFO.established}, we have consistently delivered excellence in engineering education. Our curriculum, regularly updated with industry inputs, ensures graduates are equipped with both theoretical knowledge and practical skills.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                "NAAC Accredited",
                "NBA Certified",
                "AICTE Approved",
                "Industry Partnerships",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full glass-emerald text-emerald-300 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-navy-600/40 text-white font-semibold text-sm hover:border-emerald-500/40 hover:text-emerald-400 transition-all duration-200 group"
            >
              Explore College History
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right: Vision & Mission Cards */}
          <div className="space-y-4">
            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass rounded-2xl p-6 border border-navy-700/30 card-hover"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-gold-400" />
                </div>
                <h3 className="text-white font-semibold text-lg">Our Vision</h3>
              </div>
              <p className="text-navy-200 text-sm leading-relaxed">{COLLEGE_INFO.vision}</p>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass rounded-2xl p-6 border border-navy-700/30 card-hover"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold text-lg">Our Mission</h3>
              </div>
              <ul className="space-y-2">
                {COLLEGE_INFO.mission.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-navy-200 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
