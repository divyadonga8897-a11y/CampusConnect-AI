"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Bot, Menu, X, ChevronDown,
  Phone, Mail, MapPin,
  Compass, BookOpen, Building2, ClipboardList,
  Briefcase, Users, Award, HelpCircle, Lightbulb,
  Calendar, Image, Home, Layers
} from "lucide-react";

interface NavbarProps {
  onAIClick?: () => void;
}

interface DropdownItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navMenu: { label: string; items: DropdownItem[] }[] = [
  {
    label: "Discover",
    items: [
      { href: "/about",         label: "About SSIET",      icon: Home },
      { href: "/leadership",    label: "Leadership",        icon: Users },
      { href: "/achievements",  label: "Achievements",      icon: Award },
      { href: "/contact",       label: "Contact Us",        icon: Phone },
    ],
  },
  {
    label: "Programs",
    items: [
      { href: "/departments",   label: "Departments",       icon: Layers },
      { href: "/courses",       label: "All Courses",       icon: BookOpen },
    ],
  },
  {
    label: "Campus",
    items: [
      { href: "/campus",        label: "Campus Tour",       icon: MapPin },
      { href: "/labs",          label: "Laboratories",      icon: Lightbulb },
      { href: "/library",       label: "Library",           icon: BookOpen },
      { href: "/hostel",        label: "Hostel",            icon: Building2 },
      { href: "/infrastructure",label: "Infrastructure",    icon: Compass },
      { href: "/gallery",       label: "Gallery",           icon: Image },
    ],
  },
  {
    label: "Admissions",
    items: [
      { href: "/admissions",    label: "How to Apply",      icon: ClipboardList },
      { href: "/fees",          label: "Fee Structure",     icon: Award },
      { href: "/scholarships",  label: "Scholarships",      icon: Award },
      { href: "/enquiry",       label: "Enquiry Form",      icon: HelpCircle },
    ],
  },
  {
    label: "Placements",
    items: [
      { href: "/placements",        label: "Placement Stats",   icon: Briefcase },
      { href: "/internships",       label: "Internships",       icon: Briefcase },
      { href: "/career-training",   label: "Career Training",   icon: Compass },
      { href: "/success-stories",   label: "Success Stories",   icon: Award },
    ],
  },
  {
    label: "Student Life",
    items: [
      { href: "/student-life",      label: "Student Life",      icon: Users },
      { href: "/events",            label: "Events",            icon: Calendar },
      { href: "/alumni",            label: "Alumni",            icon: GraduationCap },
    ],
  },
];

export default function Navbar({ onAIClick }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
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
      <div className="hidden lg:block bg-slate-900 text-slate-300 text-xs">
        <div className="container flex items-center justify-between h-8">
          <div className="flex items-center gap-5">
            <a href="tel:+919000000000" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3 h-3" /> +91 9000-000-000
            </a>
            <a href="mailto:info@ssiet.ac.in" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3 h-3" /> info@ssiet.ac.in
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3 h-3" /> West Godavari, Andhra Pradesh
          </div>
        </div>
      </div>

      {/* ── Main Nav ── */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-md" : "border-b border-slate-200"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-18">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-800 font-black text-slate-900 leading-tight tracking-tight">SSIET</div>
                <div className="text-[10px] text-slate-500 font-medium leading-none">Sri Satya Institute of Engineering</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navMenu.map((group) => (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(group.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className={`flex items-center gap-1 px-3.5 py-2 text-[13px] font-600 font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeDropdown === group.label
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}>
                    {group.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === group.label ? "rotate-180 text-blue-600" : "text-slate-400"}`} />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === group.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50"
                      >
                        <div className="p-1.5">
                          {group.items.map((item) => {
                            const Icon = item.icon;
                            const active = pathname === item.href;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                                  active
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                              >
                                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-blue-600" : "text-slate-400"}`} />
                                {item.label}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onAIClick}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-[13px] font-semibold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                id="ask-campus-ai-btn"
              >
                <Bot className="w-3.5 h-3.5 text-emerald-500" />
                Ask AI
              </button>

              <Link
                href="/admissions"
                className="btn btn-primary btn-sm hidden sm:inline-flex"
                id="apply-now-btn"
              >
                Apply Now
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Toggle menu"
                id="mobile-menu-btn"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            id="mobile-menu"
            className="lg:hidden fixed top-[calc(4rem+2rem)] inset-x-0 z-40 bg-white border-b border-slate-200 shadow-xl overflow-y-auto max-h-[calc(100vh-6rem)]"
          >
            <div className="container py-4 space-y-4">
              {navMenu.map((group) => (
                <div key={group.label}>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 mb-1.5">
                    {group.label}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                          pathname === item.href
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <item.icon className="w-4 h-4 text-slate-400 shrink-0" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => { setMobileOpen(false); onAIClick?.(); }}
                  className="flex-1 btn btn-secondary btn-sm"
                >
                  <Bot className="w-4 h-4 text-emerald-500" /> Ask AI
                </button>
                <Link href="/admissions" className="flex-1 btn btn-primary btn-sm text-center justify-center">
                  Apply Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
