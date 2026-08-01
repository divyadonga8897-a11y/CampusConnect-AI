"use client";

import { useState } from "react";
import AIModal from "@/components/ui/AIModal";
import Link from "next/link";

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
    <main>
      <h1>CampusConnect AI — SSIET</h1>
      <nav>
        <ul>
          <li><Link href="/courses">Academics</Link></li>
          <li><Link href="/admissions">Admissions</Link></li>
          <li><Link href="/student-life">Campus Life</Link></li>
          <li><Link href="/placements">Placements</Link></li>
          <li><Link href="/research">Research</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/admin/login">Admin</Link></li>
        </ul>
      </nav>
      <button onClick={() => handleOpenAI()}>Ask AI</button>
      <AIModal isOpen={aiModalOpen} onClose={handleCloseAI} initialQuestion={initialQuestion} />
    </main>
  );
}
