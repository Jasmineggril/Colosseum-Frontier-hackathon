import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, LogIn, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'wouter';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-primary/20 shadow-[0_0_15px_rgba(140,80,255,0.1)]' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-orbitron font-bold text-2xl tracking-wider">
            <span className="gradient-text">DREAM</span>
            <span className="text-muted-foreground">VAULT</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How It Works', 'Gallery', 'FAQ'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm text-foreground/80 hover:text-primary transition-colors hover:neon-text"
              data-testid={`nav-link-${item}`}
            >
              {item}
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
              className="hidden sm:flex bg-primary/20 border border-primary/40 hover:bg-primary/30 hover:border-primary/70 text-primary hover:shadow-[0_0_15px_rgba(140,80,255,0.3)] transition-all duration-300 font-orbitron text-xs tracking-wide"
              data-testid="button-nav-signup"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </Link>
          <Button
            variant="outline"
            className="hidden lg:flex border-primary/30 hover:border-primary hover:bg-primary/10 text-primary transition-all duration-300"
            data-testid="button-connect-wallet"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
