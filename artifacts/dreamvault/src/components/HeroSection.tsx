import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useEffect, useRef } from 'react';

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 30;
      const y = (clientY / innerHeight - 0.5) * 30;
      const orb1 = el.querySelector<HTMLElement>('.hero-orb-1');
      const orb2 = el.querySelector<HTMLElement>('.hero-orb-2');
      const orb3 = el.querySelector<HTMLElement>('.hero-orb-3');
      if (orb1) orb1.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
      if (orb2) orb2.style.transform = `translate(${-x * 0.4}px, ${-y * 0.4}px)`;
      if (orb3) orb3.style.transform = `translate(${x * 0.8}px, ${-y * 0.3}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as any },
    },
  };

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="hero-orb-1 absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[130px] mix-blend-screen transition-transform duration-700 ease-out" />
        <div className="hero-orb-2 absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-secondary/12 rounded-full blur-[160px] mix-blend-screen transition-transform duration-700 ease-out" />
        <div className="hero-orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] mix-blend-screen transition-transform duration-700 ease-out" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_hsl(220,30%,4%)_80%)]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container relative z-10 px-6 text-center flex flex-col items-center"
      >
        <motion.span
          variants={itemVariants}
          className="text-primary font-orbitron text-xs sm:text-sm tracking-[0.35em] uppercase mb-8 neon-text block"
        >
          Powered by Solana AI
        </motion.span>

        <motion.h1
          variants={itemVariants}
          className="font-orbitron font-black leading-tight mb-8 max-w-5xl"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
        >
          <span className="block gradient-text" style={{ textShadow: '0 0 80px rgba(140,80,255,0.4)' }}>
            Transform your dreams
          </span>
          <span className="block text-foreground/95">into living universes.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
        >
          DreamVault uses next-gen AI to reconstruct your subconscious into interactive digital universes, permanently stored on Solana.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
          <Button
            size="lg"
            className="relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground font-orbitron font-semibold px-10 h-14 rounded-full transition-all duration-300 group"
            style={{ boxShadow: '0 0 30px rgba(140,80,255,0.5), 0 0 60px rgba(140,80,255,0.15)' }}
            onClick={() => document.getElementById('generate')?.scrollIntoView({ behavior: 'smooth' })}
            data-testid="button-generate-dream"
          >
            <span className="relative z-10 group-hover:tracking-widest transition-all duration-300">Generate Dream</span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="glass border-primary/30 hover:bg-primary/10 hover:border-primary/60 font-orbitron px-10 h-14 rounded-full transition-all duration-300"
            onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
            data-testid="button-explore-gallery"
          >
            Explore Gallery
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="glass px-8 py-4 rounded-2xl border border-primary/15"
          style={{ boxShadow: '0 0 20px rgba(140,80,255,0.06)' }}
        >
          <p className="text-sm font-mono text-muted-foreground flex flex-wrap justify-center gap-6">
            <span><strong className="text-foreground font-orbitron">12,847</strong> Dreams Generated</span>
            <span className="hidden sm:inline text-primary/30">|</span>
            <span><strong className="text-foreground font-orbitron">4.2M</strong> SOL Volume</span>
            <span className="hidden sm:inline text-primary/30">|</span>
            <span><strong className="text-foreground font-orbitron">98.7%</strong> Satisfaction</span>
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as any }}
        >
          <span className="text-xs font-mono text-muted-foreground/50 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-primary/40 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
