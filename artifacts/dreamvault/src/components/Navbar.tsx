import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, LogIn, UserPlus, Check, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'wouter';

const FAKE_ADDRESS = '7xKp...3nQf';
const FAKE_ADDRESS_FULL = '7xKpLmR9sT2wVbN4cJ6dEuY8aF1qZ3nQf';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setWalletConnected(true);
    }, 1800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(FAKE_ADDRESS_FULL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] as any }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-primary/15 shadow-[0_0_20px_rgba(140,80,255,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/">
          <span className="font-orbitron font-bold text-xl tracking-wider cursor-pointer">
            <span className="gradient-text">DREAM</span>
            <span className="text-muted-foreground">VAULT</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Features', href: '#features' },
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Gallery', href: '#gallery' },
            { label: 'FAQ', href: '#faq' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-foreground/70 hover:text-primary transition-colors duration-200 font-mono tracking-wide"
              data-testid={`nav-link-${item.label}`}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              className="hidden sm:flex text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 font-mono text-sm"
              data-testid="button-nav-login"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </Link>

          <Link href="/signup">
            <Button
              className="hidden sm:flex bg-primary/15 border border-primary/40 hover:bg-primary/25 hover:border-primary/70 text-primary transition-all duration-300 font-orbitron text-xs tracking-wide"
              data-testid="button-nav-signup"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </Link>

          <AnimatePresence mode="wait">
            {!walletConnected ? (
              <motion.div key="connect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button
                  variant="outline"
                  onClick={handleConnect}
                  disabled={connecting}
                  className="hidden lg:flex border-primary/30 hover:border-primary hover:bg-primary/10 text-primary transition-all duration-300 font-orbitron text-xs tracking-wide min-w-[160px]"
                  data-testid="button-connect-wallet"
                  style={connecting ? {} : {}}
                >
                  {connecting ? (
                    <>
                      <div className="w-3.5 h-3.5 border border-primary/40 border-t-primary rounded-full animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="connected"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden lg:flex"
              >
                <button
                  onClick={handleCopy}
                  data-testid="button-wallet-address"
                  className="glass flex items-center gap-2 px-3 py-2 rounded-xl border border-green-500/30 hover:border-green-400/50 transition-all duration-300 group"
                  style={{ boxShadow: '0 0 12px rgba(34,197,94,0.12)' }}
                >
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 animate-ping opacity-60" />
                  </div>
                  <span className="text-xs font-mono text-green-400">{FAKE_ADDRESS}</span>
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check className="w-3 h-3 text-green-400" />
                      </motion.div>
                    ) : (
                      <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Copy className="w-3 h-3 text-muted-foreground group-hover:text-green-400 transition-colors" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}
