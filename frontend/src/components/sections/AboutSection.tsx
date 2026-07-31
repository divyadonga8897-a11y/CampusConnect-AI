"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { COLLEGE_INFO } from "@/constants/collegeData";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useRouter } from "next/navigation";

const highlights = [
  "NAAC Accredited with high-grade score for academic excellence",
  "NBA Certified programs across engineering departments",
  "100+ industry recruiting partners providing internship opportunities",
  "State-of-the-art labs, innovation center, and AI research hub",
];

export default function AboutSection() {
  const router = useRouter();

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
            className="order-1 lg:order-2 space-y-6"
          >
            <SectionHeader
              eyebrow="About Our Institution"
              title="A Legacy of Engineering"
              highlight="Excellence"
              align="left"
              className="mb-4"
            />

            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Established in the year 2000, Sri Satya Institute of Engineering and Technology (SSIET) stands as a premier beacon of technical learning in Andhra Pradesh. Over the past two and a half decades, our institution has been deeply committed to cultivating a robust academic environment that blends scientific rigor with ethical responsibilities. We believe that true engineering excellence goes beyond textbooks, requiring hands-on design experiences and creative problem-solving capabilities.
            </p>

            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Our campus serves as a thriving collaborative hub where passionate faculty and aspiring engineers come together to explore emergent fields, from AI and machine learning to structural integrity and green technology. Through strategic partnerships with over 100 industrial firms, our curriculum is constantly refreshed to ensure that every graduate transitions seamlessly from academic coursework to professional real-world engineering careers.
            </p>

            {/* Structured Feature Highlights */}
            <div className="grid sm:grid-cols-2 gap-6 pt-2 pb-2 text-left">
              {[
                {
                  title: "NAAC Accredited with Excellence",
                  desc: "Providing nationally recognized educational benchmarks and consistent quality improvements across all engineering fields.",
                },
                {
                  title: "Industry-Aligned Curriculum",
                  desc: "Syllabi structured alongside technology companies and corporate panels to ensure real-world career readiness.",
                },
                {
                  title: "Modern Research Facilities",
                  desc: "Equipped with specialized AI research spaces, high-tech computation arrays, and structural testing labs.",
                },
                {
                  title: "Dedicated Veteran Faculty",
                  desc: "Professor teams combining years of academic theory with commercial project consultation expertise.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {["NAAC Accredited", "AICTE Approved", "NBA Certified", "JNTU Affiliated"].map((tag) => (
                <Badge key={tag} variant="light" color="slate">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                onClick={() => router.push("/about")}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Our Story →
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
