import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { preloadImage } from '@/lib/revealUtils';

interface RevealModalProps {
  open: boolean;
  onComplete: () => void;
  title?: string;
  imageSrc?: string;
  lore?: string;
  rarity?: string;
}

export function RevealModal({ open, onComplete, title = 'THE QUANTUM CATHEDRAL', imageSrc = '/assets/universes/reveal.jpg', lore = '', rarity = 'LEGENDARY' }: RevealModalProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!open) return;
    // preload image then play a generated swell via WebAudio
    preloadImage(imageSrc)
      .then(() => {
        if (!mounted) return;
        setReady(true);
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(220, ctx.currentTime);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 0.6);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.9);
          audioRef.current = null as any;
        } catch (e) {
          // ignore audio on unsupported environments
        }
      })
      .catch(() => setReady(true));

    const t = setTimeout(() => onComplete(), 2200);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [open, imageSrc, onComplete]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-4xl w-[92%] mx-auto p-6 md:p-8"
          >
            <div className="relative rounded-2xl overflow-hidden border border-primary/20 glass" style={{ boxShadow: '0 0 80px rgba(124,58,237,0.12)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />

              <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8 items-center">
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9 }}
                  className="rounded-xl overflow-hidden bg-black/20 border border-white/5"
                >
                  <img src={imageSrc} alt={title} className="w-full h-72 md:h-[420px] object-cover" />
                </motion.div>

                <div className="text-left">
                  <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }} className="font-orbitron text-3xl md:text-4xl gradient-text mb-2">
                    {title}
                  </motion.h2>

                  <motion.p initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }} className="text-muted-foreground italic mb-4">
                    {lore}
                  </motion.p>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border font-orbitron font-bold tracking-wider text-sm" style={{ boxShadow: '0 0 20px rgba(245,158,11,0.08)' }}>
                      <span className="text-amber-400">{rarity}</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">A universe forged from your subconscious</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default RevealModal;
