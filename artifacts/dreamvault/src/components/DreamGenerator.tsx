import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

const categories = ["Fantasy", "Sci-Fi", "Horror", "Abstract", "Mythological", "Cosmic"];
const loadingMessages = [
  "Interpreting subconscious signals...",
  "Mapping dream fragments...",
  "Calibrating neural pathways...",
  "Generating universe matrix...",
  "Crystallizing dreamscape..."
];

export function DreamGenerator({ onGenerateComplete }: { onGenerateComplete: () => void }) {
  const [dreamText, setDreamText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Sci-Fi");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;
    
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);

      timeout = setTimeout(() => {
        setIsGenerating(false);
        onGenerateComplete();
      }, 7500);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isGenerating, onGenerateComplete]);

  return (
    <section id="generate" className="py-24 relative z-10">
      <div className="container max-w-4xl mx-auto px-6">
        <div className="glass p-8 md:p-12 rounded-3xl border border-primary/20 shadow-[0_0_40px_rgba(140,80,255,0.05)] relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-4 gradient-text">GENERATE YOUR DREAM UNIVERSE</h2>
            <p className="text-muted-foreground text-lg">Describe any dream, vision, or subconscious fragment...</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!isGenerating ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8 relative z-10"
              >
                <div>
                  <Textarea
                    placeholder="Describe your dream... I saw endless violet skies with towers of crystal dissolving into golden rain..."
                    className="min-h-[200px] glass bg-background/40 border-primary/30 focus:border-primary focus:ring-primary/50 resize-none text-lg p-6 rounded-2xl"
                    value={dreamText}
                    onChange={(e) => setDreamText(e.target.value)}
                    data-testid="input-dream-text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider font-orbitron">Select Category</label>
                  <div className="flex flex-wrap gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                          selectedCategory === cat
                            ? 'bg-primary/20 border-primary text-primary neon-glow'
                            : 'glass border-primary/10 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                        }`}
                        data-testid={`button-category-${cat}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full h-16 text-lg font-orbitron font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl neon-glow transition-all duration-300 group"
                  onClick={() => dreamText.trim() && setIsGenerating(true)}
                  disabled={!dreamText.trim()}
                  data-testid="button-generate-submit"
                >
                  <span className="group-hover:tracking-widest transition-all duration-300">GENERATE UNIVERSE</span>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-12 min-h-[400px]"
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                  </div>
                  {/* Additional rings */}
                  <div className="absolute -inset-4 rounded-full border border-secondary/30 border-b-secondary animate-[spin_3s_linear_infinite_reverse]" />
                </div>
                <motion.p
                  key={loadingIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="font-orbitron text-xl text-primary neon-text h-8"
                >
                  {loadingMessages[loadingIndex]}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
