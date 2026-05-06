import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "This is the most immersive Web3 experience I've ever had. My dream universe has over 300 visitors already.",
    author: "CryptoVisionary.sol",
    color: "from-blue-500 to-cyan-500"
  },
  {
    quote: "NOX guided me through a dream I'd had for years. Seeing it rendered as a living universe changed how I think about consciousness.",
    author: "DreamArchitect.sol",
    color: "from-purple-500 to-pink-500"
  },
  {
    quote: "The detail and lore generation is unreal. I minted my first dream NFT and it sold for 15 SOL in 2 hours.",
    author: "NebulaWalker.sol",
    color: "from-amber-500 to-orange-500"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-4 gradient-text">DREAMER LOGS</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 rounded-2xl border border-white/5 flex flex-col justify-between"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/90 italic leading-relaxed mb-8 flex-grow">
                "{item.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} shadow-lg`} />
                <span className="font-mono text-sm text-muted-foreground">{item.author}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
