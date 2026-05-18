import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { LogOut, Zap, Sparkles, ArrowRight, User, Mail, Settings, Home as HomeIcon, BadgeCheck, Orbit } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { syncDreamVaultProfile, type DreamVaultProfile } from "@/lib/profile";

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
      } catch {
        setLocation("/login");
      } finally {
        setLoading(false);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Sonhos Criados", value: String(profile?.onboarding_completed ? 1 : 0), icon: "✨" },
            { label: "Comunidade", value: "Nox Collective", icon: "🌌" },
            { label: "Status", value: "Ativo", icon: "⚡" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 text-center hover:border-primary/30 transition-all"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-bold text-white mt-1">{stat.value}</p>
            </motion.div>
          ))}
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
