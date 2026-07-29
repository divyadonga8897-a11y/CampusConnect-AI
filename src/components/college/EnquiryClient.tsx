"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, User, BookOpen, Send, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { enquiryService } from "@/services/enquiryService";

const courses = [
  { value: "b-tech-cse", label: "B.Tech Computer Science Engineering (CSE)" },
  { value: "b-tech-aids", label: "B.Tech Artificial Intelligence & Data Science (AI&DS)" },
  { value: "b-tech-ece", label: "B.Tech Electronics & Communication Engineering (ECE)" },
  { value: "b-tech-mech", label: "B.Tech Mechanical Engineering" },
  { value: "b-tech-civil", label: "B.Tech Civil Engineering" }
];

export default function EnquiryClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course_interest: "b-tech-cse",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.length < 2) {
      tempErrors.name = "Full name must be at least 2 characters.";
    }
    
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      tempErrors.email = "Please provide a valid email address.";
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone)) {
      tempErrors.phone = "Provide a valid phone number (10-15 digits).";
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      tempErrors.message = "Message details must be at least 10 characters.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    if (!validate()) return;

    setSubmitting(true);
    const res = await enquiryService.submitEnquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      course_interest: formData.course_interest,
      message: formData.message
    });
    setSubmitting(false);

    if (res.success) {
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        course_interest: "b-tech-cse",
        message: ""
      });
    } else {
      setGeneralError(res.error || "Submission failed. Please check your credentials.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error dynamically on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <SectionTitle
            badge="Admission Counselling"
            title="Student Enquiry"
            highlight="Guidance Desk"
            description="Have questions about eligibility, seat availability, fees structure or campus approvals? Submit your inquiry here."
            className="mb-10"
          />

          <div className="glass rounded-3xl p-6 sm:p-10 border border-navy-700/30 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-emerald-550/10 blur-xl pointer-events-none" />

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-10 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-white font-extrabold text-lg sm:text-xl">Submission Successful!</h3>
                  <p className="text-navy-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                    Your enquiry has been submitted successfully. Our admission guidance desk representative will reach out to you within 24 working hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 rounded-xl bg-navy-850 hover:bg-navy-800 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-navy-700"
                  >
                    Submit Another Enquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="enquiry-form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {generalError && (
                    <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex items-start gap-2.5 text-red-400 text-xs sm:text-sm">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{generalError}</span>
                    </div>
                  )}

                  {/* Name field */}
                  <div>
                    <label htmlFor="enquiry-name" className="text-[10px] font-black uppercase text-navy-450 tracking-wider block mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-450" />
                      <input
                        id="enquiry-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter candidate / parent name"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl glass-light border text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/50 bg-navy-900 ${
                          errors.name ? "border-red-500/40" : "border-navy-700"
                        }`}
                      />
                    </div>
                    {errors.name && <span className="text-red-400 text-[10px] mt-1 block font-bold">{errors.name}</span>}
                  </div>

                  {/* Email & Phone side-by-side */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <label htmlFor="enquiry-email" className="text-[10px] font-black uppercase text-navy-450 tracking-wider block mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-450" />
                        <input
                          id="enquiry-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="e.g. name@domain.com"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl glass-light border text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/50 bg-navy-900 ${
                            errors.email ? "border-red-500/40" : "border-navy-700"
                          }`}
                        />
                      </div>
                      {errors.email && <span className="text-red-400 text-[10px] mt-1 block font-bold">{errors.email}</span>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="enquiry-phone" className="text-[10px] font-black uppercase text-navy-450 tracking-wider block mb-2">
                        Contact Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-450" />
                        <input
                          id="enquiry-phone"
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="e.g. 9876543210"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl glass-light border text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/50 bg-navy-900 ${
                            errors.phone ? "border-red-500/40" : "border-navy-700"
                          }`}
                        />
                      </div>
                      {errors.phone && <span className="text-red-400 text-[10px] mt-1 block font-bold">{errors.phone}</span>}
                    </div>
                  </div>

                  {/* Course of Interest dropdown */}
                  <div>
                    <label htmlFor="enquiry-course" className="text-[10px] font-black uppercase text-navy-450 tracking-wider block mb-2">
                      Course of Interest
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-450 pointer-events-none" />
                      <select
                        id="enquiry-course"
                        name="course_interest"
                        value={formData.course_interest}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 rounded-xl glass-light border border-navy-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/50 bg-navy-900"
                      >
                        {courses.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message details */}
                  <div>
                    <label htmlFor="enquiry-message" className="text-[10px] font-black uppercase text-navy-450 tracking-wider block mb-2">
                      Your Query / Message
                    </label>
                    <textarea
                      id="enquiry-message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your questions here (e.g. EAPCET rank requirements, fee exemptions eligibility, transport routes, etc.)"
                      className={`w-full px-4 py-3 rounded-xl glass-light border text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/50 bg-navy-900 ${
                        errors.message ? "border-red-500/40" : "border-navy-700"
                      }`}
                    />
                    {errors.message && <span className="text-red-400 text-[10px] mt-1 block font-bold">{errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider hover:from-emerald-400 hover:to-emerald-500 transition-all duration-200 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? "Sending Query..." : "Submit Enquiry Form"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Guidelines box */}
          <div className="mt-12 glass rounded-2xl p-6 border border-navy-700/30 flex items-start gap-4">
            <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Direct Help Desk</h4>
              <p className="text-navy-300 text-xs sm:text-sm leading-relaxed">
                Parents are welcome to seek instant clarifications on seat reservation limits or quota guidelines by calling the Admissions Wing at +91 9000-000-000 during college office hours.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
