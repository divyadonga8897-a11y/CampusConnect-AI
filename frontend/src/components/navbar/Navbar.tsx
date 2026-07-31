"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Bot, Menu, X, Phone, Mail, MapPin } from "lucide-react";

interface NavbarProps {
  onAIClick?: () => void;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Academics" },
  { href: "/admissions", label: "Admissions" },
  { href: "/student-life", label: "Campus Life" },
  { href: "/research", label: "Research" },
  { href: "/placements", label: "Placement" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ onAIClick }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      {/* ── Top Info Bar ── */}
      <div className="hidden lg:block bg-slate-900 text-slate-300 text-xs w-full select-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-8 px-6">
          <div className="flex items-center gap-5">
            <a href="tel:+919000000000" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3 h-3 text-blue-400" /> +91 9000-000-000
            </a>
            <a href="mailto:info@ssiet.ac.in" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3 h-3 text-indigo-400" /> info@ssiet.ac.in
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3 h-3 text-emerald-400" /> West Godavari, Andhra Pradesh
          </div>
        </div>
      </div>

      {/* ── Sticky Nav Wrapper ── */}
      <div className="sticky top-0 z-50 w-full bg-[#0B0F19]/60 backdrop-blur-md border-b border-slate-900/40 py-2 sm:py-2.5 px-4 sm:px-6 lg:px-8 transition-all duration-200">
        <header
          className={`mx-auto max-w-6xl w-full rounded-full border border-slate-800/70 bg-[#0F172A]/85 transition-all duration-300 ${scrolled
              ? "shadow-lg bg-[#0F172A]/95 border-slate-700/80 shadow-slate-950/20"
              : "shadow-md shadow-slate-950/10"
            }`}
        >
          <div className="px-5 sm:px-6 flex items-center justify-between h-12 sm:h-13 md:h-14">

            {/* Logo and Brand */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-350">
                <GraduationCap className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="text-sm sm:text-base font-black text-white tracking-tight leading-none transition-colors">
                  SSIET
                </div>
                <div className="text-[8px] sm:text-[9px] text-white font-bold mt-0.5 tracking-wider uppercase leading-none">
                  Sri Satya Institute of Eng & Tech
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5">
              {navLinks.map((link) => {
                const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-base font-medium tracking-tight transition-all duration-300 cursor-pointer px-3.5 py-2 select-none relative group ${active
                        ? "text-white"
                        : "text-slate-350 hover:text-white"
                      }`}
                  >
                    {link.label}
                    {/* Premium Sliding Underline Animation */}
                    <span className={`absolute bottom-0.5 left-3.5 right-3.5 h-[2.5px] bg-blue-500 rounded-full transition-all duration-350 origin-left ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`} />
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Premium Ask AI Button */}
              <button
                onClick={onAIClick}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-800 text-slate-300 text-xs font-bold hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-950/40 hover:shadow-sm transition-all cursor-pointer bg-slate-900/65"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Bot className="w-3.5 h-3.5" />
                Ask AI
              </button>

              {/* Apply Now Button */}
              <Link
                href="/admissions"
                className="bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-750 text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full font-bold text-[10px] sm:text-[11px] tracking-wider transition-all duration-300 shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 hover:scale-[1.04] active:scale-95 uppercase inline-flex items-center justify-center cursor-pointer select-none"
              >
                Apply Now
              </Link>

              {/* Hamburger Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-1.5 sm:p-2 rounded-full text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </header>

        {/* Floating Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute top-full left-4 right-4 z-40 bg-[#0F172A]/95 backdrop-blur-lg border border-slate-800 rounded-2xl shadow-xl p-4 mt-2 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto pointer-events-auto"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] sm:text-[14px] font-semibold transition-colors ${active
                          ? "bg-blue-650/85 text-white font-bold"
                          : "text-slate-300 hover:bg-slate-800"
                        }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              <div className="flex gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => { setMobileOpen(false); onAIClick?.(); }}
                  className="flex-1 py-2 rounded-full border border-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer bg-slate-900"
                >
                  <Bot className="w-4 h-4 text-emerald-500" /> Ask AI
                </button>
                <Link
                  href="/admissions"
                  className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-indigo-650 text-white font-bold text-xs rounded-full text-center justify-center flex items-center cursor-pointer shadow-md shadow-blue-500/10"
                >
                  Apply Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
