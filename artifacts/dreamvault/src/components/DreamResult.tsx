import { motion, AnimatePresence } from 'framer-motion';
import { Share2, RefreshCw, Sparkles, Check, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface DreamResultProps {
  onReset: () => void;
  dreamText?: string;
  category?: string;
}

const dreamData = [
  {
    title: "The Violet Abyss Protocol",
    category: "COSMIC ODYSSEY",
    lore: "In the abyss between digital and organic, a signal emerged — ancient data crystalized into violet spires stretching beyond the observable matrix. You are the architect of this universe. It remembers you.",
    rarity: "LEGENDARY",
    rarityColor: "text-amber-400 border-amber-400 bg-amber-400/10",
    rarityGlow: "rgba(245,158,11,0.4)",
    topPercent: "0.3",
    artwork: "from-purple-900 via-[#1a0b2e] to-[#050010]",
    artworkAccent: "from-blue-900/50",
    traits: [
      { label: "Luminosity", value: "94.2%" },
      { label: "Entropy Index", value: "0.73" },
      { label: "Consciousness Level", value: "Transcendent" },
      { label: "Universe Age", value: "2.3B cycles" },
      { label: "Dimension Class", value: "Hyperspatial" },
      { label: "Reality Anchor", value: "Quantum" },
    ],
  },
  {
    title: "Shattered Monolith Dream",
    category: "ABSTRACT REALM",
    lore: "Fragments of a collapsed reality reassemble every cycle — stone giants that once held the sky now drift through a liquid cosmos. Their silence is a language only dreamers can decipher.",
    rarity: "EPIC",
    rarityColor: "text-purple-400 border-purple-400 bg-purple-400/10",
    rarityGlow: "rgba(168,85,247,0.4)",
    topPercent: "2.1",
    artwork: "from-slate-900 via-rose-950 to-[#050010]",
    artworkAccent: "from-orange-900/40",
    traits: [
      { label: "Luminosity", value: "78.5%" },
      { label: "Entropy Index", value: "1.21" },
      { label: "Consciousness Level", value: "Fractured" },
      { label: "Universe Age", value: "847M cycles" },
      { label: "Dimension Class", value: "Liminal" },
      { label: "Reality Anchor", value: "Crystalline" },
    ],
  },
  {
    title: "Neon Tides of the Void",
    category: "SCI-FI EXPANSE",
    lore: "A sea without a floor, glowing in frequencies beyond human perception — ships made of memory sail these waters, carrying versions of yourself that chose different paths.",
    rarity: "RARE",
    rarityColor: "text-blue-400 border-blue-400 bg-blue-400/10",
    rarityGlow: "rgba(96,165,250,0.4)",
    topPercent: "8.4",
    artwork: "from-blue-950 via-teal-900 to-[#050010]",
    artworkAccent: "from-cyan-800/40",
    traits: [
      { label: "Luminosity", value: "65.8%" },
      { label: "Entropy Index", value: "0.44" },
      { label: "Consciousness Level", value: "Resonant" },
      { label: "Universe Age", value: "4.1B cycles" },
      { label: "Dimension Class", value: "Oceanic" },
      { label: "Reality Anchor", value: "Fluid" },
    ],
  },
  {
    title: "The Crimson Overmind",
    category: "MYTHOLOGICAL RIFT",
    lore: "An ancient intelligence predating the universe itself — it speaks in colors and breathes in echoes. To dream of it is to be seen by something eternal.",
    rarity: "LEGENDARY",
    rarityColor: "text-amber-400 border-amber-400 bg-amber-400/10",
    rarityGlow: "rgba(245,158,11,0.4)",
    topPercent: "0.1",
    artwork: "from-red-950 via-orange-950 to-[#050010]",
    artworkAccent: "from-red-700/40",
    traits: [
      { label: "Luminosity", value: "99.1%" },
      { label: "Entropy Index", value: "2.77" },
      { label: "Consciousness Level", value: "Omniscient" },
      { label: "Universe Age", value: "∞ cycles" },
      { label: "Dimension Class", value: "Primordial" },
      { label: "Reality Anchor", value: "Absolute" },
    ],
  },
];

export function DreamResult({ onReset, dreamText = "", category = "" }: DreamResultProps) {
  const [mintState, setMintState] = useState<'idle' | 'minting' | 'minted'>('idle');
  const [txHash] = useState(`${Math.random().toString(36).slice(2, 6)}...${Math.random().toString(36).slice(2, 6)}`);

  const seed = (dreamText.length + category.length) % dreamData.length;
  const dream = dreamData[seed];

  const handleMint = () => {
    setMintState('minting');
    setTimeout(() => setMintState('minted'), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.08, duration: 0.4 } },
  };
  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-12 relative z-10">
      <div className="container max-w-5xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="glass rounded-3xl border border-primary/30 relative overflow-hidden"
          style={{ boxShadow: '0 0 60px rgba(140,80,255,0.12)' }}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(140,80,255,0.08)_50%,transparent_100%)] h-[200%] w-full animate-scanline mix-blend-overlay" />
          </div>

          <div className="relative z-10 p-8 md:p-12">
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest border border-amber-500/50 text-amber-400 bg-amber-500/10 mb-4 font-orbitron">
                  DREAM CLASSIFIED
                </span>
                <h3 className="font-orbitron font-black gradient-text mb-2" style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}>
                  {dream.title}
                </h3>
                <p className="text-muted-foreground font-mono text-sm tracking-wider">CATEGORY: {dream.category}</p>
              </div>
              <div className="text-right shrink-0">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-orbitron font-bold tracking-wider text-sm mb-1 ${dream.rarityColor}`}
                  style={{ boxShadow: `0 0 20px ${dream.rarityGlow}` }}
                >
                  <Sparkles className="w-4 h-4" />
                  {dream.rarity}
                </div>
                <p className="text-xs text-muted-foreground font-mono">Top {dream.topPercent}% of all dreams</p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <motion.div variants={itemVariants} className={`relative rounded-2xl overflow-hidden border border-primary/20 group`} style={{ minHeight: '280px' }}>
                <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] ${dream.artwork}`} />
                <div className={`absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] ${dream.artworkAccent} via-transparent to-transparent mix-blend-screen`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center)] from-white/5 via-transparent to-transparent mix-blend-screen blur-2xl opacity-60" />
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center" style={{ background: 'radial-gradient(circle, rgba(140,80,255,0.3), transparent)' }}>
                    <div className="w-8 h-8 rounded-full bg-primary/40 blur-sm animate-pulse" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-mono text-white/60 glass px-2 py-1 rounded-lg">AI GENERATED ARTWORK</span>
                  <span className="text-xs font-mono text-primary/60 glass px-2 py-1 rounded-lg">GEN-v4.2</span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col justify-between gap-6">
                <div>
                  <h4 className="font-orbitron text-xs text-primary tracking-widest mb-3">LORE FRAGMENT</h4>
                  <p className="text-foreground/80 italic leading-relaxed border-l-2 border-primary/40 pl-4 py-1 text-sm">
                    "{dream.lore}"
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {dream.traits.map((stat, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className="glass p-3 rounded-xl border border-white/5 hover:border-primary/20 transition-colors duration-300"
                    >
                      <span className="text-[10px] uppercase text-muted-foreground tracking-wider block mb-1">{stat.label}</span>
                      <span className="font-mono text-sm text-foreground font-medium">{stat.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="pt-6 border-t border-white/8">
              <AnimatePresence mode="wait">
                {mintState === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col sm:flex-row items-center gap-4"
                  >
                    <Button
                      size="lg"
                      onClick={handleMint}
                      data-testid="button-mint-nft"
                      className="w-full sm:w-auto font-orbitron font-bold h-14 px-8 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                      style={{ background: 'linear-gradient(135deg, #d97706, #b45309)', boxShadow: '0 0 30px rgba(245,158,11,0.35)' }}
                    >
                      MINT DREAM NFT
                    </Button>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Button variant="outline" size="lg" className="flex-1 glass border-white/15 h-14 rounded-xl hover:border-primary/30" data-testid="button-share-dream">
                        <Share2 className="w-4 h-4 mr-2" /> Share
                      </Button>
                      <Button variant="outline" size="lg" className="flex-1 glass border-white/15 h-14 rounded-xl hover:border-primary/30" onClick={onReset} data-testid="button-regenerate">
                        <RefreshCw className="w-4 h-4 mr-2" /> Retry
                      </Button>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono sm:ml-auto whitespace-nowrap">EST: 0.002 SOL</span>
                  </motion.div>
                )}
                {mintState === 'minting' && (
                  <motion.div key="minting" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center py-4 gap-4"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-amber-400/60 animate-pulse" />
                      </div>
                    </div>
                    <p className="font-orbitron text-amber-400 text-sm animate-pulse tracking-widest">MINTING TO SOLANA...</p>
                    <p className="font-mono text-xs text-muted-foreground">Broadcasting transaction to devnet</p>
                  </motion.div>
                )}
                {mintState === 'minted' && (
                  <motion.div key="minted" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 glass p-4 rounded-2xl border border-green-500/30"
                    style={{ boxShadow: '0 0 20px rgba(34,197,94,0.15)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-orbitron text-green-400 text-sm font-bold">UNIVERSE MINTED</p>
                        <p className="font-mono text-xs text-muted-foreground">Permanently stored on Solana</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground font-mono">Transaction</p>
                        <p className="font-mono text-xs text-primary">{txHash}</p>
                      </div>
                      <Button variant="outline" size="sm" className="glass border-green-500/30 text-green-400 hover:border-green-400/50 rounded-xl" data-testid="button-view-tx">
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Explorer
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
