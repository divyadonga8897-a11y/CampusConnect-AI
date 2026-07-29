import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Heart,
} from "lucide-react";
import { COLLEGE_INFO, NAV_LINKS } from "@/constants/collegeData";

const quickLinks = NAV_LINKS.slice(0, 6);

const programs = [
  { label: "Computer Science Engineering", href: "/courses/computer-science-engineering" },
  { label: "AI & Data Science", href: "/courses/artificial-intelligence-data-science" },
  { label: "Electronics & Communication", href: "/courses/electronics-communication-engineering" },
  { label: "Mechanical Engineering", href: "/courses/mechanical-engineering" },
  { label: "Civil Engineering", href: "/courses/civil-engineering" },
];

const socialIcons = [
  { Icon: Linkedin, href: COLLEGE_INFO.socialMedia.linkedin, label: "LinkedIn" },
  { Icon: Twitter, href: COLLEGE_INFO.socialMedia.twitter, label: "Twitter" },
  { Icon: Facebook, href: COLLEGE_INFO.socialMedia.facebook, label: "Facebook" },
  { Icon: Instagram, href: COLLEGE_INFO.socialMedia.instagram, label: "Instagram" },
  { Icon: Youtube, href: COLLEGE_INFO.socialMedia.youtube, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative bg-navy-950 border-t border-navy-800/50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-navy-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-base font-bold text-white">SSIET</div>
                <div className="text-xs text-navy-300">CampusConnect AI</div>
              </div>
            </Link>
            <p className="text-navy-300 text-sm leading-relaxed mb-5">
              {COLLEGE_INFO.description.slice(0, 130)}...
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialIcons.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg glass-light flex items-center justify-center text-navy-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-navy-300 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Programs
            </h3>
            <ul className="space-y-2.5">
              {programs.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="text-navy-300 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-navy-300 text-sm">{COLLEGE_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`tel:${COLLEGE_INFO.phone}`}
                  className="text-navy-300 hover:text-white text-sm transition-colors"
                >
                  {COLLEGE_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`mailto:${COLLEGE_INFO.email}`}
                  className="text-navy-300 hover:text-white text-sm transition-colors"
                >
                  {COLLEGE_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-navy-800/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-navy-400 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Sri Satya Institute of Engineering and Technology. All rights reserved.
          </p>
          <p className="text-navy-400 text-xs flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by CampusConnect AI
          </p>
        </div>
      </div>
    </footer>
  );
}
