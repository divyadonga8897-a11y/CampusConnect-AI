"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, TrendingUp, Building2, IndianRupee, Users, Award } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { PLACEMENT_STATS, RECRUITERS } from "@/constants/collegeData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const stats = [
  { icon: TrendingUp, label: "Placement Rate", value: `${PLACEMENT_STATS.placementRate}%`, color: "text-emerald-700", bg: "bg-emerald-50", col: "green" as const },
  { icon: IndianRupee, label: "Highest Package", value: PLACEMENT_STATS.highestPackage, color: "text-blue-700", bg: "bg-blue-50", col: "blue" as const },
  { icon: Award, label: "Average Package", value: PLACEMENT_STATS.averagePackage, color: "text-amber-700", bg: "bg-amber-50", col: "amber" as const },
  { icon: Building2, label: "Companies Visited", value: `${PLACEMENT_STATS.companies}+`, color: "text-indigo-700", bg: "bg-indigo-50", col: "indigo" as const },
];

export default function PlacementSection() {
  const router = useRouter();

  return (
    <section className="section bg-slate-50 border-t border-slate-100">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Text & Stats */}
          <div>
            <SectionHeader
              eyebrow="Placements"
              title="92% Placement Rate —"
              highlight="Consistently"
              description="SSIET graduates are placed at India's top IT companies, manufacturing firms, and global MNCs every year."
              align="left"
              className="mb-8"
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <Card variant="default" className="p-5">
                      <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                        <Icon className={`w-4 h-4 ${s.color}`} />
                      </div>
                      <div className="text-xl font-black text-slate-900 mb-0.5">{s.value}</div>
                      <div className="text-xs text-slate-500 font-medium">{s.label}</div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <Button
              variant="primary"
              onClick={() => router.push("/placements")}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Placement Details
            </Button>
          </div>

          {/* Right: Image + Recruiters */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Placement Photo */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg mb-6">
              <Image
                src="/images/placements/placement-drive.jpg"
                alt="Campus placement drive at SSIET"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
            </div>

            {/* Recruiter Tags */}
            <Card variant="default" className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Top Recruiters</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {RECRUITERS.slice(0, 16).map((r) => (
                  <Badge key={r} variant="light" color="slate">
                    {r}
                  </Badge>
                ))}
                <Badge variant="light" color="blue">
                  +{Math.max(0, RECRUITERS.length - 16)} more
                </Badge>
              </div>
            </Card>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
