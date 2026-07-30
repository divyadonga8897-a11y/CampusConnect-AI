"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Monitor, Brain, BookOpen, Home, Dumbbell, UtensilsCrossed, Mic2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const facilities = [
  {
    name: "Computer Labs",
    description: "350+ high-performance workstations across 5 labs with latest software suites.",
    icon: Monitor,
    image: "/images/campus/ai-lab.webp",
    href: "/labs",
    tag: "Technology",
  },
  {
    name: "Central Library",
    description: "50,000+ books, e-journals, digital resources and dedicated reading halls.",
    icon: BookOpen,
    image: "/images/campus/library.webp",
    href: "/library",
    tag: "Knowledge",
  },
  {
    name: "Hostel",
    description: "Separate hostel blocks for boys and girls with modern amenities and dining.",
    icon: Home,
    image: "/images/hostel/hostel-room.webp",
    href: "/hostel",
    tag: "Accommodation",
  },
  {
    name: "Sports Ground",
    description: "Cricket, football, basketball, and athletics facilities on sprawling grounds.",
    icon: Dumbbell,
    image: "/images/sports.png",
    href: "/student-life",
    tag: "Sports",
  },
  {
    name: "Auditorium",
    description: "800-seat fully-equipped auditorium for events, seminars, and convocations.",
    icon: Mic2,
    image: "/images/campus-life/auditorium.jpg",
    href: "/campus",
    tag: "Events",
  },
  {
    name: "Cafeteria",
    description: "Hygienic, affordable food court serving 1,000+ students daily.",
    icon: UtensilsCrossed,
    image: "/images/cafeteria.png",
    href: "/campus",
    tag: "Dining",
  },
];

export default function CampusPreview() {
  return (
    <section className="section bg-white">
      <div className="container">
        <SectionHeader
          eyebrow="Campus Life"
          title="World-Class Campus"
          highlight="Facilities"
          description="Every facility is designed to support learning, well-being, and holistic development."
          className="mb-12"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="card overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <Image
                    src={f.image}
                    alt={f.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute top-3 left-3 badge badge-slate bg-white/90 backdrop-blur-sm text-[10px]">
                    {f.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {f.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{f.description}</p>
                  <Link href={f.href} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                    Learn more <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/campus" className="btn btn-outline">
            Take a Virtual Tour <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
