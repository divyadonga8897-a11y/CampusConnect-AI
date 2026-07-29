"use client";

import Link from "next/link";
import { AlertCircle, RefreshCw, Home, Sparkles } from "lucide-react";

export default function ErrorClient() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-navy-950 gradient-hero bg-grid px-4">
      <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-red-500/10 blur-3xl animate-pulse" />
      
      <div className="relative w-full max-w-md glass rounded-3xl p-6 sm:p-10 border border-navy-800/40 shadow-2xl relative z-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-450 text-[10px] font-black uppercase tracking-wider mb-6 border border-red-500/15">
          <AlertCircle className="w-3.5 h-3.5" />
          System Exception Error
        </div>

        <h1 className="text-white text-2xl sm:text-3xl font-black tracking-tight mb-3">
          Something Went Wrong
        </h1>
        <p className="text-navy-305 text-xs sm:text-sm mb-8 leading-relaxed">
          The requested resource encountered a connection failure or timeout. Please check your network and retry.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider hover:from-emerald-400 hover:to-emerald-500 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            <span>Retry Connection</span>
          </button>
          
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-navy-900 border border-navy-800 text-white hover:text-emerald-400 hover:border-emerald-500/20 transition-all text-xs font-bold uppercase tracking-wider"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
