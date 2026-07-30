"use client";

import Link from "next/link";
import { GraduationCap, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { COLLEGE_INFO } from "@/constants/collegeData";

const quickLinks = [
  { label: "About SSIET",    href: "/about"       },
  { label: "Leadership",     href: "/leadership"  },
  { label: "Achievements",   href: "/achievements"},
  { label: "Gallery",        href: "/gallery"     },
  { label: "Events",         href: "/events"      },
  { label: "Contact",        href: "/contact"     },
];

const programs = [
  { label: "B.Tech CSE",      href: "/departments/cse"  },
  { label: "B.Tech AI & DS",  href: "/departments/aids" },
  { label: "B.Tech ECE",      href: "/departments/ece"  },
  { label: "B.Tech Mechanical",href: "/departments/mech"},
  { label: "B.Tech Civil",    href: "/departments/civil"},
];

const studentLinks = [
  { label: "Admissions",      href: "/admissions"      },
  { label: "Fee Structure",   href: "/fees"            },
  { label: "Scholarships",    href: "/scholarships"    },
  { label: "Placements",      href: "/placements"      },
  { label: "Career Training", href: "/career-training" },
  { label: "Enquiry Form",    href: "/enquiry"         },
];

const accreditations = ["NAAC", "AICTE", "NBA", "JNTU-K", "APSCHE"];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">

      {/* ── Main Footer ── */}
      <div className="container py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-black text-white">SSIET</div>
                <div className="text-[10px] text-slate-400 leading-none">Sri Satya Institute</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              A premier NAAC accredited engineering institution in Andhra Pradesh, empowering future engineers through innovation and excellence.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {accreditations.map((a) => (
                <span key={a} className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700 text-slate-400">{a}</span>
              ))}
            </div>
            <div className="space-y-2 text-sm text-slate-400">
              <a href={`tel:${COLLEGE_INFO.phone}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5" /> {COLLEGE_INFO.phone}
              </a>
              <a href={`mailto:${COLLEGE_INFO.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5" /> {COLLEGE_INFO.email}
              </a>
              <div className="flex items-start gap-2 text-xs leading-relaxed">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {COLLEGE_INFO.address}
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-blue-400 transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Programs */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">B.Tech Programs</h3>
            <ul className="space-y-2">
              {programs.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-emerald-400 transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-xs font-black text-white uppercase tracking-widest mt-6 mb-4">Admissions</h3>
            <ul className="space-y-2">
              {studentLinks.slice(0, 4).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-amber-400 transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: CTA Block */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Admissions 2026-27</h3>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-5">
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Applications open for B.Tech programs. Merit and government scholarships available.
              </p>
              <Link href="/admissions" className="btn btn-primary btn-sm w-full justify-center">
                Apply Now
              </Link>
            </div>
            <Link href="/enquiry" className="btn btn-secondary btn-sm w-full justify-center bg-transparent border-slate-700 text-slate-300 hover:border-blue-500 hover:text-white">
              Submit Enquiry
            </Link>
            <a
              href={`https://${COLLEGE_INFO.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-500 hover:text-white transition-colors"
            >
              {COLLEGE_INFO.website} <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-slate-800">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© {year} Sri Satya Institute of Engineering and Technology. All rights reserved.</span>
          <span className="flex items-center gap-3">
            <Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Terms of Use</Link>
          </span>
        </div>
      </div>

    </footer>
  );
}
