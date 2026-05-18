import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Sparkles, Orbit, ArrowRight, Users, Globe, Flame } from "lucide-react";

type DreamRecord = {
  id?: string;
  dream_text: string;
  analysis?: unknown;
  category?: string | null;
  created_at?: string;
  user_id?: string | null;
};

const categories = ["All", "Cosmic", "Horror", "Fantasy", "Sci-Fi", "Abstract", "Mythological"] as const;

const categoryTheme: Record<string, { bg: string; accent: string; label: string }> = {
  Cosmic: { bg: "from-indigo-500/20 via-violet-500/10 to-cyan-400/10", accent: "text-cyan-200", label: "cosmic signal" },
  Horror: { bg: "from-red-500/20 via-zinc-900/30 to-black", accent: "text-red-200", label: "nightmare echo" },
  Fantasy: { bg: "from-emerald-500/20 via-cyan-400/10 to-violet-500/10", accent: "text-emerald-200", label: "mythic shimmer" },
  "Sci-Fi": { bg: "from-sky-500/20 via-cyan-500/10 to-indigo-500/10", accent: "text-sky-200", label: "AI transmission" },
  Abstract: { bg: "from-fuchsia-500/20 via-purple-500/10 to-pink-500/10", accent: "text-fuchsia-200", label: "neural distortion" },
  Mythological: { bg: "from-amber-400/20 via-yellow-500/10 to-orange-500/10", accent: "text-amber-200", label: "sacred chronicle" },
};

function parseAnalysis(value: unknown): string {
  if (!value) return "A dream still resonating in the collective.";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const rec = value as Record<string, unknown>;
    if (typeof rec.analysis === "string") return rec.analysis;
    if (typeof rec.text === "string") return rec.text;
  }
  return "A dream still resonating in the collective.";
}

export default function Community() {
  const [, setLocation] = useLocation();
  const [dreams, setDreams] = useState<DreamRecord[]>([]);
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const resp = await fetch("/api/dreams?limit=30");
        if (!resp.ok) {
          throw new Error(await resp.text());
        }

        const json = await resp.json();
        setDreams(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Nao foi possivel carregar o feed comunitario.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "All") return dreams;
    return dreams.filter((dream) => dream.category === filter);
  }, [dreams, filter]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 h-[32rem] w-[32rem] rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute bottom-[-8rem] left-1/4 h-[24rem] w-[24rem] rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.11] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.85)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.3em] text-primary">
              <Users className="h-4 w-4" />
              Community Feed
            </div>
            <h1 className="mt-4 font-orbitron text-4xl font-bold text-white sm:text-5xl">Shared dream transmissions</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              See what the collective is dreaming right now. Each entry carries the category dimension that shaped its interpretation.
            </p>
          </div>

          <button onClick={() => setLocation("/dashboard")} className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-primary/30 hover:bg-primary/10 lg:inline-flex">
            Back to Dashboard
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full border px-4 py-2 text-sm transition-all ${filter === item ? "border-primary/40 bg-primary/15 text-white" : "border-white/10 bg-white/5 text-muted-foreground hover:border-primary/20 hover:text-white"}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-36 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
              ))
            ) : filtered.length > 0 ? (
              filtered.map((dream, index) => {
                const category = dream.category || "Cosmic";
                const theme = categoryTheme[category] || categoryTheme.Cosmic;

                return (
                  <motion.article
                    key={dream.id ?? `${dream.created_at ?? "dream"}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_40px_rgba(124,58,237,0.08)] backdrop-blur-xl`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-35`} />
                    <div className="relative space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70">
                            <Orbit className="h-3.5 w-3.5" />
                            {category}
                          </div>
                          <p className={`mt-3 text-sm uppercase tracking-[0.28em] ${theme.accent}`}>{theme.label}</p>
                        </div>
                        <Globe className={`h-5 w-5 ${theme.accent}`} />
                      </div>

                      <p className="text-sm leading-7 text-white/90">{dream.dream_text}</p>

                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="mb-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">Collective interpretation</p>
                        <p className="text-sm leading-7 text-white/80">{parseAnalysis(dream.analysis)}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{dream.created_at ? new Date(dream.created_at).toLocaleString() : "recent"}</span>
                        <span className="inline-flex items-center gap-2 text-primary/80">
                          <Flame className="h-3.5 w-3.5" />
                          Shared in the vault
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-muted-foreground">
                No dreams found for this dimension yet.
              </div>
            )}

            {errorMessage ? <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{errorMessage}</div> : null}
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Community metrics</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-muted-foreground">Visible dreams</p>
                  <p className="mt-1 text-2xl font-bold text-white">{filtered.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-muted-foreground">Filter</p>
                  <p className="mt-1 text-2xl font-bold text-white">{filter}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-primary/10 bg-black/20 p-4 text-sm leading-7 text-muted-foreground">
                This feed can later evolve into likes, reactions, and sharing. For now it gives judges a living, demo-ready social layer.
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary/15 to-secondary/15 p-6 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Next action</p>
              <h2 className="mt-3 font-orbitron text-2xl text-white">Return to your dimension</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">Go back to the dashboard or jump into universe generation to shape another dream world.</p>

              <div className="mt-5 flex flex-col gap-3">
                <button onClick={() => setLocation("/dashboard")} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:scale-[1.01]">
                  Dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => setLocation("/universe-generation")} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-primary/30 hover:bg-primary/10">
                  Universe Generation
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
