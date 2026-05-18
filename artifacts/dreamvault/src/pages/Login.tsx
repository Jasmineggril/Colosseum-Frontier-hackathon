import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Wallet, Mail, Lock, ArrowRight, Zap } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const wolfImage = `/nox-wolf.jpeg`;

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      if (!isSupabaseConfigured || !supabase) {
        setErrorMessage("Supabase nao configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message || "Falha ao entrar. Verifique suas credenciais.");
        setIsLoading(false);
        return;
      }

      setLocation("/universe-generation");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Nao foi possivel conectar com o Supabase.";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWallet = () => {
    setWalletConnecting(true);
    setTimeout(() => {
      setWalletConnecting(false);
      setLocation("/universe-generation");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              backgroundColor: i % 3 === 0 ? "rgba(140,80,255,0.4)" : i % 3 === 1 ? "rgba(60,130,255,0.3)" : "rgba(180,140,255,0.2)",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animation: `float ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-6 left-8 z-10">
        <Link href="/">
          <span className="font-orbitron font-bold text-xl tracking-wider cursor-pointer">
            <span className="gradient-text">DREAM</span>
            <span className="text-muted-foreground">VAULT</span>
          </span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-2xl p-8 shadow-[0_0_60px_rgba(140,80,255,0.15)]"
        >
          <div className="flex flex-col items-center mb-8">
            <motion.div
              className="relative w-16 h-16 mb-4"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-lg animate-pulse" />
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/60 shadow-[0_0_20px_rgba(140,80,255,0.5)]">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />
                <img src={wolfImage} alt="NOX" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <div className="text-center">
              <p className="text-xs text-primary/80 font-mono tracking-[0.2em] uppercase mb-1">NOX AUTHENTICATED ACCESS</p>
              <h1 className="font-orbitron text-2xl font-bold gradient-text">Welcome Back</h1>
              <p className="text-muted-foreground text-sm mt-1">Enter the dreamscape</p>
            </div>
          </div>

          <motion.button
            onClick={handleWallet}
            disabled={walletConnecting}
            data-testid="button-connect-wallet-login"
            className="w-full mb-6 relative group flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 hover:border-primary/70 transition-all duration-300 font-orbitron text-sm text-primary neon-glow disabled:opacity-70"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {walletConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary/50 border-t-primary rounded-full animate-spin" />
                <span>Connecting to Solana...</span>
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                <span>Connect Solana Wallet</span>
                <Zap className="w-3 h-3 opacity-60" />
              </>
            )}
          </motion.button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground font-mono tracking-wider">OR</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <label className="text-xs font-mono text-primary/70 tracking-widest uppercase block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-email"
                  placeholder="dreamer@universe.sol"
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border/60 focus:border-primary/70 focus:shadow-[0_0_15px_rgba(140,80,255,0.2)] rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-300 font-mono"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="text-xs font-mono text-primary/70 tracking-widest uppercase block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-password"
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-background/50 border border-border/60 focus:border-primary/70 focus:shadow-[0_0_15px_rgba(140,80,255,0.2)] rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-300 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="sr-only" data-testid="checkbox-remember" />
                  <div className="w-4 h-4 border border-border/60 group-hover:border-primary/50 rounded transition-colors" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">Remember me</span>
              </label>
              <button type="button" className="text-xs text-primary/70 hover:text-primary font-mono transition-colors" data-testid="link-forgot-password">
                Forgot access?
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              data-testid="button-login-submit"
              className="w-full mt-2 py-3.5 px-6 rounded-xl font-orbitron text-sm font-semibold text-white relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5, #7c3aed)", backgroundSize: "200% 100%" }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(135deg, #9333ea, #6366f1)" }} />
              <div className="absolute inset-0 neon-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Accessing Dreamscape...</span>
                  </>
                ) : (
                  <>
                    <span>Enter the Vault</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </span>
            </motion.button>

            {errorMessage ? (
              <p className="text-xs font-mono text-red-400" data-testid="login-error-message">
                {errorMessage}
              </p>
            ) : null}
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6 font-mono">
            No universe yet?{" "}
            <Link href="/signup">
              <span className="text-primary hover:text-primary/80 transition-colors cursor-pointer" data-testid="link-to-signup">
                Create account
              </span>
            </Link>
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-muted-foreground/50 font-mono mt-4"
        >
          Protected by Solana cryptography
        </motion.p>
      </motion.div>
    </div>
  );
}
