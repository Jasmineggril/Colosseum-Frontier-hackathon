import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowRight, Sparkles, Orbit, WandSparkles, ShieldCheck, Stars } from "lucide-react";
import { useAudio, type Category } from "@/lib/audio";
import { supabase } from "@/lib/supabase";
import { formatAuthError, syncDreamVaultProfile, upsertDreamVaultProfile, type DreamVaultProfile } from "@/lib/profile";

const categories: Array<{
  id: Category;
  title: string;
  subtitle: string;
  flavor: string;
  prompt: string;
  gradient: string;
  particle: string;
}> = [
  {
    id: "Cosmic",
    title: "Cosmic",
    subtitle: "Infinite consciousness",
    flavor: "neon blue / violet / starlight",
    prompt: "A dream of galaxies, communion, and vast awareness.",
    gradient: "from-indigo-500/35 via-violet-500/20 to-cyan-400/20",
    particle: "shadow-[0_0_40px_rgba(129,140,248,0.35)]",
  },
  {
    id: "Horror",
    title: "Horror",
    subtitle: "Corrupted dream signals",
    flavor: "crimson fog / glitch / shadow",
    prompt: "A dream of tension, thresholds, and hidden presences.",
    gradient: "from-red-500/35 via-zinc-900/60 to-black",
    particle: "shadow-[0_0_30px_rgba(239,68,68,0.35)]",
  },
  {
    id: "Fantasy",
    title: "Fantasy",
    subtitle: "Magical serenity",
    flavor: "emerald glow / cyan mist / ancient forests",
    prompt: "A dream of sacred nature, glowing water, and soft wonder.",
    gradient: "from-emerald-500/25 via-cyan-500/15 to-violet-500/15",
    particle: "shadow-[0_0_30px_rgba(34,197,94,0.3)]",
  },
  {
    id: "Sci-Fi",
    title: "Sci-Fi",
    subtitle: "AI-core simulation",
    flavor: "holographic blue / chrome / interface",
    prompt: "A dream of systems, codes, and synthetic intelligence.",
    gradient: "from-sky-500/25 via-cyan-500/20 to-indigo-500/15",
    particle: "shadow-[0_0_30px_rgba(56,189,248,0.3)]",
  },
  {
    id: "Abstract",
    title: "Abstract",
    subtitle: "Subconscious geometry",
    flavor: "fluid gradients / impossible forms / neural ripples",
    prompt: "A dream of distortion, repetition, and symbolic motion.",
    gradient: "from-fuchsia-500/25 via-purple-500/15 to-pink-500/15",
    particle: "shadow-[0_0_30px_rgba(217,70,239,0.25)]",
  },
  {
    id: "Mythological",
    title: "Mythological",
    subtitle: "Sacred architecture",
    flavor: "gold / temple stone / divine choir",
    prompt: "A dream of gods, ritual, destiny, and ancient power.",
    gradient: "from-amber-400/25 via-yellow-500/15 to-orange-500/15",
    particle: "shadow-[0_0_30px_rgba(251,191,36,0.3)]",
  },
];

