import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

const categories = ["Fantasy", "Sci-Fi", "Horror", "Abstract", "Mythological", "Cosmic"];

const loadingPhases = [
  { message: "Scanning subconscious patterns...", progress: 10 },
  { message: "Interpreting dream fragments...", progress: 35 },
  { message: "Building subconscious topology...", progress: 60 },
  { message: "Synchronizing neural architecture...", progress: 85 },
  { message: "Universe stabilized.", progress: 100 },
];

interface DreamGeneratorProps {
  onGenerateStart: (text: string, category: string) => void;
  onGenerateComplete: () => void;
}

export function DreamGenerator({ onGenerateStart, onGenerateComplete }: DreamGeneratorProps) {
  const [dreamText, setDreamText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Sci-Fi');
  const [isGenerating, setIsGenerating] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) return;

    let currentPhase = 0;
    const advance = () => {
      if (currentPhase < loadingPhases.length - 1) {
        currentPhase++;
        setPhaseIndex(currentPhase);
        const delay = currentPhase === loadingPhases.length - 1 ? 1000 : 1300;
        setTimeout(advance, delay);
      } else {
        setTimeout(() => {
          setIsGenerating(false);
          setPhaseIndex(0);
          onGenerateComplete();
        }, 800);
      }
    };
    const t = setTimeout(advance, 900);
    return () => clearTimeout(t);
  }, [isGenerating, onGenerateComplete]);

  const handleGenerate = () => {
    if (!dreamText.trim()) return;
    setPhaseIndex(0);
    setIsGenerating(true);
    onGenerateStart(dreamText, selectedCategory);
  };

  const phase = loadingPhases[phaseIndex];

  return (
    <section id="generate" className="py-24 relative z-10">
      <div className="container max-w-4xl mx-auto px-6">
        <div
          className="glass p-8 md:p-12 rounded-3xl border border-primary/20 relative overflow-hidden"
          style={{ boxShadow: '0 0 50px rgba(140,80,255,0.06)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-secondary/4 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 relative z-10"
          >
            <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-3 gradient-text">GENERATE YOUR DREAM UNIVERSE</h2>
            <p className="text-muted-foreground">Describe any dream, vision, or subconscious fragment...</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!isGenerating ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-7 relative z-10"
              >
                <Textarea
                  placeholder="Describe your dream... I saw endless violet skies with towers of crystal dissolving into golden rain..."
                  className="min-h-[200px] bg-background/40 border-primary/30 focus:border-primary focus:ring-primary/30 resize-none text-base p-6 rounded-2xl placeholder:text-muted-foreground/40 transition-all duration-300"
                  style={{ boxShadow: '0 0 0 0 rgba(140,80,255,0)' }}
                  value={dreamText}
                  onChange={(e) => setDreamText(e.target.value)}
                  data-testid="input-dream-text"
                />

                <div>
                  <label className="block text-xs font-orbitron text-muted-foreground mb-4 uppercase tracking-widest">
                    Dream Category
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        data-testid={`button-category-${cat}`}
                        className={`px-5 py-2 rounded-full text-sm font-orbitron font-medium transition-all duration-300 border ${
                          selectedCategory === cat
                            ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(140,80,255,0.3)]'
                            : 'glass border-primary/10 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={handleGenerate}
                  disabled={!dreamText.trim()}
                  data-testid="button-generate-submit"
                  className="w-full h-16 font-orbitron font-bold text-lg text-white rounded-2xl relative overflow-hidden group disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5, #7c3aed)', backgroundSize: '200% 100%' }}
                  whileHover={dreamText.trim() ? { scale: 1.01 } : {}}
                  whileTap={dreamText.trim() ? { scale: 0.99 } : {}}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(135deg, #9333ea, #6366f1)' }}
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.05)' }}
                  />
                  <span className="relative z-10 group-hover:tracking-widest transition-all duration-300">
                    GENERATE UNIVERSE
                  </span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-16 gap-10 min-h-[380px]"
              >
                <div className="relative">
                  <div className="w-28 h-28 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin" />
                  <div className="absolute -inset-5 rounded-full border border-secondary/20 border-b-secondary animate-[spin_3s_linear_infinite_reverse]" />
                  <div className="absolute -inset-10 rounded-full border border-primary/10 animate-[spin_6s_linear_infinite]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src="/assets/universes/loading.svg" alt="loading" className="w-12 h-12 opacity-90" />
                  </div>
                </div>

                <div className="w-full max-w-sm space-y-3 text-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={phaseIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`font-orbitron text-lg neon-text ${phase.progress === 100 ? 'text-green-400' : 'text-primary'}`}
                    >
                      {phase.message}
                    </motion.p>
                  </AnimatePresence>

                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #7c3aed, #3b82f6)' }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${phase.progress}%` }}
                      transition={{ duration: 0.8, ease: [0, 0, 0.2, 1] as any }}
                    />
                  </div>
                  <p className="text-xs font-mono text-muted-foreground/50">{phase.progress}% complete</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
