"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSearch,
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  X,
  Sparkles,
} from "lucide-react";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
      setError("");
      setOutput("");
    } else {
      setError("Please upload a PDF file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setOutput("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Analysis failed");
      }

      // Extract resume text from response header for Job Match feature
      const resumeTextHeader = response.headers.get("X-Resume-Text");
      if (resumeTextHeader) {
        try {
          const decoded = atob(resumeTextHeader);
          localStorage.setItem("resumeText", decoded);
        } catch {
          // ignore decode errors
        }
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
          <div className="w-9 h-9 rounded-xl bg-[#4e9bff]/15 border border-[#4e9bff]/25 flex items-center justify-center">
            <FileSearch className="w-5 h-5 text-[#4e9bff]" />
          </div>
          <h1 className="text-2xl font-bold">Resume X-Ray</h1>
        </div>
        <p className="text-white/50 text-sm ml-12">
          Get a comprehensive ATS analysis, keyword gaps, and recruiter-grade
          feedback on your resume.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Panel — Upload */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card-glass rounded-2xl p-6 space-y-5"
        >
          <h2 className="font-semibold text-white">Upload Resume</h2>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? "border-[#4e9bff] bg-[#4e9bff]/5"
                : file
                ? "border-[#4e9bff]/40 bg-[#4e9bff]/5"
                : "border-white/10 hover:border-white/20 hover:bg-white/3"
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
                  <CheckCircle className="w-8 h-8 text-[#4e9bff]" />
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-white/40">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-white/30 mb-1" />
                  <p className="text-sm font-medium text-white/70">
                    {isDragActive
                      ? "Drop your PDF here"
                      : "Drag & drop your resume PDF"}
                  </p>
                  <p className="text-xs text-white/30">
                    or click to browse files
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">
              <X className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {file && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1 bg-white/5 rounded-lg px-3 py-2">
                <FileText className="w-4 h-4 text-[#4e9bff]" />
                <span className="text-sm text-white/70 truncate">
                  {file.name}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setOutput("");
                }}
                className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-[#4e9bff] via-[#7877c6] to-[#ff5bc1] text-white hover:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze Resume
              </>
            )}
          </button>

          {/* Instructions */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
              What you'll get
            </p>
            {[
              "Overall ATS Score (0–100)",
              "Top strengths with examples",
              "5 specific improvement areas",
              "Keyword gap analysis",
              "Recruiter perspective",
              "3 quick wins under 10 min",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-white/50">
                <div className="w-1 h-1 rounded-full bg-[#7877c6]" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Panel — Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="card-glass rounded-2xl p-6 min-h-[400px]"
        >
          <h2 className="font-semibold text-white mb-4">Analysis Results</h2>

          {!output && !loading && (
            <div className="flex flex-col items-center justify-center h-[320px] text-center">
              <div className="w-16 h-16 rounded-full bg-[#4e9bff]/10 flex items-center justify-center mb-4">
                <FileSearch className="w-7 h-7 text-[#4e9bff]/50" />
              </div>
              <p className="text-white/30 text-sm max-w-xs">
                Upload your resume PDF and click "Analyze Resume" to see
                detailed AI feedback here.
              </p>
            </div>
          )}

          {loading && !output && (
            <div className="flex flex-col items-center justify-center h-[320px] gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-[#7877c6]/20 border-t-[#7877c6] animate-spin" />
                <Sparkles className="w-5 h-5 text-[#7877c6] absolute inset-0 m-auto" />
              </div>
              <p className="text-white/50 text-sm">Analyzing your resume...</p>
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
