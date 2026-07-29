"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertTriangle, Sparkles, Loader } from "lucide-react";
import { adminService } from "@/services/adminService";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFields = z.infer<typeof loginSchema>;

export default function AdminLoginClient() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (data: LoginFields) => {
    setErrorMessage("");
    setSubmitting(true);
    
    const res = await adminService.login(data.email, data.password);
    setSubmitting(false);

    if (res.success) {
      router.push("/admin/dashboard");
    } else {
      setErrorMessage(res.error || "Invalid credentials. Access denied.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-navy-950 gradient-hero bg-grid px-4">
      <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
      
      <div className="relative w-full max-w-md glass rounded-3xl p-6 sm:p-10 border border-navy-800/40 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-450 text-[10px] font-black uppercase tracking-wider mb-4 border border-emerald-500/15">
            <Sparkles className="w-3.5 h-3.5" />
            SSIET Admin CMS Portal
          </div>
          <h1 className="text-white text-2xl sm:text-3xl font-black tracking-tight leading-none mb-2">
            Gateway Login
          </h1>
          <p className="text-navy-305 text-xs sm:text-sm">
            Enter administrative credentials to access directories and CMS dashboard options.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex items-start gap-2.5 text-red-400 text-xs">
              <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email input */}
          <div>
            <label htmlFor="login-email" className="text-[10px] font-black uppercase tracking-widest text-navy-450 block mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-450" />
              <input
                id="login-email"
                type="email"
                placeholder="admin@ssiet.ac.in"
                {...register("email")}
                className={`w-full pl-11 pr-4 py-3 rounded-xl glass-light border text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/50 bg-navy-900/60 ${
                  errors.email ? "border-red-500/40" : "border-navy-800"
                }`}
              />
            </div>
            {errors.email && <span className="text-red-450 text-[10px] mt-1.5 block font-bold">{errors.email.message}</span>}
          </div>

          {/* Password input */}
          <div>
            <label htmlFor="login-password" className="text-[10px] font-black uppercase tracking-widest text-navy-450 block mb-2">
              Security Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-450" />
              <input
                id="login-password"
                type="password"
                placeholder="••••••••••••"
                {...register("password")}
                className={`w-full pl-11 pr-4 py-3 rounded-xl glass-light border text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/50 bg-navy-900/60 ${
                  errors.password ? "border-red-500/40" : "border-navy-800"
                }`}
              />
            </div>
            {errors.password && <span className="text-red-450 text-[10px] mt-1.5 block font-bold">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider hover:from-emerald-400 hover:to-emerald-500 transition-all duration-200 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>Access CMS Panel</span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
