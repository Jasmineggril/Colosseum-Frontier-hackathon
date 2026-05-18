import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { LogOut, Zap, Sparkles, ArrowRight, User, Mail, Settings, Home as HomeIcon, BadgeCheck, Orbit, MessageSquareQuote, LoaderCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { syncDreamVaultProfile, type DreamVaultProfile } from "@/lib/profile";

type DreamRecord = {
  id?: string;
  dream_text: string;
  analysis?: unknown;
  category?: string | null;
  created_at?: string;
};

const categoryTheme: Record<string, { bg: string; accent: string; glow: string; label: string }> = {
  Cosmic: { bg: "from-indigo-500/20 via-violet-500/10 to-cyan-400/10", accent: "text-cyan-200", glow: "shadow-[0_0_40px_rgba(124,58,237,0.16)]", label: "Infinite consciousness" },
  Horror: { bg: "from-red-500/20 via-zinc-900/30 to-black", accent: "text-red-200", glow: "shadow-[0_0_40px_rgba(239,68,68,0.12)]", label: "Nightmare tension" },
  Fantasy: { bg: "from-emerald-500/20 via-cyan-400/10 to-violet-500/10", accent: "text-emerald-200", glow: "shadow-[0_0_40px_rgba(34,197,94,0.12)]", label: "Magical serenity" },
  "Sci-Fi": { bg: "from-sky-500/20 via-cyan-500/10 to-indigo-500/10", accent: "text-sky-200", glow: "shadow-[0_0_40px_rgba(56,189,248,0.12)]", label: "AI simulation" },
  Abstract: { bg: "from-fuchsia-500/20 via-purple-500/10 to-pink-500/10", accent: "text-fuchsia-200", glow: "shadow-[0_0_40px_rgba(217,70,239,0.12)]", label: "Subconscious geometry" },
  Mythological: { bg: "from-amber-400/20 via-yellow-500/10 to-orange-500/10", accent: "text-amber-200", glow: "shadow-[0_0_40px_rgba(251,191,36,0.12)]", label: "Sacred power" },
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<DreamVaultProfile | null>(null);
  const [dreams, setDreams] = useState<DreamRecord[]>([]);
  const [dreamsLoading, setDreamsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase?.auth.getUser() || {};
        if (error || !data?.user) {
          setLocation("/login");
          return;
        }
        setUser(data.user);

        const { data: profileData } = await syncDreamVaultProfile(data.user);
        setProfile(profileData);

        try {
          const feedResp = await fetch(`/api/dreams?limit=6${data.user?.id ? `&user_id=${encodeURIComponent(data.user.id)}` : ""}`);
          if (feedResp.ok) {
            const feedJson = await feedResp.json();
            setDreams(Array.isArray(feedJson.data) ? feedJson.data : []);
          }
        } catch {
          // ignore and fallback to local storage below
        }

        const localHistory = JSON.parse(localStorage.getItem("dream_history") || "[]") as DreamRecord[];
        if (localHistory.length > 0) {
          setDreams((current) => (current.length > 0 ? current : localHistory.slice(0, 6)));
        }
      } catch {
        setLocation("/login");
      } finally {
        setLoading(false);
        setDreamsLoading(false);
      }
    };

    getUser();
  }, [setLocation]);

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    setLocation("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 rounded-full border-2 border-transparent border-t-primary border-r-primary"
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const username = profile?.username || user.user_metadata?.username || user.email?.split("@")[0] || "Sonhador";
  const category = profile?.category || user.user_metadata?.category || "Cosmic";
  const onboardingCompleted = profile?.onboarding_completed ?? false;
  const theme = categoryTheme[category] || categoryTheme.Cosmic;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-12">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/50">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-orbitron font-bold text-white">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Bem-vindo, {username}</p>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors border border-red-500/30"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </motion.button>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`lg:col-span-2 p-6 rounded-xl bg-gradient-to-br ${theme.bg} border border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all ${theme.glow}`}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-orbitron font-bold text-white flex items-center gap-2">
                  <Sparkles className={`w-5 h-5 ${theme.accent}`} />
                  Seu Perfil de Sonhador
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Informações da sua conta interdimensional</p>
              </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-primary/10">
                <User className="w-5 h-5 text-primary/60" />
                <div>
                  <p className="text-xs text-muted-foreground">Nome de Usuário</p>
                  <p className="text-white font-medium">{username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-primary/10">
                <Mail className="w-5 h-5 text-primary/60" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-white font-medium break-all">{user.email}</p>
                </div>
              </div>

              {category && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-accent/10">
                  <Orbit className={`w-5 h-5 ${theme.accent}`} style={{ opacity: 0.75 }} />
                  <div>
                    <p className="text-xs text-muted-foreground">Categoria de Sonhos</p>
                    <p className={`font-medium ${theme.accent}`}>{category}</p>
                    <p className="text-xs text-muted-foreground">{theme.label}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-primary/10">
                <BadgeCheck className="w-5 h-5 text-primary/60" />
                <div>
                  <p className="text-xs text-muted-foreground">Onboarding</p>
                  <p className="text-white font-medium">{onboardingCompleted ? "Completed" : "Awakening"}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20 backdrop-blur-sm hover:border-accent/40 transition-all"
          >
            <h3 className="text-lg font-orbitron font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-accent" />
              Ações Rápidas
            </h3>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLocation("/universe-generation")}
                className="w-full p-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/50 transition-all"
              >
                <Zap className="w-4 h-4" />
                Forjar Universo
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLocation("/analysis")}
                className="w-full p-3 rounded-lg bg-background/50 border border-primary/20 text-white font-semibold flex items-center justify-center gap-2 hover:border-primary/40 transition-all"
              >
                <HomeIcon className="w-4 h-4" />
                Analisar Sonho
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-orbitron font-bold text-white flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-primary" />
                Recent Dream History
              </h3>
              <button
                onClick={() => setLocation("/community")}
                className="text-xs text-primary hover:text-primary/80 font-mono uppercase tracking-[0.2em]"
              >
                View Community
              </button>
            </div>

            {dreamsLoading ? (
              <div className="grid gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-24 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : dreams.length > 0 ? (
              <div className="space-y-3">
                {dreams.map((dream, index) => (
                  <div key={dream.id ?? `${dream.created_at ?? "dream"}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                        <Orbit className="w-3.5 h-3.5 text-primary" />
                        {dream.category || category}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {dream.created_at ? new Date(dream.created_at).toLocaleDateString() : "recent"}
                      </span>
                    </div>
                    <p className="text-sm text-white/90 line-clamp-2">{dream.dream_text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-5 text-center text-sm text-muted-foreground">
                <LoaderCircle className="mx-auto mb-2 h-5 w-5 animate-spin text-primary" />
                No dream history yet. Start with Universe Generation or AI Dream Analysis.
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20 backdrop-blur-sm"
          >
            <h3 className="text-lg font-orbitron font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Community Snapshot
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Dimension</p>
                <p className={`mt-1 font-medium ${theme.accent}`}>{category}</p>
                <p className="text-xs mt-1">{theme.label}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Community</p>
                <p className="mt-1 font-medium text-white">Nox Collective</p>
                <p className="text-xs mt-1">Dreams can now be explored, analyzed and compared across dimensions.</p>
              </div>
              <button onClick={() => setLocation("/community")} className="w-full rounded-2xl bg-white/10 px-4 py-3 text-white transition hover:bg-white/15">
                Open Community Feed
              </button>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-8 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 backdrop-blur-sm text-center"
        >
          <h2 className="text-2xl font-orbitron font-bold text-white mb-3">Pronto para forjar o próximo universo?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Explore o poder do DreamVault e transforme seus sonhos mais selvagens em universos digitais incríveis. Cada sonho é uma possibilidade infinita.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLocation("/universe-generation")}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-lg hover:shadow-primary/50 transition-all"
          >
            Abrir Universe Generation
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
