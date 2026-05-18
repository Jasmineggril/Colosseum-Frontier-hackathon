import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowRight, Sparkles, WandSparkles, Orbit, LoaderCircle, BadgeCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAudio } from "@/lib/audio";
import { completeDreamVaultOnboarding, formatAuthError, syncDreamVaultProfile, type DreamVaultProfile } from "@/lib/profile";

type AwakeningState = "loading" | "ready" | "error";

export default function UniverseAwakening() {
  const [, setLocation] = useLocation();
  const audio = useAudio();
  const [state, setState] = useState<AwakeningState>("loading");
  const [profile, setProfile] = useState<DreamVaultProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEnteringVault, setIsEnteringVault] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        if (!supabase) {
          throw new Error("Supabase nao configurado. Defina as variaveis no Vercel.");
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !sessionData.session?.user) {
          setLocation("/login");
          return;
        }

        const user = sessionData.session.user;
        const { data: profileData, error: profileError } = await syncDreamVaultProfile(user);

        if (!mounted) {
          return;
        }

        if (profileError) {
          throw profileError;
        }

        setProfile(profileData);
        setState("ready");
      } catch (error) {
        if (!mounted) {
          return;
        }

        setErrorMessage(formatAuthError(error as { message?: string }, "Nao foi possivel carregar sua identidade."));
        setState("error");
      }
    };

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, [setLocation]);

  const displayName = useMemo(() => profile?.username || "Dreamer", [profile?.username]);
  const category = useMemo(() => profile?.category || "Cosmic", [profile?.category]);

  const handleEnterVault = async () => {
    if (!profile) {
      return;
    }

    setIsEnteringVault(true);

    try {
      // play transition sfx and start ambient for category
      try {
        audio.playSfx("transition");
      } catch {}

      try {
        await audio.playCategory(category as any);
      } catch {}

      const { error } = await completeDreamVaultOnboarding(profile.id);

      if (error) {
        throw error;
      }

      setLocation("/dashboard");
    } catch (error) {
      setErrorMessage(formatAuthError(error as { message?: string }, "Nao foi possivel concluir seu acesso ao vault."));
      setState("error");
    } finally {
      setIsEnteringVault(false);
    }
  };

  const quickActions = [
    { label: "Enter The Vault", action: handleEnterVault, variant: "primary" as const },
    { label: "Customize Profile", action: () => setLocation("/dashboard"), variant: "secondary" as const },
    { label: "Explore Universes", action: () => setLocation("/"), variant: "ghost" as const },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.22),transparent_55%)]" />
        <div className="absolute -top-32 left-1/4 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute bottom-[-8rem] right-1/4 h-[24rem] w-[24rem] rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.8)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.3em] text-primary shadow-[0_0_25px_rgba(124,58,237,0.18)]">
              <Sparkles className="h-4 w-4" />
              Universe Awakening
            </div>

            <div className="space-y-4">
              <h1 className="max-w-xl font-orbitron text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Welcome back, <span className="bg-gradient-to-r from-primary via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent">{displayName}</span>
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                Seu universo foi criado com sucesso. Sua identidade digital agora existe no DreamVault.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                {category}
              </span>
              {profile?.onboarding_completed ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
                  <BadgeCheck className="h-4 w-4" />
                  Onboarding complete
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                  <Orbit className="h-4 w-4" />
                  Fresh universe
                </span>
              )}
            </div>

            <div className="max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_60px_rgba(124,58,237,0.14)] backdrop-blur-xl">
              <p className="text-sm leading-7 text-muted-foreground">
                Your profile is linked to Supabase Auth and stored in the protected <span className="text-primary">profiles</span> table with row-level security enabled.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {quickActions.map((item) => (
                <motion.button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={item.label === "Enter The Vault" ? isEnteringVault : false}
                  className={`group relative overflow-hidden rounded-2xl border px-5 py-4 text-left font-orbitron text-sm transition-all duration-300 disabled:opacity-70 ${
                    item.variant === "primary"
                      ? "border-primary/40 bg-primary/15 text-white shadow-[0_0_30px_rgba(124,58,237,0.25)]"
                      : item.variant === "secondary"
                      ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-100"
                      : "border-white/10 bg-white/5 text-muted-foreground"
                  }`}
                >
                  <div className="relative flex items-center justify-between gap-3">
                    <span>{item.label}</span>
                    {item.label === "Enter The Vault" && isEnteringVault ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-primary/10 to-cyan-400/10 p-8 shadow-[0_0_70px_rgba(34,211,238,0.12)] backdrop-blur-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_55%)]" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.35em] text-primary/80">
                  <span>Cosmic Access</span>
                  <span>{state === "ready" ? "Synced" : state === "error" ? "Offline" : "Processing"}</span>
                </div>

                <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-full border border-primary/30 bg-[radial-gradient(circle,rgba(124,58,237,0.25),rgba(15,23,42,0.2)_45%,transparent_70%)]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-10 rounded-full border border-cyan-300/20"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-16 rounded-full border border-primary/25"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex h-40 w-40 items-center justify-center rounded-full border border-white/20 bg-background/60 shadow-[0_0_50px_rgba(124,58,237,0.35)]"
                  >
                    <WandSparkles className="h-12 w-12 text-primary" />
                  </motion.div>
                </div>

                <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm font-medium text-white">Profile snapshot</p>
                  <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/70">Username</p>
                      <p className="mt-1 font-semibold text-white">{displayName}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/70">Category</p>
                      <p className="mt-1 font-semibold text-cyan-200">{category}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/70">Created at</p>
                      <p className="mt-1 font-semibold text-white">{profile?.created_at ? new Date(profile.created_at).toLocaleString() : "Synced from Auth"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/70">Status</p>
                      <p className="mt-1 font-semibold text-emerald-200">{profile?.onboarding_completed ? "Ready" : "Awakening"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {state === "error" ? (
          <div className="fixed inset-x-0 bottom-6 z-20 mx-auto max-w-2xl px-4">
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 shadow-[0_0_40px_rgba(239,68,68,0.14)] backdrop-blur-xl">
              {errorMessage}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
