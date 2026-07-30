"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search, Bot } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { enquiryService, type FAQItem } from "@/services/enquiryService";

const categories = ["All", "Admission", "Fees", "Courses", "Hostel", "Campus", "General"];

export default function FAQClient() {
  const [aiOpen, setAiOpen]       = useState(false);
  const [faqs, setFaqs]           = useState<FAQItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [expandedId, setExpandedId]   = useState<string | null>(null);

  useEffect(() => {
    enquiryService.getFAQs()
      .then((res) => { setFaqs(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredFaqs = faqs.filter((faq) => {
    const matchSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat    = selectedCat === "All" || faq.category.toLowerCase() === selectedCat.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="FAQs"
          title="Frequently Asked"
          highlight="Questions"
          description="Quick answers to common questions about admissions, fees, courses, hostel, and campus life."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
          actions={
            <button onClick={() => setAiOpen(true)} className="btn btn-primary">
              <Bot className="w-4 h-4" /> Can't find it? Ask AI
            </button>
          }
        />

        <div className="container py-10 max-w-3xl">

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="faq-search"
              type="search"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-11"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                  selectedCat === cat
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="card p-8 text-center">
              <Bot className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm mb-4">No results found. Try our AI for instant answers.</p>
              <button onClick={() => setAiOpen(true)} className="btn btn-primary btn-sm mx-auto">
                Ask AI
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFaqs.map((faq, i) => {
                const isOpen = expandedId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className={`bg-white border rounded-xl overflow-hidden transition-colors ${
                      isOpen ? "border-blue-200 shadow-sm" : "border-slate-200"
                    }`}
                  >
                    <button
                      onClick={() => setExpandedId(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between gap-3 p-4 text-left cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold text-slate-900">{faq.question}</span>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        {isOpen
                          ? <Minus className="w-3.5 h-3.5" />
                          : <Plus className="w-3.5 h-3.5" />
                        }
                      </div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="px-4 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                            {faq.answer}
                            {faq.category && (
                              <span className="badge badge-blue text-[10px] ml-3">{faq.category}</span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* AI Prompt */}
          <div className="card p-5 bg-blue-50 border-blue-100 mt-8 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-900">Still have questions?</div>
              <div className="text-xs text-slate-500">Our AI can answer anything about SSIET instantly.</div>
            </div>
            <button onClick={() => setAiOpen(true)} className="btn btn-primary btn-sm shrink-0">
              Ask AI
            </button>
          </div>

        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
