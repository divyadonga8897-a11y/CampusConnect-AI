"use client";

import Link from "next/link";
import { GraduationCap, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B0F19] text-slate-300 py-16 border-t border-slate-900">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 items-start mb-12">
          
          {/* Brand/Programs Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-black text-white">SSIET Programs</h3>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xs">
              Where Sri Satya Institute of Engineering and Technology prepares next-generation developers, engineers, and technological leaders.
            </p>
          </div>

          {/* Quick Links Column 1 */}
          <div>
            <ul className="space-y-3.5">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors text-xs sm:text-sm font-semibold">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-slate-400 hover:text-white transition-colors text-xs sm:text-sm font-semibold">
                  Academics
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="text-slate-400 hover:text-white transition-colors text-xs sm:text-sm font-semibold">
                  Admissions
                </Link>
              </li>
              <li>
                <Link href="/student-life" className="text-slate-400 hover:text-white transition-colors text-xs sm:text-sm font-semibold">
                  Campus Life
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 2 */}
          <div>
            <ul className="space-y-3.5">
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors text-xs sm:text-sm font-semibold">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/research" className="text-slate-400 hover:text-white transition-colors text-xs sm:text-sm font-semibold">
                  Research
                </Link>
              </li>
              <li>
                <Link href="/placements" className="text-slate-400 hover:text-white transition-colors text-xs sm:text-sm font-semibold">
                  Placement
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors text-xs sm:text-sm font-semibold">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Icons & Full Name */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
            <p className="text-white text-[11px] leading-relaxed max-w-xs font-bold">
              Sri Satya Institute of Engineering and Technology, SSIET
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 mt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 font-medium">
            © 2024 Sri Satya Institute of Engineering and Technology
          </p>
        </div>
      </div>
    </footer>
  );
}
