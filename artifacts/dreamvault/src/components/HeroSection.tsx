import { motion } from 'framer-motion';
import { Button } from './ui/button';

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container relative z-10 px-6 text-center flex flex-col items-center"
      >
        <motion.span
          variants={itemVariants}
          className="text-primary font-orbitron text-sm sm:text-base tracking-[0.3em] uppercase mb-6 neon-text"
        >
          Powered by Solana AI
        </motion.span>

        <motion.h1
          variants={itemVariants}
          className="font-orbitron font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight mb-6 max-w-5xl"
        >
          <span className="block gradient-text neon-glow">Transform your dreams</span>
          <span className="block text-foreground">into living universes.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
        >
          DreamVault uses next-gen AI to reconstruct your subconscious into interactive digital universes, permanently stored on Solana.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-14 rounded-full neon-glow transition-all duration-300"
            onClick={() => document.getElementById('generate')?.scrollIntoView({ behavior: 'smooth' })}
            data-testid="button-generate-dream"
          >
            Generate Dream
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="glass border-primary/30 hover:bg-primary/10 px-8 h-14 rounded-full transition-all duration-300"
            onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
            data-testid="button-explore-gallery"
          >
            Explore Gallery
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-16 glass px-6 py-3 rounded-full border border-primary/20"
        >
          <p className="text-sm font-mono text-muted-foreground flex flex-wrap justify-center gap-4">
            <span><strong className="text-foreground">12,847</strong> Dreams Generated</span>
            <span className="hidden sm:inline text-primary/50">|</span>
            <span><strong className="text-foreground">4.2M</strong> SOL Volume</span>
            <span className="hidden sm:inline text-primary/50">|</span>
            <span><strong className="text-foreground">98.7%</strong> Satisfaction</span>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
