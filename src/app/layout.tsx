import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "CareerCopilot AI — Your AI Career Intelligence Platform",
  description:
    "AI-powered career guidance: resume analysis, job matching, mock interviews, roadmaps, and live job listings for every industry.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
