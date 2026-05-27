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
  ChevronRight,
  Star,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Resume X-Ray",
    description:
      "Upload your PDF resume and get an instant ATS score, line-by-line feedback, keyword gap analysis, and recruiter perspective.",
    color: "#4e9bff",
    href: "/resume",
  },
  {
    icon: Briefcase,
    title: "Smart Job Board",
    description:
      "Browse live listings from 50+ countries powered by Adzuna. Filter by role, location, salary, and employment type.",
    color: "#7877c6",
    href: "/jobs",
  },
  {
    icon: Target,
    title: "Job Match Engine",
    description:
      "Paste any job description, upload your resume, and get a compatibility percentage with specific gap analysis and rewrite suggestions.",
    color: "#ff5bc1",
    href: "/match",
  },
  {
    icon: MessageSquare,
    title: "AI Mock Interviewer",
    description:
      "Practice role-specific behavioral and technical interview questions with instant scored feedback and model answers.",
    color: "#4e9bff",
    href: "/interview",
  },
  {
    icon: Map,
    title: "Career Roadmap",
    description:
      "Generate a personalized 30/60/90-day action plan with specific courses, projects, and milestones to land your dream role.",
    color: "#7877c6",
    href: "/roadmap",
  },
  {
    icon: PenLine,
    title: "Cover Letter Forge",
    description:
      "Generate tailored, professional cover letters in 30 seconds. Choose your tone and align with any job description.",
    color: "#ff5bc1",
    href: "/cover-letter",
  },
];

const stats = [
  { value: "6", label: "AI Tools" },
  { value: "All", label: "Industries" },
  { value: "Live", label: "Job Listings" },
  { value: "Free", label: "To Use" },
];

const steps = [
  {
    step: "01",
    title: "Upload Your Resume",
    description:
      "Drop your PDF resume and let our AI parse and understand your background.",
  },
  {
    step: "02",
    title: "Choose a Tool",
    description:
      "Pick from 6 AI-powered career tools tailored to your goals right now.",
  },
  {
    step: "03",
    title: "Get AI-Powered Results",
    description:
      "Receive streaming, detailed, and actionable insights in seconds.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.0, 0.0, 0.2, 1] as [number, number, number, number],
    },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#08080c] overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#08080c]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4e9bff] via-[#7877c6] to-[#ff5bc1] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm gradient-text hidden sm:block">
              CareerCopilot AI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/jobs"
              className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block"
            >
              Browse Jobs
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium px-4 py-2 rounded-full bg-gradient-to-r from-[#4e9bff] via-[#7877c6] to-[#ff5bc1] text-white hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-r from-[#4e9bff]/10 via-[#7877c6]/10 to-[#ff5bc1]/10 blur-3xl rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/60 mb-8"
          >
            <Star className="w-3 h-3 text-[#7877c6]" />
            Powered by Groq &amp; Llama 3.3
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6"
          >
            Your{" "}
            <span className="gradient-text">AI-Powered</span>
            <br />
            Career Intelligence
            <br />
            Platform
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10"
          >
            From resume to offer letter — AI that works for every industry,
            every role.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#4e9bff] via-[#7877c6] to-[#ff5bc1] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/jobs"
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-white/80 font-medium text-sm hover:bg-white/10 hover:text-white transition-all"
            >
              Browse Jobs
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="card-glass rounded-2xl px-4 py-4 text-center"
              >
                <div className="text-2xl font-bold gradient-text mb-0.5">
                  {stat.value}
                </div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to{" "}
              <span className="gradient-text">land your dream job</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Six purpose-built AI tools, each designed for a critical stage of
              your job search journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <Link
                    href={feature.href}
                    className="block card-glass rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 group h-full"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{
                        background: `${feature.color}20`,
                        border: `1px solid ${feature.color}30`,
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: feature.color }}
                      />
                    </div>
                    <h3 className="font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-medium group-hover:gap-2 transition-all"
                      style={{ color: feature.color }}
                    >
                      Open tool
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How it <span className="gradient-text">works</span>
            </h2>
            <p className="text-white/50 text-lg">
              Get AI-powered career results in three simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-[#4e9bff]/30 via-[#7877c6]/30 to-[#ff5bc1]/30" />

            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center relative"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full card-glass border border-white/10 mb-6 relative z-10">
                  <span className="gradient-text text-lg font-bold">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-glass rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4e9bff]/5 via-[#7877c6]/5 to-[#ff5bc1]/5 pointer-events-none" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative">
                Ready to accelerate your career?
              </h2>
              <p className="text-white/50 mb-8 text-lg relative">
                Join thousands of job seekers using AI to get hired faster.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#4e9bff] via-[#7877c6] to-[#ff5bc1] text-white font-semibold text-sm hover:opacity-90 transition-opacity relative group"
              >
                Start for Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/30 text-sm">
            CareerCopilot AI — Powered by Groq &amp; Adzuna Jobs API &nbsp;|&nbsp; &copy; 2026 Mili Patel
          </p>
        </div>
      </footer>
    </div>
  );
}
