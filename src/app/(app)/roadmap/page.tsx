"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import {
  Map,
  Loader2,
  Sparkles,
  Clock,
} from "lucide-react";

type Timeline = "30" | "60" | "90";

export default function RoadmapPage() {
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [timeline, setTimeline] = useState<Timeline>("90");
  const [currentSkills, setCurrentSkills] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!targetRole.trim()) {
      setError("Please enter your target role.");
      return;
    }
    setLoading(true);
    setOutput("");
    setError("");

    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentRole,
          targetRole,
          timeline,
          currentSkills,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate roadmap");
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setOutput(result);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#7877c6]/15 border border-[#7877c6]/25 flex items-center justify-center">
            <Map className="w-5 h-5 text-[#7877c6]" />
          </div>
          <h1 className="text-2xl font-bold">Career Roadmap Builder</h1>
        </div>
        <p className="text-white/50 text-sm ml-12">
          Get a personalized action plan with real resources, projects, and
          milestones to land your target role.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Left Panel — Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 card-glass rounded-2xl p-6 space-y-5"
        >
          <h2 className="font-semibold text-white">Your Goals</h2>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Current Role / Background
            </label>
            <textarea
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="e.g. Marketing coordinator with 2 years experience, recent CS grad, self-taught developer..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/80 placeholder-white/25 outline-none resize-none focus:border-[#7877c6]/40 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Target Role <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Product Manager, Full Stack Engineer, Data Scientist..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#7877c6]/40 transition-colors"
            />
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Timeline
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["30", "60", "90"] as Timeline[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeline(t)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    timeline === t
                      ? "bg-gradient-to-r from-[#4e9bff] via-[#7877c6] to-[#ff5bc1] text-white"
                      : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {t} days
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Skills You Already Have{" "}
              <span className="text-white/25 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              placeholder="Python, React, SQL, communication..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder-white/25 outline-none focus:border-[#7877c6]/40 transition-colors"
            />
            <p className="text-xs text-white/25">Comma-separated</p>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={handleGenerate}
            disabled={!targetRole.trim() || loading}
            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-[#4e9bff] via-[#7877c6] to-[#ff5bc1] text-white hover:opacity-90 transition-opacity"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Roadmap...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Roadmap
              </>
            )}
          </button>

          <div className="pt-2 border-t border-white/5 space-y-2">
            <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
              Your roadmap will include
            </p>
            {[
              "Week-by-week action items",
              "Specific courses & resources",
              "Projects to build",
              "Skills to develop",
              "LinkedIn optimization tips",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-xs text-white/50"
              >
                <Clock className="w-3 h-3 text-[#7877c6]" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Panel — Output */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-3 card-glass rounded-2xl p-6 min-h-[500px]"
        >
          <h2 className="font-semibold text-white mb-4">Your Roadmap</h2>

          {!output && !loading && (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <div className="w-20 h-20 rounded-full bg-[#7877c6]/10 flex items-center justify-center mb-4">
                <Map className="w-8 h-8 text-[#7877c6]/40" />
              </div>
              <p className="text-white/30 text-sm max-w-xs">
                Fill in your goals and generate a personalized career roadmap
                with week-by-week actions.
              </p>
            </div>
          )}

          {loading && !output && (
            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-[#7877c6]/20 border-t-[#7877c6] animate-spin" />
                <Map className="w-5 h-5 text-[#7877c6] absolute inset-0 m-auto" />
              </div>
              <p className="text-white/50 text-sm">
                Building your {timeline}-day roadmap...
              </p>
            </div>
          )}

          {output && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-sm max-w-none"
            >
              <ReactMarkdown>{output}</ReactMarkdown>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
