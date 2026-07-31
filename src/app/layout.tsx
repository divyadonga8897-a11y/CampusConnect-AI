import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SSIET — Sri Satya Institute of Engineering & Technology",
    template: "%s | SSIET CampusConnect",
  },
  description:
    "Sri Satya Institute of Engineering and Technology — an NAAC accredited premier engineering institution in Andhra Pradesh offering B.Tech programs in CSE, AI&DS, ECE, Mechanical and Civil Engineering.",
  keywords: [
    "SSIET",
    "Sri Satya Institute of Engineering and Technology",
    "Engineering College Andhra Pradesh",
    "B.Tech Admissions 2025",
    "CSE College West Godavari",
    "AI Data Science Engineering",
    "CampusConnect AI",
    "NAAC Accredited College AP",
  ],
  openGraph: {
    title: "SSIET — Premier Engineering College, Andhra Pradesh",
    description:
      "Explore B.Tech programs, campus life, placements, and admissions at Sri Satya Institute of Engineering and Technology.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "SSIET — Sri Satya Institute of Engineering & Technology",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <head>
        {/* Inter via Google Fonts CDN — loaded at runtime, not build time */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-700">
        {children}
      </body>
    </html>
  );
}
