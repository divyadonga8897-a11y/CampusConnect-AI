"use client";

import { useState, useEffect } from "react";
import { Search, Bot, HelpCircle } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { enquiryService, type FAQItem } from "@/services/enquiryService";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";

const categories = ["All", "Admission", "Fees", "Courses", "Hostel", "Campus", "General"];

export default function FAQClient() {
  const [aiOpen, setAiOpen]       = useState(false);
  const [faqs, setFaqs]           = useState<FAQItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

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

  const accordionItems = filteredFaqs.map((f) => ({
    id: f.id,
    title: f.question,
    content: f.answer,
  }));

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="FAQs"
          title="Frequently Asked"
          highlight="Questions"
          description={
            <div className="space-y-2">
              <p>
                Have queries regarding eligibility, fees, or campus residence? We have compiled standard answers to assist you with immediate information.
              </p>
              <p>
                Browse through our categories below or start a live workspace chat with our Campus AI Assistant to resolve complex individual inquiries.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
          actions={
            <Button variant="primary" onClick={() => setAiOpen(true)} leftIcon={<Bot className="w-4 h-4 text-emerald-300" />}>
              Ask Campus AI
            </Button>
          }
        />

        <div className="container py-10 max-w-3xl">
          {/* Search */}
          <div className="mb-6">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              placeholder="Search FAQs..."
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                  selectedCat === cat
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-14 rounded-xl animate-pulse" />)}
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="card p-10 text-center max-w-md mx-auto">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-xs font-semibold mb-2">No matching questions found.</p>
              <button onClick={() => { setSearchQuery(""); setSelectedCat("All"); }} className="text-xs text-blue-500 hover:underline">
                Clear Filters
              </button>
            </div>
          ) : (
            <Accordion items={accordionItems} />
          )}
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
