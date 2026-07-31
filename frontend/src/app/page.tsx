"use client";

import { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import AboutSection from "@/components/sections/AboutSection";
import CourseSection from "@/components/sections/CourseSection";
import CampusPreview from "@/components/sections/CampusPreview";
import PlacementSection from "@/components/sections/PlacementSection";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import AIAssistantSection from "@/components/sections/AIAssistantSection";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

export default function Home() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [initialQuestion, setInitialQuestion] = useState<string | undefined>(undefined);

  const handleOpenAI = (question?: string) => {
    setInitialQuestion(question);
    setAiModalOpen(true);
  };

  const handleCloseAI = () => {
    setAiModalOpen(false);
    setInitialQuestion(undefined);
  };

  return (
    <>
      <Navbar onAIClick={() => handleOpenAI()} />
      <main>
        <HeroSection onAIClick={() => handleOpenAI()} />
        <CourseSection />
        <CampusPreview />
        <AboutSection />
        <PlacementSection />
        <WhyChooseUs />
        <AIAssistantSection onAIClick={(q) => handleOpenAI(q)} />
      </main>
      <Footer />
      <AIModal isOpen={aiModalOpen} onClose={handleCloseAI} initialQuestion={initialQuestion} />
      <WhatsAppFloat onAIClick={() => handleOpenAI()} />
    </>
  );
}
