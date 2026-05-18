import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Orbit, MessageSquareQuote } from "lucide-react";
import DreamAnalysis from "@/components/DreamAnalysis";

const categoryTheme: Record<string, { bg: string; accent: string; label: string }> = {
  Cosmic: { bg: "from-indigo-500/20 via-violet-500/10 to-cyan-400/10", accent: "text-cyan-200", label: "Infinite consciousness" },
  Horror: { bg: "from-red-500/20 via-zinc-900/30 to-black", accent: "text-red-200", label: "Nightmare tension" },
  Fantasy: { bg: "from-emerald-500/20 via-cyan-400/10 to-violet-500/10", accent: "text-emerald-200", label: "Magical serenity" },
  "Sci-Fi": { bg: "from-sky-500/20 via-cyan-500/10 to-indigo-500/10", accent: "text-sky-200", label: "AI simulation" },
  Abstract: { bg: "from-fuchsia-500/20 via-purple-500/10 to-pink-500/10", accent: "text-fuchsia-200", label: "Subconscious geometry" },
  Mythological: { bg: "from-amber-400/20 via-yellow-500/10 to-orange-500/10", accent: "text-amber-200", label: "Sacred power" },
};

export default function AnalysisPage() {
  const [category, setCategory] = useState("Cosmic");
  const [note, setNote] = useState("");
  const theme = useMemo(() => categoryTheme[category] || categoryTheme.Cosmic, [category]);

  useEffect(() => {
    const savedCategory = localStorage.getItem("dreamvault_last_category") || "Cosmic";
    setCategory(savedCategory);
    setNote(localStorage.getItem("dreamvault_last_dimension_note") || "");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-x-0 top-0 h-80 bg-gradient-to-b ${theme.bg} blur-3xl opacity-70`} />
        <div className="absolute -top-24 right-1/4 h-[22rem] w-[22rem] rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute bottom-[-6rem] left-1/4 h-[18rem] w-[18rem] rounded-full bg-cyan-400/10 blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.3em] text-primary">
              <MessageSquareQuote className="h-4 w-4" />
              Dream Analysis
            </div>
            <h1 className="mt-4 font-orbitron text-4xl font-bold text-white sm:text-5xl">Interpret the dream, shape the universe</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Each analysis is styled by the currently selected dimension, so the experience feels like one continuous dream sequence.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-primary/30 hover:bg-primary/10">
              Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/community" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-primary/30 hover:bg-primary/10">
              Community
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <div className="mb-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-3">
              <div className={`rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm ${theme.accent}`}>
                <Orbit className="mr-2 inline-block h-4 w-4" />
                {category}
              </div>
              <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/80">
                {theme.label}
              </div>
              <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-muted-foreground">
                {note || "No universe note saved yet."}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Quick path</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link href="/universe-generation" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-cyan-400 px-4 py-3 text-sm font-semibold text-white">
                Forge Universe
                <Sparkles className="h-4 w-4" />
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-semibold text-white">
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <DreamAnalysis />
      </div>
    </div>
  );
}
