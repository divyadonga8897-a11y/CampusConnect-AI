"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search, HelpCircle, Sparkles, Filter } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { enquiryService, type FAQItem } from "@/services/enquiryService";

const categories = ["All", "Admission", "Fees", "Courses", "Hostel", "Campus", "General"];

export default function FAQClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    enquiryService.getFAQs()
      .then((res) => {
        setFaqs(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading FAQs:", err);
        setLoading(false);
      });
  }, []);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === "All" || faq.category.toLowerCase() === selectedCat.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen gradient-hero bg-grid">
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <SectionTitle
            badge="Common Enquiries"
            title="Frequently Asked"
            highlight="Questions"
            description="Explore general questions regarding intermediate percentage cut-offs, quota seats allocations, boarding guidelines, and campus codes."
            className="mb-10"
          />

          {/* Controls: Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-450" />
            <input
              id="faq-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl glass-light border border-navy-700 text-white placeholder-navy-450 focus:outline-none focus:border-emerald-500/50 bg-navy-900/60 text-xs sm:text-sm"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                  selectedCat === cat
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-500/20 shadow-md shadow-emerald-500/10"
                    : "glass border-navy-750 text-navy-300 hover:text-white hover:border-navy-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQs Accordion */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="glass rounded-xl h-16 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, i) => {
                const isOpen = expandedId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="glass rounded-2xl border border-navy-700/35 overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left focus:outline-none"
                    >
                      <h3 className="text-white font-bold text-xs sm:text-sm leading-snug">
                        {faq.question}
                      </h3>
                      <div className="w-8 h-8 rounded-lg bg-navy-900/50 border border-navy-800/40 flex items-center justify-center shrink-0 text-navy-200">
                        {isOpen ? <Minus className="w-4 h-4 text-emerald-450" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 text-navy-300 text-xs sm:text-sm leading-relaxed border-t border-navy-800/30">
                            {faq.answer}
                            <div className="mt-3.5 flex items-center gap-1.5 text-navy-450 text-[10px] uppercase font-bold tracking-wider">
                              <span>Category: {faq.category}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {filteredFaqs.length === 0 && (
                <div className="glass rounded-2xl p-8 border border-navy-700/30 text-center">
                  <span className="text-navy-400 text-sm">No FAQs found matching your query.</span>
                </div>
              )}
            </div>
          )}

          {/* AI Advisor Callout */}
          <div className="mt-12 glass rounded-2xl p-6 border border-emerald-500/20 bg-gradient-to-r from-navy-950 to-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-450 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="text-white font-bold text-sm">Need Customized Advice?</h4>
                <p className="text-navy-300 text-xs leading-relaxed max-w-xl">
                  Can't find answers for your specific rank or fee bracket? Our AI Campus counselor is online 24/7 to resolve admission rules.
                </p>
              </div>
            </div>
            <button
              onClick={() => setAiOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:from-emerald-400 hover:to-emerald-550 transition-all duration-200 shrink-0"
            >
              Ask Campus AI
            </button>
          </div>
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
