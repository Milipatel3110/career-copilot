"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileSearch,
  Briefcase,
  Target,
  MessageSquare,
  Map,
  PenLine,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const tools = [
  {
    icon: FileSearch,
    title: "Resume X-Ray",
    description:
      "Upload your PDF resume and get an ATS score, keyword gap analysis, and actionable improvement suggestions.",
    href: "/resume",
    color: "#4e9bff",
    badge: "Most Popular",
  },
  {
    icon: Briefcase,
    title: "Smart Job Board",
    description:
      "Browse thousands of live job listings from 50+ countries, filtered and powered by AI matching.",
    href: "/jobs",
    color: "#7877c6",
  },
  {
    icon: Target,
    title: "Job Match Engine",
    description:
      "Paste any job description and your resume to get a real-time compatibility score and gap analysis.",
    href: "/match",
    color: "#ff5bc1",
  },
  {
    icon: MessageSquare,
    title: "Mock Interviewer",
    description:
      "Practice behavioral and technical interviews with AI that scores your answers and gives model responses.",
    href: "/interview",
    color: "#4e9bff",
  },
  {
    icon: Map,
    title: "Career Roadmap",
    description:
      "Get a personalized 30/60/90-day action plan with real courses, projects, and milestones.",
    href: "/roadmap",
    color: "#7877c6",
  },
  {
    icon: PenLine,
    title: "Cover Letter Forge",
    description:
      "Generate tailored, professional cover letters in 30 seconds for any role and company.",
    href: "/cover-letter",
    color: "#ff5bc1",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.45,
      ease: [0.0, 0.0, 0.2, 1] as [number, number, number, number],
    },
  }),
};

export default function DashboardPage() {
  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4e9bff] via-[#7877c6] to-[#ff5bc1] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to CareerCopilot AI</h1>
        </div>
        <p className="text-white/50 text-sm ml-[52px]">
          Six AI-powered tools to help you land your next role. Pick one to get
          started.
        </p>
      </motion.div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.href}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <Link
                href={tool.href}
                className="block card-glass rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 group h-full relative overflow-hidden"
              >
                {/* Subtle gradient overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at top left, ${tool.color}08 0%, transparent 60%)`,
                  }}
                />

                {tool.badge && (
                  <span
                    className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: `${tool.color}20`,
                      color: tool.color,
                      border: `1px solid ${tool.color}30`,
                    }}
                  >
                    {tool.badge}
                  </span>
                )}

                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{
                    background: `${tool.color}15`,
                    border: `1px solid ${tool.color}25`,
                  }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: tool.color }}
                  />
                </div>

                <h3 className="font-semibold text-white mb-2">{tool.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed mb-5">
                  {tool.description}
                </p>

                <div
                  className="flex items-center gap-1.5 text-xs font-semibold transition-all group-hover:gap-2.5"
                  style={{ color: tool.color }}
                >
                  Open Tool
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8 card-glass rounded-2xl p-4 flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-[#7877c6]/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-[#7877c6]" />
        </div>
        <p className="text-sm text-white/50">
          <span className="text-white/80 font-medium">Pro tip:</span> Start with{" "}
          <Link href="/resume" className="text-[#4e9bff] hover:underline">
            Resume X-Ray
          </Link>{" "}
          to analyze your resume — then use{" "}
          <Link href="/match" className="text-[#7877c6] hover:underline">
            Job Match
          </Link>{" "}
          to find the best fit roles.
        </p>
      </motion.div>
    </div>
  );
}
