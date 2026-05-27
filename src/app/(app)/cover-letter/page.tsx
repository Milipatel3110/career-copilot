"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenLine,
  Upload,
  CheckCircle,
  FileText,
  Loader2,
  Sparkles,
  Copy,
  Check,
  X,
} from "lucide-react";

type Tone = "Professional" | "Enthusiastic" | "Concise";

export default function CoverLetterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
      setError("");
    } else {
      setError("Please upload a PDF file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const handleGenerate = async () => {
    if (!jobTitle.trim() || !company.trim()) {
      setError("Please enter the job title and company name.");
      return;
    }
    setLoading(true);
    setOutput("");
    setError("");

    try {
      const formData = new FormData();
      if (file) formData.append("resume", file);
      formData.append("jobTitle", jobTitle);
      formData.append("company", company);
      formData.append("jobDescription", jobDescription);
      formData.append("tone", tone);

      const response = await fetch("/api/cover-letter", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Generation failed");
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#ff5bc1]/15 border border-[#ff5bc1]/25 flex items-center justify-center">
            <PenLine className="w-5 h-5 text-[#ff5bc1]" />
          </div>
          <h1 className="text-2xl font-bold">Cover Letter Forge</h1>
        </div>
        <p className="text-white/50 text-sm ml-12">
          Generate tailored, professional cover letters in 30 seconds. Choose
          your tone and match any job.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Resume Upload */}
          <div className="card-glass rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold text-white text-sm">
              Resume{" "}
              <span className="text-white/30 font-normal">(PDF optional)</span>
            </h2>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragActive
                  ? "border-[#ff5bc1] bg-[#ff5bc1]/5"
                  : file
                  ? "border-[#ff5bc1]/40 bg-[#ff5bc1]/5"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <input {...getInputProps()} />
              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div
                    key="file"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <CheckCircle className="w-6 h-6 text-[#ff5bc1]" />
                    <p className="text-xs font-medium text-white">{file.name}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <Upload className="w-6 h-6 text-white/30" />
                    <p className="text-xs text-white/50">
                      Upload resume PDF to personalize the letter
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {file && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1 bg-white/5 rounded-lg px-3 py-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#ff5bc1]" />
                  <span className="text-xs text-white/70 truncate">
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Job Details */}
          <div className="card-glass rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold text-white text-sm">Job Details</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-white/40">
                  Job Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Product Manager"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-[#ff5bc1]/40 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/40">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-[#ff5bc1]/40 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-white/40">
                Job Description{" "}
                <span className="text-white/25">(recommended)</span>
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description to create a highly tailored cover letter..."
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white/80 placeholder-white/25 outline-none resize-none focus:border-[#ff5bc1]/40 transition-colors"
              />
            </div>
          </div>

          {/* Tone Selector */}
          <div className="card-glass rounded-2xl p-5 space-y-3">
            <h2 className="font-semibold text-white text-sm">Tone</h2>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  {
                    value: "Professional",
                    desc: "Formal & polished",
                    color: "#4e9bff",
                  },
                  {
                    value: "Enthusiastic",
                    desc: "Energetic & warm",
                    color: "#ff5bc1",
                  },
                  { value: "Concise", desc: "Brief & punchy", color: "#7877c6" },
                ] as { value: Tone; desc: string; color: string }[]
              ).map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tone === t.value
                      ? "border-transparent"
                      : "border-white/10 hover:border-white/20 bg-white/5"
                  }`}
                  style={
                    tone === t.value
                      ? {
                          background: `${t.color}15`,
                          borderColor: `${t.color}30`,
                        }
                      : {}
                  }
                >
                  <p
                    className="text-xs font-semibold mb-0.5"
                    style={{ color: tone === t.value ? t.color : "#ffffff99" }}
                  >
                    {t.value}
                  </p>
                  <p className="text-xs text-white/30">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-xl px-3 py-2">
              <X className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!jobTitle.trim() || !company.trim() || loading}
            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-[#4e9bff] via-[#7877c6] to-[#ff5bc1] text-white hover:opacity-90 transition-opacity"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Letter...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Cover Letter
              </>
            )}
          </button>
        </motion.div>

        {/* Right Panel — Output */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="card-glass rounded-2xl p-6 min-h-[500px]"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Cover Letter</h2>
            {output && (
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  copied
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>

          {!output && !loading && (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <div className="w-20 h-20 rounded-full bg-[#ff5bc1]/10 flex items-center justify-center mb-4">
                <PenLine className="w-8 h-8 text-[#ff5bc1]/40" />
              </div>
              <p className="text-white/30 text-sm max-w-xs">
                Enter the job details and click "Generate Cover Letter" to
                create a tailored, professional letter.
              </p>
            </div>
          )}

          {loading && !output && (
            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-[#ff5bc1]/20 border-t-[#ff5bc1] animate-spin" />
                <PenLine className="w-5 h-5 text-[#ff5bc1] absolute inset-0 m-auto" />
              </div>
              <p className="text-white/50 text-sm">Crafting your letter...</p>
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
