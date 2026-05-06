import { motion } from 'framer-motion';
import { BrainCircuit, Coins, Sparkles, Network, Bot, GalleryHorizontalEnd } from 'lucide-react';

const features = [
  {
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    title: "Neural Dream Mapping",
    description: "AI scans subconscious signals to reconstruct your exact dream topology into digital space."
  },
  {
    icon: <Coins className="w-8 h-8 text-secondary" />,
    title: "Solana-Powered Ownership",
    description: "Each dream universe is minted as a unique NFT on Solana's lightning-fast blockchain."
  },
  {
    icon: <Sparkles className="w-8 h-8 text-accent" />,
    title: "Living Universes",
    description: "Your dreams evolve over time, gaining new layers of lore and structural complexity."
  },
  {
    icon: <Network className="w-8 h-8 text-primary" />,
    title: "Inter-Dream Portals",
    description: "Connect with other dreamers whose universes intersect with your subconscious themes."
  },
  {
    icon: <Bot className="w-8 h-8 text-secondary" />,
    title: "NOX AI Guide",
    description: "Your personal AI spirit guide navigates and enriches your generated dreamscape."
  },
  {
    icon: <GalleryHorizontalEnd className="w-8 h-8 text-accent" />,
    title: "Community Gallery",
    description: "Explore thousands of generated dream universes from dreamers around the world."
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-4 gradient-text">SYSTEM CAPABILITIES</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">The architecture powering the next evolution of digital consciousness.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors duration-300 group"
            >
              <div className="mb-6 p-4 rounded-full bg-white/5 inline-block group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="font-orbitron font-semibold text-xl mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
