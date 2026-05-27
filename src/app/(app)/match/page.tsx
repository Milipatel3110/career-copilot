"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Upload,
  CheckCircle,
  FileText,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";

export default function MatchPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedResumeText, setSavedResumeText] = useState("");

  useEffect(() => {
    setSavedResumeText(localStorage.getItem("resumeText") || "");
  }, []);

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

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description.");
      return;
    }
    setLoading(true);
    setOutput("");
    setError("");

    try {
      const resumeText = savedResumeText;

      let body: BodyInit;
      let headers: Record<string, string> = {};

      if (file) {
        const formData = new FormData();
        formData.append("resume", file);
        formData.append("jobDescription", jobDescription);
        body = formData;
      } else {
        body = JSON.stringify({ resumeText, jobDescription });
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch("/api/match-job", {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Match analysis failed");
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
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#ff5bc1]/15 border border-[#ff5bc1]/25 flex items-center justify-center">
            <Target className="w-5 h-5 text-[#ff5bc1]" />
          </div>
          <h1 className="text-2xl font-bold">Job Match Engine</h1>
        </div>
        <p className="text-white/50 text-sm ml-12">
          Get a compatibility percentage, skills gap analysis, and tailored
          positioning advice for any job.
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
              Your Resume{" "}
              <span className="text-white/30 font-normal">(PDF optional)</span>
            </h2>

            {savedResumeText && !file ? (
              <div className="flex items-center gap-2 bg-[#4e9bff]/10 border border-[#4e9bff]/20 rounded-xl px-3 py-2.5">
                <CheckCircle className="w-4 h-4 text-[#4e9bff]" />
                <span className="text-xs text-[#4e9bff]">
                  Using resume from X-Ray analysis
                </span>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
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
                      className="flex flex-col items-center gap-2"
                    >
                      <CheckCircle className="w-6 h-6 text-[#ff5bc1]" />
                      <p className="text-sm font-medium text-white">
                        {file.name}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <Upload className="w-6 h-6 text-white/30" />
                      <p className="text-xs text-white/50">
                        Upload resume PDF or use saved analysis
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {file && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1 bg-white/5 rounded-lg px-3 py-2">
                  <FileText className="w-4 h-4 text-[#ff5bc1]" />
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

          {/* Job Description */}
          <div className="card-glass rounded-2xl p-5 space-y-3">
            <h2 className="font-semibold text-white text-sm">
              Job Description{" "}
              <span className="text-red-400 text-xs">*</span>
            </h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here — title, responsibilities, requirements, nice-to-haves..."
              rows={10}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white/80 placeholder-white/25 outline-none resize-none focus:border-[#ff5bc1]/40 transition-colors"
            />
            <p className="text-xs text-white/30">
              {jobDescription.length} characters
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-xl px-3 py-2">
              <X className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleMatch}
            disabled={!jobDescription.trim() || loading}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-[#4e9bff] via-[#7877c6] to-[#ff5bc1] text-white hover:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Match...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze Match
              </>
            )}
          </button>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="card-glass rounded-2xl p-6 min-h-[500px]"
        >
          <h2 className="font-semibold text-white mb-4">Match Analysis</h2>

          {!output && !loading && (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <div className="w-20 h-20 rounded-full bg-[#ff5bc1]/10 flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-[#ff5bc1]/40" />
              </div>
              <p className="text-white/30 text-sm max-w-xs">
                Add your resume and a job description to see your compatibility
                score, skills gaps, and positioning advice.
              </p>
            </div>
          )}

          {loading && !output && (
            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-[#ff5bc1]/20 border-t-[#ff5bc1] animate-spin" />
                <Target className="w-5 h-5 text-[#ff5bc1] absolute inset-0 m-auto" />
              </div>
              <p className="text-white/50 text-sm">Calculating match score...</p>
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
