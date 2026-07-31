"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, GraduationCap, Building2, Users, TrendingUp, Lightbulb, Globe } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { WHY_CHOOSE_US } from "@/constants/collegeData";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const iconMap: Record<string, React.ElementType> = {
  GraduationCap, Building2, Users, TrendingUp, Lightbulb, Globe,
};

export default function WhyChooseUs() {
  const router = useRouter();

  return (
    <section className="section bg-white border-t border-slate-100">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Features */}
          <div>
            <SectionHeader
              eyebrow="Why Choose SSIET"
              title="Engineered for Your"
              highlight="Success"
              align="left"
              className="mb-4"
            />

            <div className="space-y-4 text-slate-650 text-sm md:text-base leading-relaxed mb-6">
              <p>
                At Sri Satya Institute of Engineering and Technology (SSIET), we believe that engineering is a calling to solve humanity's most complex challenges. Our educational framework is built on a solid foundation of experiential learning, where theoretical principles are put to the test in modern laboratories. Every student is guided through individual mentorship to discover their potential and cultivate specialized expertise.
              </p>
              <p>
                Through collaborative hackathons, active research labs, and continuous engagement with our extensive alumni network, we create an ecosystem that fosters leadership and entrepreneurial spirit. Choosing SSIET means choosing a path of self-discovery, technical mastery, and professional readiness that prepares you to thrive in a global technology economy.
              </p>
            </div>

            <div className="space-y-3.5">
              {WHY_CHOOSE_US.map((item, i) => {
                const Icon = iconMap[item.icon] ?? GraduationCap;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.07 }}
                  >
                    <Card variant="default" className="flex items-start gap-4 p-4 hover:border-blue-400 group">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8">
              <Button variant="outline" onClick={() => router.push("/about")}>
                Discover More <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/campus/ai-lab.webp"
                alt="SSIET students in the computer lab"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 -z-10 translate-x-3 translate-y-3 rounded-2xl bg-emerald-100" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
