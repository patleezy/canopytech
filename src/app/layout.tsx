import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Canopy Tech — Build on solid ground",
  description:
    "Structure your project correctly before you write a single line of code. AI-powered architecture review for non-technical builders.",
  keywords: ["software architecture", "tech stack", "project planning", "vibe coding"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-forest-950 text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
