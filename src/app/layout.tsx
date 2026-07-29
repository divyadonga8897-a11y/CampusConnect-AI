import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CampusConnect AI | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore Sri Satya Institute of Engineering and Technology courses, fees, campus facilities, placements and admission information. AI-powered college discovery platform.",
  keywords: [
    "SSIET",
    "Sri Satya Institute",
    "Engineering College Andhra Pradesh",
    "B.Tech CSE",
    "AI Data Science",
    "Engineering Admission",
    "CampusConnect AI",
  ],
  openGraph: {
    title: "CampusConnect AI | SSIET",
    description:
      "Explore Sri Satya Institute of Engineering and Technology — courses, fees, campus, and placements.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-navy-950 text-foreground">
        {children}
      </body>
    </html>
  );
}
