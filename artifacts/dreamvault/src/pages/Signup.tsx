import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Wallet, Mail, Lock, User, ArrowRight, Zap, Check } from "lucide-react";
import { isSupabaseConfigured, supabase, supabaseConfigError } from "@/lib/supabase";
import { formatAuthError } from "@/lib/profile";

const wolfImage = "/nox-wolf.jpeg";
const steps = ["Identity", "Security", "Universe"];
const categories = ["Cosmic", "Horror", "Fantasy", "Sci-Fi", "Abstract", "Mythological"];

export default function Signup() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    category: "",
  });

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const normalizeHandle = (value: string) => value.trim().replace(/^@+/, "");

  const isValidUsername = (value: string) => /^[a-zA-Z0-9._-]{3,32}$/.test(normalizeHandle(value));

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleNext = () => {
    setErrorMessage("");

    if (step === 0) {
      if (!form.username.trim() || !form.email.trim()) {
        setErrorMessage("Preencha username e email para continuar.");
        return;
      }

      if (!isValidUsername(form.username)) {
        setErrorMessage("Username deve ter 3 a 32 caracteres e usar apenas letras, numeros, ponto, underscore ou hifen.");
        return;
      }

      if (!isValidEmail(form.email)) {
        setErrorMessage("Digite um email valido.");
        return;
      }

      setStep(step + 1);
      return;
    }

    if (step === 1) {
      if (form.password.length < 8) {
        setErrorMessage("A senha precisa ter pelo menos 8 caracteres.");
        return;
      }

      if (form.password !== form.confirm) {
        setErrorMessage("As senhas precisam ser iguais.");
        return;
      }
    }

    if (step === 2 && !form.category) {
      setErrorMessage("Selecione uma categoria principal para continuar.");
      return;
    }

    if (step < 2) {
      setStep(step + 1);
      return;
    }

    void handleSubmit();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (!isSupabaseConfigured || !supabase) {
        setErrorMessage(supabaseConfigError ?? "Supabase nao configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
        return;
      }

      const payload = {
        username: normalizeHandle(form.username),
        email: form.email.trim(),
        password: form.password,
        category: form.category,
      };

      const createViaAdmin = async () => {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const responseBody = await response.json().catch(() => ({}));

        if (!response.ok) {
          const error = new Error(responseBody?.message || "Falha ao criar conta.") as Error & { status?: number };
          error.status = response.status;
          throw error;
        }

        return responseBody;
      };

      let createdUserId = "";

      try {
        const responseBody = await createViaAdmin();
        createdUserId = String(responseBody?.user?.id ?? "");

        if (responseBody?.session?.access_token && responseBody?.session?.refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: responseBody.session.access_token,
            refresh_token: responseBody.session.refresh_token,
          });

          if (sessionError) {
            throw sessionError;
          }
        }
      } catch (error) {
        const typedError = error as { message?: string; status?: number };
        const message = formatAuthError(typedError, "Falha ao criar conta.");

        if (message.includes("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY")) {
          setErrorMessage(message);
          return;
        }

        if (message.includes("Falha ao criar usuario no Supabase Auth")) {
          setErrorMessage(message);
          return;
        }

        if (typedError.status === 404 || typedError.status === 405 || message.toLowerCase().includes("method not allowed") || message.toLowerCase().includes("not found")) {
          const { data, error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
              emailRedirectTo: `${window.location.origin}/universe-awakening`,
              data: {
                username: normalizeHandle(form.username),
                category: form.category,
              },
            },
          });

          if (error) {
            setErrorMessage(formatAuthError(error, message));
            return;
          }

          createdUserId = String(data.session?.user?.id ?? data.user?.id ?? "");
        } else {
          setErrorMessage(message);
          return;
        }
      }

      if (!createdUserId) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (error || !data.user) {
          setErrorMessage(formatAuthError(error, "Conta criada, mas nao foi possivel iniciar a sessao automaticamente."));
          return;
        }

        createdUserId = data.user.id;
      }

      const maxAttempts = 4;
      let signedIn = false;

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (!signInError) {
          signedIn = true;
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 500 + attempt * 250));
      }

      if (!signedIn) {
        setErrorMessage("Conta criada, mas nao foi possivel iniciar a sessao automaticamente. Verifique o login.");
        return;
      }

      setComplete(true);
      setSuccessMessage("Your universe is ready. Redirecting to Universe Awakening...");
      setTimeout(() => setLocation("/universe-awakening"), 2200);
    } catch (error) {
      setErrorMessage(formatAuthError(error as { message?: string }, "Nao foi possivel conectar com o Supabase."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleWallet = () => {
    setWalletConnecting(true);
    setTimeout(() => {
      setWalletConnecting(false);
      setComplete(true);
      setTimeout(() => setLocation("/dashboard"), 2500);
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
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              backgroundColor:
                i % 3 === 0 ? "rgba(140,80,255,0.4)" : i % 3 === 1 ? "rgba(60,130,255,0.3)" : "rgba(180,140,255,0.2)",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
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
            {successMessage ? <p className="text-cyan-300 font-mono text-xs mb-2">{successMessage}</p> : null}
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
                {steps.map((label, index) => (
                  <div key={label} className="flex items-center flex-1">
                    <div className="flex flex-col items-center w-full">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-orbitron font-bold transition-all duration-300 ${
                          index < step
                            ? "bg-primary text-white shadow-[0_0_12px_rgba(140,80,255,0.6)]"
                            : index === step
                            ? "border-2 border-primary text-primary shadow-[0_0_10px_rgba(140,80,255,0.4)]"
                            : "border border-border/50 text-muted-foreground"
                        }`}
                      >
                        {index < step ? <Check className="w-3.5 h-3.5" /> : index + 1}
                      </div>
                      <span className={`text-[10px] font-mono mt-1 ${index === step ? "text-primary" : "text-muted-foreground/50"}`}>{label}</span>
                    </div>
                    {index < steps.length - 1 ? (
                      <div className={`flex-1 h-px mb-4 transition-all duration-300 ${index < step ? "bg-primary/60" : "bg-border/40"}`} />
                    ) : null}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {step === 0 ? (
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
                      <label className="text-xs font-mono text-primary/70 tracking-widest uppercase block mb-1.5">Username / @handle</label>
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
                ) : step === 1 ? (
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
                    </div>

                    <div className="glass rounded-xl p-3 border border-primary/10">
                      <p className="text-xs font-mono text-muted-foreground">
                        Password strength: <span className={`${form.password.length >= 8 ? "text-green-400" : "text-amber-400"}`}>{form.password.length >= 12 ? "STRONG" : form.password.length >= 8 ? "MODERATE" : "WEAK"}</span>
                      </p>
                      <div className="flex gap-1 mt-2">
                        {[0, 1, 2, 3].map((bar) => (
                          <div key={bar} className={`h-1 flex-1 rounded-full transition-all duration-300 ${form.password.length > bar * 3 ? "bg-primary/80" : "bg-border/30"}`} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="text-xs font-mono text-primary/70 tracking-widest uppercase block mb-2">Primary Dream Category</label>
                      <div className="grid grid-cols-3 gap-2">
                        {categories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => update("category", category)}
                            data-testid={`button-category-${category.toLowerCase()}`}
                            className={`py-2 px-3 rounded-lg text-xs font-orbitron tracking-wide transition-all duration-200 border ${
                              form.category === category
                                ? "border-primary bg-primary/20 text-primary shadow-[0_0_10px_rgba(140,80,255,0.3)]"
                                : "border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary/70"
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="glass rounded-xl p-3 border border-primary/10">
                      <p className="text-xs font-mono text-muted-foreground/70 leading-relaxed">
                        By creating your account you agree to grant NOX access to your dream patterns for universe generation.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3 mt-6">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    data-testid="button-back"
                    className="flex-1 py-3 rounded-xl border border-border/50 text-muted-foreground hover:border-primary/40 hover:text-primary font-orbitron text-sm transition-all duration-300"
                  >
                    Back
                  </button>
                ) : null}
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
                        <span>Creating your universe...</span>
                      </>
                    ) : step < 2 ? (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Forge Universe</span>
                        <Zap className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </motion.button>
              </div>

              {errorMessage ? (
                <p className="text-xs font-mono text-red-400 mt-3" data-testid="signup-error-message">
                  {errorMessage}
                </p>
              ) : null}

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
