"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Briefcase,
  Search,
  MapPin,
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Target,
  DollarSign,
  Calendar,
  X,
  Building2,
} from "lucide-react";
import type { AdzunaJob } from "@/lib/adzuna";

const COUNTRIES = [
  { code: "us", label: "United States" },
  { code: "gb", label: "United Kingdom" },
  { code: "ca", label: "Canada" },
  { code: "au", label: "Australia" },
  { code: "in", label: "India" },
  { code: "de", label: "Germany" },
  { code: "fr", label: "France" },
];

const FILTERS = ["All", "Full-time", "Part-time", "Remote", "Entry Level", "Senior"];

function getDaysAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 30) return `${diff}d ago`;
  return `${Math.floor(diff / 30)}mo ago`;
}

function formatSalary(min?: number, max?: number): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  if (max) return `Up to ${fmt(max)}`;
  return null;
}

interface MatchModalProps {
  job: AdzunaJob;
  onClose: () => void;
}

function MatchModal({ job, onClose }: MatchModalProps) {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resumeText = localStorage.getItem("resumeText") || "";
    const analyze = async () => {
      try {
        const response = await fetch("/api/match-job", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeText,
            jobDescription: `${job.title} at ${job.company.display_name}\n\n${job.description}`,
          }),
        });

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let result = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
          setOutput(result);
        }
      } catch {
        setOutput("Failed to analyze match. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    analyze();
  }, [job]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="card-glass rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white">{job.title}</h3>
            <p className="text-sm text-white/50">{job.company.display_name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading && !output && (
          <div className="flex items-center justify-center py-12 gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-[#7877c6]" />
            <span className="text-white/50 text-sm">Analyzing match...</span>
          </div>
        )}

        {output && (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{output}</ReactMarkdown>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function JobCardSkeleton() {
  return (
    <div className="card-glass rounded-2xl p-5 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
      <div className="h-3 bg-white/10 rounded w-1/2 mb-4" />
      <div className="h-3 bg-white/10 rounded w-full mb-1.5" />
      <div className="h-3 bg-white/10 rounded w-5/6 mb-4" />
      <div className="flex gap-2">
        <div className="h-7 bg-white/10 rounded-lg flex-1" />
        <div className="h-7 bg-white/10 rounded-lg w-24" />
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [query, setQuery] = useState("software engineer");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("us");
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState<AdzunaJob[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matchJob, setMatchJob] = useState<AdzunaJob | null>(null);
  const [hasResume, setHasResume] = useState(false);

  useEffect(() => {
    setHasResume(!!localStorage.getItem("resumeText"));
  }, []);

  const fetchJobs = useCallback(
    async (p = 1) => {
      setLoading(true);
      setError("");
      try {
        let what = query || "software engineer";
        if (activeFilter === "Remote") what = `${what} remote`;
        if (activeFilter === "Entry Level") what = `${what} entry level`;
        if (activeFilter === "Senior") what = `${what} senior`;

        const params = new URLSearchParams({
          what,
          country,
          page: String(p),
        });
        if (location) params.set("where", location);
        if (activeFilter === "Full-time") params.set("full_time", "1");
        if (activeFilter === "Part-time") params.set("part_time", "1");

        const res = await fetch(`/api/jobs?${params}`);
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data.results || []);
        setTotalCount(data.count || 0);
        setPage(p);
      } catch {
        setError("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [query, location, country, activeFilter]
  );

  useEffect(() => {
    fetchJobs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, country]);

  const totalPages = Math.ceil(Math.min(totalCount, 200) / 20);

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#7877c6]/15 border border-[#7877c6]/25 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-[#7877c6]" />
          </div>
          <h1 className="text-2xl font-bold">Smart Job Board</h1>
        </div>
        <p className="text-white/50 text-sm ml-12">
          Live job listings from Adzuna across 50+ countries.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-glass rounded-2xl p-4 mb-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job title, keywords..."
              className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
              onKeyDown={(e) => e.key === "Enter" && fetchJobs(1)}
            />
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 sm:w-44">
            <MapPin className="w-4 h-4 text-white/30 flex-shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, state..."
              className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
              onKeyDown={(e) => e.key === "Enter" && fetchJobs(1)}
            />
          </div>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white/80 outline-none cursor-pointer"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-[#1a1a2e]">
                {c.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => fetchJobs(1)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#4e9bff] via-[#7877c6] to-[#ff5bc1] text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </motion.div>

      {/* Filter Chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeFilter === f
                ? "bg-[#7877c6] text-white"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            {f}
          </button>
        ))}
        {totalCount > 0 && (
          <span className="ml-auto text-xs text-white/30 self-center">
            {totalCount.toLocaleString()} jobs found
          </span>
        )}
      </motion.div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Job Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job, i) => {
            const salary = formatSalary(job.salary_min, job.salary_max);
            const daysAgo = getDaysAgo(job.created);
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card-glass rounded-2xl p-5 hover:bg-white/5 transition-colors group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm leading-tight mb-1 line-clamp-2">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      <Building2 className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{job.company.display_name}</span>
                    </div>
                  </div>
                  <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-[#7877c6]/15 text-[#7877c6] border border-[#7877c6]/20">
                    {job.category.label}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-3 mb-3 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location.display_name}
                  </span>
                  {salary && (
                    <span className="flex items-center gap-1 text-green-400/80">
                      <DollarSign className="w-3 h-3" />
                      {salary}
                    </span>
                  )}
                  <span className="flex items-center gap-1 ml-auto">
                    <Calendar className="w-3 h-3" />
                    {daysAgo}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-white/40 line-clamp-2 mb-4 leading-relaxed">
                  {job.description.substring(0, 150)}
                  {job.description.length > 150 ? "..." : ""}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    href={job.redirect_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gradient-to-r from-[#4e9bff] via-[#7877c6] to-[#ff5bc1] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    Apply Now
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {hasResume && (
                    <button
                      onClick={() => setMatchJob(job)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-xs font-medium transition-all"
                    >
                      <Target className="w-3 h-3" />
                      Match
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && jobs.length === 0 && !error && (
        <div className="text-center py-20">
          <Briefcase className="w-10 h-10 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No jobs found. Try a different search.</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && jobs.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => fetchJobs(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="text-sm text-white/40">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => fetchJobs(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Match Modal */}
      <AnimatePresence>
        {matchJob && (
          <MatchModal job={matchJob} onClose={() => setMatchJob(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
