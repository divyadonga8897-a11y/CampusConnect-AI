"use client";
import Link from "next/link";

interface NavbarProps {
  onAIClick?: () => void;
}

export default function Navbar({ onAIClick }: NavbarProps) {
  return (
    <header>
      <nav>
        <Link href="/">CampusConnect AI</Link>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/courses">Academics</Link></li>
          <li><Link href="/admissions">Admissions</Link></li>
          <li><Link href="/student-life">Campus Life</Link></li>
          <li><Link href="/research">Research</Link></li>
          <li><Link href="/placements">Placement</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/admin/login">Admin</Link></li>
        </ul>
        {onAIClick && <button onClick={onAIClick}>Ask AI</button>}
      </nav>
    </header>
  );
}
