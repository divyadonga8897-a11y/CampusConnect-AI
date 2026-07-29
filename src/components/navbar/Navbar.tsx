"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Menu, X, GraduationCap, ChevronDown, Sparkles, Compass, BookOpen, MapPin, ClipboardList, Briefcase, Users, HelpCircle, Phone, Award } from "lucide-react";

interface NavbarProps {
  onAIClick?: () => void;
}

interface DropdownItem {
  href: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

interface NavCategory {
  label: string;
  items: DropdownItem[];
}

export default function Navbar({ onAIClick }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setIsOpen(false), [pathname]);

  const navCategories: Record<string, DropdownItem[]> = {
    "Discover": [
      { href: "/about", label: "About SSIET", description: "Our heritage, vision, and leadership", icon: Compass },
      { href: "/faq", label: "FAQ", description: "Frequently asked questions about SSIET", icon: HelpCircle },
      { href: "/contact", label: "Contact Us", description: "Get in touch with our administration", icon: Phone },
      { href: "/enquiry", label: "Admission Enquiry", description: "Submit an online admission query", icon: ClipboardList }
    ],
    "Programs": [
      { href: "/departments", label: "Departments", description: "Explore our specialized departments", icon: BookOpen },
      { href: "/courses", label: "Courses", description: "See intake, duration, and structures", icon: Sparkles }
    ],
    "Campus": [
      { href: "/campus", label: "Campus Tour", description: "Explore our 3D mapping and locations", icon: MapPin },
      { href: "/labs", label: "Advanced Labs", description: "See our AI, ML, and computer centers", icon: Sparkles },
      { href: "/infrastructure", label: "Infrastructure", description: "View our classrooms and blocks", icon: Compass },
      { href: "/library", label: "Central Library", description: "Access 50,000+ books and e-journals", icon: BookOpen },
      { href: "/hostel", label: "Hostel Facilities", description: "Student accommodation & dining details", icon: MapPin }
    ],
    "Admissions": [
      { href: "/admissions", label: "Admission Process", description: "Eligibility criteria & guidance", icon: ClipboardList },
      { href: "/fees", label: "Fee Structure", description: "Tuition, hostel, and miscellaneous fees", icon: Compass },
      { href: "/scholarships", label: "Scholarships", description: "Fee waivers and merit-based concessions", icon: Award }
    ],
    "Placements": [
      { href: "/placements", label: "Placement Records", description: "Recruiters and package statistics", icon: Briefcase },
      { href: "/internships", label: "Internships", description: "Explore industry internship drives", icon: Users },
      { href: "/career-training", label: "Career Training", description: "Bootcamps and mock interview preparation", icon: Briefcase },
      { href: "/success-stories", label: "Success Stories", description: "Alumni achievements and placements", icon: Award }
    ],
    "Student Life": [
      { href: "/student-life", label: "Student Life", description: "Vibrant student clubs and campus culture", icon: Users },
      { href: "/events", label: "Campus Events", description: "Annual cultural fests & hackathons", icon: Sparkles },
      { href: "/alumni", label: "Alumni Network", description: "Stay connected with our global alumni", icon: Compass },
      { href: "/achievements", label: "Achievements", description: "Celebrating faculty and student milestones", icon: Award }
    ]
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || isOpen
            ? "glass border-b border-white/10 shadow-lg shadow-black/20"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-navy-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-base font-black text-white leading-tight tracking-wider">SSIET</div>
                <div className="text-[10px] text-navy-300 uppercase tracking-widest font-bold">CampusConnect AI</div>
              </div>
            </Link>

            {/* Center Dropdown Menus */}
            <div className="hidden lg:flex items-center gap-2">
              {Object.entries(navCategories).map(([category, items]) => (
                <div
                  key={category}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(category)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                      activeDropdown === category
                        ? "text-blue-400 bg-white/5"
                        : "text-navy-200 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {category}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === category ? "rotate-180 text-blue-400" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === category && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.25 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-80 mt-2 p-3 glass-premium rounded-2xl border border-white/10 shadow-2xl z-50"
                      >
                        <div className="space-y-1">
                          {items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-600/10 border border-transparent hover:border-blue-500/20 transition-all duration-200 group/item"
                              >
                                <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center group-hover/item:scale-110 transition-transform duration-200 shrink-0">
                                  <Icon className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-white group-hover/item:text-blue-400 transition-colors">
                                    {item.label}
                                  </div>
                                  <div className="text-[10px] text-navy-300 leading-normal mt-0.5">
                                    {item.description}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right: CTA Button & Hamburger */}
            <div className="flex items-center gap-4">
              <button
                id="ask-campus-ai-btn"
                onClick={onAIClick}
                className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-blue-500/35 hover:scale-105 cursor-pointer border border-blue-500/30"
              >
                <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
                Ask Campus AI
              </button>

              <button
                id="mobile-menu-btn"
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2.5 rounded-xl glass-light text-navy-200 hover:text-white transition-all cursor-pointer border border-white/5"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-20 left-0 right-0 z-40 glass border-b border-white/10 lg:hidden overflow-hidden"
          >
            <div className="px-4 py-6 max-h-[calc(100vh-80px)] overflow-y-auto space-y-4">
              {Object.entries(navCategories).map(([category, items]) => (
                <div key={category} className="space-y-1.5">
                  <div className="text-[10px] uppercase tracking-widest font-black text-blue-400 px-3">
                    {category}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-white/5 text-xs text-navy-200 hover:text-white transition-all border border-transparent hover:border-white/5"
                      >
                        <item.icon className="w-3.5 h-3.5 text-navy-400" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={() => { setIsOpen(false); onAIClick?.(); }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold shadow-lg"
                >
                  <Bot className="w-4 h-4 text-emerald-400" />
                  Ask Campus AI
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
