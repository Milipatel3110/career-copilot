"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileSearch,
  Briefcase,
  Target,
  MessageSquare,
  Map,
  PenLine,
  X,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Resume X-Ray", icon: FileSearch, href: "/resume" },
  { label: "Job Board", icon: Briefcase, href: "/jobs" },
  { label: "Job Match", icon: Target, href: "/match" },
  { label: "Mock Interview", icon: MessageSquare, href: "/interview" },
  { label: "Career Roadmap", icon: Map, href: "/roadmap" },
  { label: "Cover Letter", icon: PenLine, href: "/cover-letter" },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4e9bff] via-[#7877c6] to-[#ff5bc1] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm gradient-text">
            CareerCopilot AI
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-[#4e9bff]/20 via-[#7877c6]/20 to-[#ff5bc1]/20 text-white border border-white/10"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <div
                className={`flex-shrink-0 transition-colors ${
                  isActive
                    ? "text-[#7877c6]"
                    : "text-white/40 group-hover:text-white/70"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7877c6]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/5 space-y-2">
        <div className="card-glass rounded-xl p-3">
          <p className="text-xs text-white/40 text-center">
            Powered by Groq &amp; Llama 3.3
          </p>
        </div>
        <p className="text-[10px] text-white/20 text-center">
          &copy; {new Date().getFullYear()} Mili Patel. All rights reserved.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-[#0c0c14] border-r border-white/5 fixed left-0 top-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-64 bg-[#0c0c14] border-r border-white/5 z-50 lg:hidden"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
