"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Loader2,
  Sparkles,
  ChevronRight,
  RotateCcw,
  CheckCircle,
} from "lucide-react";

interface InterviewSetup {
  role: string;
  company: string;
  type: "Behavioral" | "Technical" | "Mixed";
  difficulty: "Entry" | "Mid" | "Senior";
}

interface Question {
  question: string;
  index: number;
}

type InterviewPhase = "setup" | "interview" | "complete";

export default function InterviewPage() {
  const [phase, setPhase] = useState<InterviewPhase>("setup");
  const [setup, setSetup] = useState<InterviewSetup>({
    role: "",
    company: "",
    type: "Mixed",
    difficulty: "Mid",
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string[]>([]);
  const [streamingFeedback, setStreamingFeedback] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [error, setError] = useState("");

  const startInterview = async () => {
    if (!setup.role.trim()) {
      setError("Please enter a target role.");
      return;
    }
    setLoadingQuestions(true);
    setError("");

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...setup, action: "generate" }),
      });

      if (!res.ok) throw new Error("Failed to generate questions");
      const data = await res.json();
      const qs: Question[] = data.questions.map(
        (q: string, i: number) => ({ question: q, index: i })
      );
      setQuestions(qs);
      setCurrentIndex(0);
      setFeedback([]);
      setPhase("interview");
    } catch {
      setError("Failed to generate interview questions. Please try again.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoadingFeedback(true);
    setStreamingFeedback("");

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...setup,
          action: "feedback",
          question: questions[currentIndex].question,
          answer,
        }),
      });

      if (!response.ok) throw new Error("Failed to get feedback");

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setStreamingFeedback(result);
      }

      setFeedback((prev) => [...prev, result]);
    } catch {
      setStreamingFeedback("Failed to get feedback. Please try again.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setPhase("complete");
    } else {
      setCurrentIndex((i) => i + 1);
      setAnswer("");
      setStreamingFeedback("");
    }
  };

  const reset = () => {
    setPhase("setup");
    setSetup({ role: "", company: "", type: "Mixed", difficulty: "Mid" });
    setQuestions([]);
    setCurrentIndex(0);
    setAnswer("");
    setFeedback([]);
    setStreamingFeedback("");
    setError("");
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#4e9bff]/15 border border-[#4e9bff]/25 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#4e9bff]" />
          </div>
          <h1 className="text-2xl font-bold">AI Mock Interviewer</h1>
        </div>
        <p className="text-white/50 text-sm ml-12">
          Practice with role-specific questions and get instant scored feedback.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Setup Phase */}
        {phase === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card-glass rounded-2xl p-6 max-w-lg mx-auto space-y-5"
          >
            <h2 className="font-semibold text-white">Configure Interview</h2>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                Target Role <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={setup.role}
                onChange={(e) =>
                  setSetup((s) => ({ ...s, role: e.target.value }))
                }
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#4e9bff]/40 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                Company Name{" "}
                <span className="text-white/25 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={setup.company}
                onChange={(e) =>
                  setSetup((s) => ({ ...s, company: e.target.value }))
                }
                placeholder="e.g. Google, Stripe, startup..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#4e9bff]/40 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                  Interview Type
                </label>
                <select
                  value={setup.type}
                  onChange={(e) =>
                    setSetup((s) => ({
                      ...s,
                      type: e.target.value as InterviewSetup["type"],
                    }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none cursor-pointer"
                >
                  <option value="Behavioral" className="bg-[#1a1a2e]">
                    Behavioral
                  </option>
                  <option value="Technical" className="bg-[#1a1a2e]">
                    Technical
                  </option>
                  <option value="Mixed" className="bg-[#1a1a2e]">
                    Mixed
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                  Difficulty
                </label>
                <select
                  value={setup.difficulty}
                  onChange={(e) =>
                    setSetup((s) => ({
                      ...s,
                      difficulty: e.target.value as InterviewSetup["difficulty"],
                    }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none cursor-pointer"
                >
                  <option value="Entry" className="bg-[#1a1a2e]">
                    Entry Level
                  </option>
                  <option value="Mid" className="bg-[#1a1a2e]">
                    Mid Level
                  </option>
                  <option value="Senior" className="bg-[#1a1a2e]">
                    Senior Level
                  </option>
                </select>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={startInterview}
              disabled={!setup.role.trim() || loadingQuestions}
              className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-[#4e9bff] via-[#7877c6] to-[#ff5bc1] text-white hover:opacity-90 transition-opacity"
            >
              {loadingQuestions ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Start Interview
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Interview Phase */}
        {phase === "interview" && questions.length > 0 && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-5"
          >
            {/* Progress */}
            <div className="flex items-center justify-between card-glass rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">
                  {setup.role}
                  {setup.company ? ` @ ${setup.company}` : ""}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-xs text-white/40">
                  {setup.type} · {setup.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i < currentIndex
                        ? "bg-green-400"
                        : i === currentIndex
                        ? "bg-[#4e9bff]"
                        : "bg-white/15"
                    }`}
                  />
                ))}
                <span className="text-xs text-white/40 ml-1">
                  {currentIndex + 1}/{questions.length}
                </span>
              </div>
            </div>

            {/* Question */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#4e9bff]/15 text-[#4e9bff] border border-[#4e9bff]/20">
                  Question {currentIndex + 1}
                </span>
              </div>
              <p className="text-white text-lg font-medium leading-relaxed">
                {questions[currentIndex].question}
              </p>
            </motion.div>

            {/* Answer */}
            {!streamingFeedback && !loadingFeedback && (
              <div className="card-glass rounded-2xl p-5 space-y-4">
                <label className="text-sm font-medium text-white/70">
                  Your Answer
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here. For behavioral questions, use the STAR method: Situation, Task, Action, Result..."
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white/80 placeholder-white/25 outline-none resize-none focus:border-[#4e9bff]/40 transition-colors"
                />
                <button
                  onClick={submitAnswer}
                  disabled={!answer.trim() || loadingFeedback}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#4e9bff] via-[#7877c6] to-[#ff5bc1] text-white hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  <Sparkles className="w-4 h-4" />
                  Submit Answer
                </button>
              </div>
            )}

            {/* Loading feedback */}
            {loadingFeedback && !streamingFeedback && (
              <div className="card-glass rounded-2xl p-8 flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-[#4e9bff]" />
                <span className="text-white/50 text-sm">
                  Evaluating your answer...
                </span>
              </div>
            )}

            {/* Streaming Feedback */}
            {(streamingFeedback || loadingFeedback) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-glass rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-[#7877c6]" />
                  <h3 className="font-semibold text-white text-sm">
                    AI Feedback
                  </h3>
                </div>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{streamingFeedback}</ReactMarkdown>
                </div>
                {!loadingFeedback && streamingFeedback && (
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <button
                      onClick={nextQuestion}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#4e9bff] via-[#7877c6] to-[#ff5bc1] text-white hover:opacity-90 transition-opacity"
                    >
                      {currentIndex + 1 >= questions.length
                        ? "Complete Interview"
                        : "Next Question"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Complete Phase */}
        {phase === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="card-glass rounded-2xl p-10 max-w-lg mx-auto text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-400/15 border border-green-400/25 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Interview Complete!
            </h2>
            <p className="text-white/50 text-sm mb-2">
              You answered all {questions.length} questions for
            </p>
            <p className="text-white font-semibold mb-8">
              {setup.role}
              {setup.company ? ` at ${setup.company}` : ""}
            </p>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#4e9bff] via-[#7877c6] to-[#ff5bc1] text-white hover:opacity-90 transition-opacity mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              Start New Interview
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