export default function UniverseGeneration() {
  const [, setLocation] = useLocation();
  const audio = useAudio();
  const [profile, setProfile] = useState<DreamVaultProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Category>("Cosmic");
  const [step, setStep] = useState(0);
  const [intensity, setIntensity] = useState(60);
  const [tone, setTone] = useState("cinematic");
  const [dimensionNote, setDimensionNote] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        if (!supabase) throw new Error("Supabase nao configurado.");

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session?.user) {
          setLocation("/login");
          return;
        }

        const { data, error } = await syncDreamVaultProfile(sessionData.session.user);
        if (!mounted) return;
        if (error) throw error;

        setProfile(data);
        const savedCategory = (localStorage.getItem("dreamvault_last_category") as Category | null) || null;
        setSelected((data?.category as Category) || savedCategory || "Cosmic");
        setDimensionNote(localStorage.getItem("dreamvault_last_dimension_note") || "");
      } catch (err) {
        if (!mounted) return;
        setErrorMessage(formatAuthError(err as { message?: string }, "Nao foi possivel carregar sua dimensão."));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [setLocation]);

  const theme = useMemo(() => categories.find((item) => item.id === selected) ?? categories[0], [selected]);
  const progress = ((step + 1) / 3) * 100;

  const stepHint = [
    "Choose the dimension that defines the universe.",
    "Tune emotional pressure and audiovisual tone.",
    "Review the world before forging it.",
  ][step];

  const advance = () => {
    audio.playSfx("hover");
    setStep((current) => Math.min(current + 1, 2));
  };

  const retreat = () => {
    audio.playSfx("hover");
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleForge = async () => {
    if (!profile) return;

    setSaving(true);
    setErrorMessage("");

    try {
      audio.playSfx("transition");
      await audio.playCategory(selected);

      const { error } = await upsertDreamVaultProfile({
        id: profile.id,
        username: profile.username,
        category: selected,
        onboarding_completed: true,
      });

      if (error) throw error;

      localStorage.setItem("dreamvault_last_category", selected);
      localStorage.setItem("dreamvault_last_dimension_note", dimensionNote);
      localStorage.setItem("dreamvault_last_dimension_tone", tone);
      localStorage.setItem("dreamvault_last_dimension_intensity", String(intensity));
      setLocation("/analysis");
    } catch (err) {
      setErrorMessage(formatAuthError(err as { message?: string }, "Nao foi possivel forjar seu universo."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background grid place-items-center text-white">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background relative overflow-hidden text-foreground`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-x-0 top-0 h-80 bg-gradient-to-b ${theme.gradient} blur-3xl opacity-70`} />
        <div className="absolute -top-32 left-1/4 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute bottom-[-8rem] right-1/4 h-[24rem] w-[24rem] rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.85)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>

      <div className="relative z-10 mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.3em] text-primary">
              <ShieldCheck className="h-4 w-4" />
              Universe Selection
            </div>
            <h1 className="font-orbitron text-4xl font-bold text-white sm:text-5xl">Forge a personalized dream dimension</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Pick the dimension that shapes your ambient audio, analysis tone, lighting, particles, and universe generation path.
            </p>
          </div>

          <button
            onClick={() => setLocation("/dashboard")}
            className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-primary/30 hover:bg-primary/10 lg:inline-flex"
          >
            Open Dashboard
          </button>
        </div>

        <div className="mb-8 rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
          <div className="h-2 rounded-full bg-black/20">
            <div className="h-2 rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            <span>Step {step + 1} of 3</span>
            <span>{stepHint}</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((item, index) => {
              const active = selected === item.id;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelected(item.id);
                    audio.playSfx("hover");
                  }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`group relative overflow-hidden rounded-3xl border p-5 text-left shadow-[0_0_35px_rgba(124,58,237,0.08)] backdrop-blur-xl transition-all ${active ? "border-primary/50 bg-white/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}
                    style={{ opacity: active ? 1 : 0.35 }}
                  />
                  <div className="absolute inset-0 opacity-60 mix-blend-screen">
                    <div className={`absolute right-3 top-3 h-24 w-24 rounded-full ${item.particle} blur-3xl`} />
                  </div>

                  <div className="relative space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/70">{item.title}</p>
                        <h2 className="mt-1 font-orbitron text-2xl text-white">{item.subtitle}</h2>
                      </div>
                      <Orbit className={`h-5 w-5 ${active ? "text-white" : "text-white/50"}`} />
                    </div>

                    <p className="text-sm leading-6 text-white/80">{item.flavor}</p>
                    <p className="text-xs leading-6 text-white/60">{item.prompt}</p>

                    <div className="flex items-center justify-between pt-2 text-xs uppercase tracking-[0.25em] text-white/70">
                      <span>Dimension locked</span>
                      {active ? <Stars className="h-4 w-4 text-white" /> : <Sparkles className="h-4 w-4 text-white/50" />}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_0_80px_rgba(124,58,237,0.12)] backdrop-blur-2xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-40`} />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Current Dimension</p>
                  <h2 className="mt-2 font-orbitron text-3xl text-white">{selected}</h2>
                </div>
                <div className="rounded-full border border-white/10 bg-black/20 p-4">
                  <WandSparkles className="h-8 w-8 text-primary" />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">System message</p>
                <p className="mt-3 text-base leading-7 text-white/90">
                  {theme.prompt} The analysis tone, ambient layers, and visual lighting will adapt to this dimension.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">AI flavor</p>
                  <p className="mt-2 text-sm text-white/80">{theme.flavor}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Profile</p>
                  <p className="mt-2 text-sm text-white/80">{profile?.username || "Dreamer"}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={step === 2 ? handleForge : advance}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-cyan-400 px-5 py-4 font-orbitron text-sm font-semibold text-white shadow-[0_0_35px_rgba(124,58,237,0.35)] transition hover:scale-[1.01] disabled:opacity-70"
                >
                  {saving ? "Forging..." : step === 2 ? "Forge Universe" : "Continue"}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={step === 0 ? () => setLocation("/analysis") : retreat}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-orbitron text-sm font-semibold text-white transition hover:border-primary/30 hover:bg-primary/10"
                >
                  {step === 0 ? "Analyze Dream" : "Back"}
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>

              {step === 1 ? (
                <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      <span>Emotional Intensity</span>
                      <span>{intensity}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={intensity}
                      onChange={(e) => {
                        setIntensity(Number(e.target.value));
                        audio.playSfx("hover");
                      }}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="grid gap-2 sm:grid-cols-3">
                    {[
                      { value: "cinematic", label: "Cinematic" },
                      { value: "meditative", label: "Meditative" },
                      { value: "chaotic", label: "Chaotic" },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setTone(item.value);
                          audio.playSfx("hover");
                        }}
                        className={`rounded-xl border px-3 py-2 text-sm transition-all ${tone === item.value ? "border-primary/40 bg-primary/15 text-white" : "border-white/10 bg-white/5 text-muted-foreground hover:text-white"}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Final review</p>
                  <div className="mt-4 space-y-2 text-sm text-white/90">
                    <p><span className="text-muted-foreground">Category:</span> {selected}</p>
                    <p><span className="text-muted-foreground">Intensity:</span> {intensity}%</p>
                    <p><span className="text-muted-foreground">Tone:</span> {tone}</p>
                    <p><span className="text-muted-foreground">Profile:</span> {profile?.username || "Dreamer"}</p>
                  </div>
                  <textarea
                    value={dimensionNote}
                    onChange={(e) => setDimensionNote(e.target.value)}
                    placeholder="Optional note for this universe: what should NOX remember?"
                    className="mt-4 min-h-[110px] w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white placeholder:text-muted-foreground outline-none"
                  />
                </div>
              ) : null}

              {errorMessage ? <p className="text-sm text-red-300">{errorMessage}</p> : null}

              <div className="rounded-2xl border border-primary/10 bg-black/20 p-4 text-sm leading-7 text-muted-foreground">
                Logged-in users can change the category here and persist it in Supabase. The next step is always meaningful: forge the universe or jump straight into dream analysis.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
