import { motion } from 'framer-motion';
import { Share2, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

export function DreamResult({ onReset }: { onReset: () => void }) {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { staggerChildren: 0.1, duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <section className="py-12 relative z-10">
      <div className="container max-w-5xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="glass p-1 rounded-3xl border border-primary/30 relative overflow-hidden"
        >
          {/* Animated scanline effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_0%,rgba(140,80,255,0.1)_50%,transparent_100%)] h-[200%] w-full animate-scanline opacity-50 z-20 mix-blend-overlay" />
          
          <div className="bg-background/80 p-8 md:p-12 rounded-[22px] relative z-10">
            <motion.div variants={itemVariants} className="flex justify-between items-start mb-8">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest border border-amber-500/50 text-amber-500 bg-amber-500/10 mb-4 neon-glow" style={{ boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)' }}>
                  DREAM CLASSIFIED
                </span>
                <h3 className="font-orbitron font-bold text-3xl md:text-5xl gradient-text mb-2">The Violet Abyss Protocol</h3>
                <p className="text-muted-foreground font-mono text-sm">CATEGORY: COSMIC ODYSSEY</p>
              </div>
              <div className="text-right hidden sm:block">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-amber-400 bg-amber-400/10 mb-1">
                  <span className="font-orbitron font-bold text-amber-400 tracking-wider">LEGENDARY</span>
                </div>
                <p className="text-xs text-muted-foreground">Top 0.3% of all dreams</p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* Artwork */}
              <motion.div variants={itemVariants} className="relative aspect-square md:aspect-auto md:h-full rounded-2xl overflow-hidden border border-primary/20 group">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900 via-[#1a0b2e] to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent mix-blend-screen" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent mix-blend-screen opacity-50 blur-xl" />
                
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />
                
                <div className="absolute bottom-4 left-4 right-4 p-3 glass rounded-xl border border-white/10 backdrop-blur-md flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-mono text-white/70">AI GENERATED ARTWORK</span>
                  <span className="text-xs font-mono text-primary/70">GEN-v4.2</span>
                </div>
              </motion.div>

              {/* Details */}
              <motion.div variants={itemVariants} className="flex flex-col justify-between">
                <div className="mb-8">
                  <h4 className="font-orbitron text-sm text-primary mb-2">LORE FRAGMENT</h4>
                  <p className="text-foreground/80 italic leading-relaxed border-l-2 border-primary/30 pl-4 py-2">
                    "In the abyss between digital and organic, a signal emerged — ancient data crystalized into violet spires stretching beyond the observable matrix. You are the architect of this universe. It remembers you."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Luminosity", value: "94.2%" },
                    { label: "Entropy Index", value: "0.73" },
                    { label: "Consciousness Level", value: "Transcendent" },
                    { label: "Universe Age", value: "2.3B cycles" },
                    { label: "Dimension Class", value: "Hyperspatial" },
                    { label: "Reality Anchor", value: "Quantum" },
                  ].map((stat, i) => (
                    <div key={i} className="glass p-3 rounded-xl border border-white/5 flex flex-col justify-center">
                      <span className="text-[10px] uppercase text-muted-foreground mb-1">{stat.label}</span>
                      <span className="font-mono text-sm text-foreground">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-white/10">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold h-14 px-8 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300 transform hover:scale-[1.02]"
                data-testid="button-mint-nft"
              >
                MINT DREAM NFT
              </Button>
              <div className="flex w-full sm:w-auto gap-4">
                <Button variant="outline" size="lg" className="flex-1 glass border-white/20 h-14 rounded-xl" data-testid="button-share-dream">
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
                <Button variant="outline" size="lg" className="flex-1 glass border-white/20 h-14 rounded-xl" onClick={onReset} data-testid="button-regenerate">
                  <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
                </Button>
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-auto mt-4 sm:mt-0">EST COST: 0.002 SOL</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
