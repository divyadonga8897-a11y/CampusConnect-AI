"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { COLLEGE_INFO } from "@/constants/collegeData";

const highlights = [
  "NAAC Accredited with high-grade score for academic excellence",
  "NBA Certified programs across engineering departments",
  "100+ industry recruiting partners providing internship opportunities",
  "State-of-the-art labs, innovation center, and AI research hub",
];

export default function AboutSection() {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/campus/academic-block.webp"
                alt="SSIET Academic Block"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Accent card */}
            <div className="absolute -bottom-5 -right-5 bg-white border border-slate-200 rounded-xl shadow-lg p-4 max-w-[180px]">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Established</div>
              <div className="text-2xl font-black text-slate-900">{COLLEGE_INFO.established}</div>
              <div className="text-xs text-slate-500 mt-0.5">25+ years of excellence</div>
            </div>
            <div className="absolute inset-0 -z-10 translate-x-3 translate-y-3 rounded-2xl bg-blue-100" />
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <SectionHeader
              eyebrow="About SSIET"
              title="A Legacy of Engineering"
              highlight="Excellence"
              align="left"
              className="mb-6"
            />

            <p className="text-slate-500 text-base leading-relaxed mb-5">
              {COLLEGE_INFO.description}
            </p>

            <ul className="space-y-3 mb-8">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 mb-8">
              {["NAAC Accredited", "AICTE Approved", "NBA Certified", "JNTU Affiliated"].map((tag) => (
                <span key={tag} className="badge badge-slate">{tag}</span>
              ))}
            </div>

            <Link href="/about" className="btn btn-outline inline-flex">
              Learn Our Story <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
