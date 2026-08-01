import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <p>© {new Date().getFullYear()} Sri Satya Institute of Engineering & Technology</p>
      <nav>
        <Link href="/contact">Contact</Link>
        <Link href="/admissions">Admissions</Link>
        <Link href="/admin/login">Admin</Link>
      </nav>
    </footer>
  );
}
