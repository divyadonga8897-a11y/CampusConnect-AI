"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, User, BookOpen, Send,
  CheckCircle2, AlertTriangle, Bot, MessageSquare
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { enquiryService } from "@/services/enquiryService";
import { COLLEGE_INFO } from "@/constants/collegeData";

const courses = [
  { value: "b-tech-cse",  label: "B.Tech Computer Science Engineering (CSE)"         },
  { value: "b-tech-aids", label: "B.Tech Artificial Intelligence & Data Science"      },
  { value: "b-tech-ece",  label: "B.Tech Electronics & Communication (ECE)"          },
  { value: "b-tech-mech", label: "B.Tech Mechanical Engineering"                     },
  { value: "b-tech-civil",label: "B.Tech Civil Engineering"                          },
];

export default function EnquiryClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    course_interest: "b-tech-cse", message: "",
  });
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.length < 2)
      e.name = "Full name must be at least 2 characters.";
    const emailRe = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!formData.email.trim() || !emailRe.test(formData.email))
      e.email = "Please provide a valid email address.";
    const phoneRe = /^\+?[0-9]{10,15}$/;
    if (!formData.phone.trim() || !phoneRe.test(formData.phone))
      e.phone = "Provide a valid phone number (10–15 digits).";
    if (!formData.message.trim() || formData.message.length < 10)
      e.message = "Message must be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setGeneralError("");
    if (!validate()) return;
    setSubmitting(true);
    const res = await enquiryService.submitEnquiry({ ...formData });
    setSubmitting(false);
    if (res.success) {
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", course_interest: "b-tech-cse", message: "" });
    } else {
      setGeneralError(res.error || "Submission failed. Please try again.");
    }
  };

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = ev.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Student Enquiry"
          title="Get in Touch"
          highlight="with Admissions"
          description="Questions about eligibility, fees, seats, or courses? Submit your enquiry and we'll get back within 24 hours."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Enquiry" }]}
        />

        <div className="container py-12">
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

            {/* ── Form ── */}
            <div className="lg:col-span-2">
              <div className="card p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-10 space-y-4"
                    >
                      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Enquiry Submitted!</h3>
                      <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                        Thank you! Our admissions counsellor will contact you within 24 working hours.
                      </p>
                      <button
                        onClick={() => setSuccess(false)}
                        className="btn btn-secondary mx-auto"
                      >
                        Submit Another Enquiry
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {/* Error Banner */}
                      {generalError && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-red-600 text-xs">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          {generalError}
                        </div>
                      )}

                      {/* Name */}
                      <div>
                        <label htmlFor="eq-name" className="text-label text-slate-700 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            id="eq-name"
                            name="name"
                            type="text"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`input pl-10 ${errors.name ? "border-red-300 focus:ring-red-200" : ""}`}
                          />
                        </div>
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                      </div>

                      {/* Email + Phone row */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="eq-email" className="text-label text-slate-700 mb-1.5">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              id="eq-email"
                              name="email"
                              type="email"
                              placeholder="you@example.com"
                              value={formData.email}
                              onChange={handleChange}
                              className={`input pl-10 ${errors.email ? "border-red-300" : ""}`}
                            />
                          </div>
                          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>
                        <div>
                          <label htmlFor="eq-phone" className="text-label text-slate-700 mb-1.5">
                            Phone <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              id="eq-phone"
                              name="phone"
                              type="tel"
                              placeholder="+91 9999999999"
                              value={formData.phone}
                              onChange={handleChange}
                              className={`input pl-10 ${errors.phone ? "border-red-300" : ""}`}
                            />
                          </div>
                          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                        </div>
                      </div>

                      {/* Course Interest */}
                      <div>
                        <label htmlFor="eq-course" className="text-label text-slate-700 mb-1.5">
                          Course of Interest <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select
                            id="eq-course"
                            name="course_interest"
                            value={formData.course_interest}
                            onChange={handleChange}
                            className="input select pl-10"
                          >
                            {courses.map((c) => (
                              <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="eq-message" className="text-label text-slate-700 mb-1.5">
                          Your Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="eq-message"
                          name="message"
                          rows={4}
                          placeholder="Tell us what you'd like to know about SSIET..."
                          value={formData.message}
                          onChange={handleChange}
                          className={`input resize-none ${errors.message ? "border-red-300" : ""}`}
                        />
                        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                      </div>

                      <button
                        type="submit"
                        id="enquiry-submit-btn"
                        disabled={submitting}
                        className="btn btn-primary w-full justify-center"
                      >
                        {submitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <><Send className="w-4 h-4" /> Submit Enquiry</>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-5">
              {/* Quick Contact */}
              <div className="card p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Contact</h3>
                <div className="space-y-3">
                  <a href={`tel:${COLLEGE_INFO.phone}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                    <Phone className="w-4 h-4 text-blue-500 shrink-0" /> {COLLEGE_INFO.phone}
                  </a>
                  <a href={`mailto:${COLLEGE_INFO.email}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                    <Mail className="w-4 h-4 text-blue-500 shrink-0" /> {COLLEGE_INFO.email}
                  </a>
                </div>
              </div>

              {/* Ask AI */}
              <div className="card p-5 bg-slate-900 border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold text-white">Campus AI</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  Get instant answers about admissions, fees, and courses 24/7.
                </p>
                <button onClick={() => setAiOpen(true)} className="btn btn-sm bg-emerald-500 text-white hover:bg-emerald-400 w-full justify-center">
                  Ask AI Now
                </button>
              </div>

              {/* Links */}
              <div className="card p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Useful Links</h3>
                <div className="space-y-2">
                  {[
                    { label: "Admission Process", href: "/admissions" },
                    { label: "Fee Structure",     href: "/fees"       },
                    { label: "Scholarships",      href: "/scholarships"},
                    { label: "FAQ",               href: "/faq"        },
                  ].map((l) => (
                    <Link key={l.href} href={l.href}
                      className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
