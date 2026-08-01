"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function WhatsAppFloat() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide on admin routes
  if (!mounted || pathname?.startsWith("/admin")) {
    return null;
  }

  // Connected Wasender number (configurable via env, default placeholder)
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919000000000";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20CampusConnect%20AI,%20I%20have%20a%20question%20about%20the%20college.`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end font-sans">
      {/* Liquid Glass Tooltip */}
      <div
        className={`mr-3 px-4 py-2 rounded-2xl bg-white/70 backdrop-blur-md border border-white/20 text-slate-800 text-xs font-bold shadow-lg shadow-slate-900/5 transition-all duration-300 transform origin-right ${
          showTooltip ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-4 scale-95 pointer-events-none"
        }`}
      >
        Chat with CampusConnect AI
        {/* Tooltip triangle */}
        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-white/70"></div>
      </div>

      {/* Glow Rings / Pulse effect */}
      <div className="relative group">
        {/* Glow Ring 1 */}
        <div className="absolute -inset-1.5 rounded-full bg-emerald-500/30 blur-md opacity-75 group-hover:opacity-100 group-hover:scale-110 animate-ping duration-1000 pointer-events-none"></div>
        {/* Glow Ring 2 */}
        <div className="absolute -inset-0.5 rounded-full bg-emerald-500/20 blur-sm group-hover:bg-emerald-500/30 transition-all duration-300 pointer-events-none"></div>

        {/* Floating WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 hover:from-emerald-600 hover:to-green-500 text-white shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-emerald-400/20"
        >
          {/* WhatsApp SVG Icon */}
          <svg
            className="w-7 h-7"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
