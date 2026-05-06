import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Wallet, Mail, Lock, User, ArrowRight, Zap, Check } from "lucide-react";

const wolfImage = `/nox-wolf.jpeg`;

const steps = ["Identity", "Security", "Universe"];

export default function Signup() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [complete, setComplete] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    dreamerId: "",
    category: "",
  });

  const categories = ["Cosmic", "Horror", "Fantasy", "Sci-Fi", "Abstract", "Mythological"];

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setComplete(true);
      setTimeout(() => setLocation("/"), 2500);
    }, 2500);
  };

  const handleWallet = () => {
    setWalletConnecting(true);
    setTimeout(() => {
      setWalletConnecting(false);
      setComplete(true);
      setTimeout(() => setLocation("/"), 2500);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center overflow-hidden py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-secondary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary/5 rounded-full blur-[120px]" />
        {Array.from({ length: 50 }).map((_, i) => (
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

      <AnimatePresence mode="wait">
        {complete ? (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 text-center px-4"
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-primary/60 overflow-hidden shadow-[0_0_40px_rgba(140,80,255,0.6)] relative"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="absolute inset-0 bg-primary/25 mix-blend-overlay z-10" />
              <img src={wolfImage} alt="NOX" className="w-full h-full object-cover" />
            </motion.div>
            <h2 className="font-orbitron text-3xl font-bold gradient-text mb-3">Universe Created</h2>
            <p className="text-muted-foreground font-mono text-sm mb-2">NOX has recorded your essence.</p>
            <p className="text-primary/60 font-mono text-xs">Entering dreamscape...</p>
            <div className="flex justify-center gap-1 mt-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-md px-4"
          >
            <motion.div className="glass rounded-2xl p-8 shadow-[0_0_60px_rgba(140,80,255,0.15)]">
              <div className="flex flex-col items-center mb-6">
                <motion.div
                  className="relative w-14 h-14 mb-4"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-0 rounded-full bg-primary/30 blur-lg animate-pulse" />
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/60 shadow-[0_0_20px_rgba(140,80,255,0.5)]">
                    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />
                    <img src={wolfImage} alt="NOX" className="w-full h-full object-cover" />
                  </div>
                </motion.div>
                <p className="text-xs text-primary/80 font-mono tracking-[0.2em] uppercase mb-1">NOX GENESIS PROTOCOL</p>
                <h1 className="font-orbitron text-2xl font-bold gradient-text">Create Account</h1>
                <p className="text-muted-foreground text-sm mt-1">Forge your dream identity</p>
              </div>

              <div className="flex items-center gap-2 mb-7">
                {steps.map((s, i) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className="flex flex-col items-center w-full">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-orbitron font-bold transition-all duration-300 ${
                          i < step
                            ? "bg-primary text-white shadow-[0_0_12px_rgba(140,80,255,0.6)]"
                            : i === step
                            ? "border-2 border-primary text-primary shadow-[0_0_10px_rgba(140,80,255,0.4)]"
                            : "border border-border/50 text-muted-foreground"
                        }`}
                      >
                        {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <span className={`text-[10px] font-mono mt-1 ${i === step ? "text-primary" : "text-muted-foreground/50"}`}>{s}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-px mb-4 transition-all duration-300 ${i < step ? "bg-primary/60" : "bg-border/40"}`} />
                    )}
                  </div>
                ))}
              </div>

              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <motion.button
                    onClick={handleWallet}
                    disabled={walletConnecting}
                    data-testid="button-connect-wallet-signup"
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 hover:border-primary/70 transition-all duration-300 font-orbitron text-sm text-primary neon-glow disabled:opacity-70"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {walletConnecting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary/50 border-t-primary rounded-full animate-spin" />
                        <span>Linking Wallet...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4" />
                        <span>Register with Solana Wallet</span>
                        <Zap className="w-3 h-3 opacity-60" />
                      </>
                    )}
                  </motion.button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border/50" />
                    <span className="text-xs text-muted-foreground font-mono tracking-wider">OR</span>
                    <div className="flex-1 h-px bg-border/50" />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-primary/70 tracking-widest uppercase block mb-1.5">Dreamer Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={form.username}
                        onChange={(e) => update("username", e.target.value)}
                        placeholder="NebulaWalker"
                        data-testid="input-username"
                        className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border/60 focus:border-primary/70 focus:shadow-[0_0_15px_rgba(140,80,255,0.2)] rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-300 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-primary/70 tracking-widest uppercase block mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="dreamer@universe.sol"
                        data-testid="input-email-signup"
                        className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border/60 focus:border-primary/70 focus:shadow-[0_0_15px_rgba(140,80,255,0.2)] rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-300 font-mono"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-xs font-mono text-primary/70 tracking-widest uppercase block mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => update("password", e.target.value)}
                        placeholder="••••••••••••"
                        data-testid="input-password-signup"
                        className="w-full pl-10 pr-12 py-3 bg-background/50 border border-border/60 focus:border-primary/70 focus:shadow-[0_0_15px_rgba(140,80,255,0.2)] rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-300 font-mono"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} data-testid="button-toggle-password-signup" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-primary/70 tracking-widest uppercase block mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={form.confirm}
                        onChange={(e) => update("confirm", e.target.value)}
                        placeholder="••••••••••••"
                        data-testid="input-confirm-password"
                        className="w-full pl-10 pr-12 py-3 bg-background/50 border border-border/60 focus:border-primary/70 focus:shadow-[0_0_15px_rgba(140,80,255,0.2)] rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-300 font-mono"
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} data-testid="button-toggle-confirm" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {form.confirm && form.password !== form.confirm && (
                      <p className="text-xs text-red-400/80 font-mono mt-1">Passwords do not match</p>
                    )}
                  </div>
                  <div className="glass rounded-xl p-3 border border-primary/10">
                    <p className="text-xs font-mono text-muted-foreground">Password strength: <span className={`${form.password.length >= 8 ? "text-green-400" : "text-amber-400"}`}>{form.password.length >= 12 ? "STRONG" : form.password.length >= 8 ? "MODERATE" : "WEAK"}</span></p>
                    <div className="flex gap-1 mt-2">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${form.password.length > i * 3 ? "bg-primary/80" : "bg-border/30"}`} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="text-xs font-mono text-primary/70 tracking-widest uppercase block mb-1.5">Dream ID (public handle)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 font-mono text-sm">@</span>
                      <input
                        type="text"
                        value={form.dreamerId}
                        onChange={(e) => update("dreamerId", e.target.value)}
                        placeholder="nebula.sol"
                        data-testid="input-dreamer-id"
                        className="w-full pl-8 pr-4 py-3 bg-background/50 border border-border/60 focus:border-primary/70 focus:shadow-[0_0_15px_rgba(140,80,255,0.2)] rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-300 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-primary/70 tracking-widest uppercase block mb-2">Primary Dream Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => update("category", cat)}
                          data-testid={`button-category-${cat.toLowerCase()}`}
                          className={`py-2 px-3 rounded-lg text-xs font-orbitron tracking-wide transition-all duration-200 border ${
                            form.category === cat
                              ? "border-primary bg-primary/20 text-primary shadow-[0_0_10px_rgba(140,80,255,0.3)]"
                              : "border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary/70"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="glass rounded-xl p-3 border border-primary/10">
                    <p className="text-xs font-mono text-muted-foreground/70 leading-relaxed">
                      By creating your account you agree to grant NOX access to your dream patterns for universe generation. Your consciousness data is stored on Solana and is fully owned by you.
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="flex gap-3 mt-6">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    data-testid="button-back"
                    className="flex-1 py-3 rounded-xl border border-border/50 text-muted-foreground hover:border-primary/40 hover:text-primary font-orbitron text-sm transition-all duration-300"
                  >
                    Back
                  </button>
                )}
                <motion.button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  data-testid="button-next-step"
                  className="flex-1 py-3.5 px-6 rounded-xl font-orbitron text-sm font-semibold text-white relative overflow-hidden group disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5, #7c3aed)", backgroundSize: "200% 100%" }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "linear-gradient(135deg, #9333ea, #6366f1)" }} />
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Forging Universe...</span>
                      </>
                    ) : step < 2 ? (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Create Universe</span>
                        <Zap className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </motion.button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-5 font-mono">
                Already in the vault?{" "}
                <Link href="/login">
                  <span className="text-primary hover:text-primary/80 transition-colors cursor-pointer" data-testid="link-to-login">
                    Sign in
                  </span>
                </Link>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
