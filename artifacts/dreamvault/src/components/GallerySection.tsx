import { motion } from 'framer-motion';
import { Button } from './ui/button';

const galleryItems = [
  {
    title: "Neon Labyrinth of Echoes",
    creator: "0x1A2b...F9c3",
    rarity: "LEGENDARY",
    rarityColor: "text-amber-400 border-amber-400/50 bg-amber-400/10",
    price: "2.4 SOL",
    bgClass: "from-fuchsia-900 via-purple-900 to-black"
  },
  {
    title: "The Quantum Tide",
    creator: "0x8F4d...E2a1",
    rarity: "EPIC",
    rarityColor: "text-purple-400 border-purple-400/50 bg-purple-400/10",
    price: "1.8 SOL",
    bgClass: "from-blue-900 via-teal-900 to-black"
  },
  {
    title: "Shattered Monoliths",
    creator: "0x3C9e...B7d5",
    rarity: "RARE",
    rarityColor: "text-blue-400 border-blue-400/50 bg-blue-400/10",
    price: "0.9 SOL",
    bgClass: "from-rose-900 via-slate-900 to-black"
  },
  {
    title: "Crimson Horizon Protocol",
    creator: "0x9E2a...C4f8",
    rarity: "EPIC",
    rarityColor: "text-purple-400 border-purple-400/50 bg-purple-400/10",
    price: "1.5 SOL",
    bgClass: "from-red-900 via-orange-900 to-black"
  },
  {
    title: "Astral Canopy",
    creator: "0x5D1b...A3e9",
    rarity: "RARE",
    rarityColor: "text-blue-400 border-blue-400/50 bg-blue-400/10",
    price: "0.7 SOL",
    bgClass: "from-indigo-900 via-cyan-900 to-black"
  },
  {
    title: "Chronos Fracture",
    creator: "0x7A4c...D8b2",
    rarity: "LEGENDARY",
    rarityColor: "text-amber-400 border-amber-400/50 bg-amber-400/10",
    price: "3.2 SOL",
    bgClass: "from-emerald-900 via-violet-900 to-black"
  }
];

export function GallerySection() {
  return (
    <section id="gallery" className="py-24 relative z-10 bg-black/60">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div>
            <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-2 gradient-text">COMMUNITY GALLERY</h2>
            <p className="text-muted-foreground">Explore universes forged from collective subconscious.</p>
          </div>
          <Button variant="outline" className="glass border-primary/30">View All Universes</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl border border-white/10 overflow-hidden group hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(140,80,255,0.2)]"
            >
              <div className={`h-48 w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${item.bgClass} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />
                <div className="absolute top-4 right-4">
                  <span className={`text-[10px] font-bold font-orbitron px-2 py-1 rounded border ${item.rarityColor}`}>
                    {item.rarity}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-orbitron font-semibold text-lg mb-1 truncate">{item.title}</h3>
                <div className="flex justify-between items-center mb-6 text-sm">
                  <span className="text-muted-foreground font-mono truncate mr-4">By {item.creator}</span>
                  <span className="text-primary font-mono font-bold whitespace-nowrap">{item.price}</span>
                </div>
                <Button className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-colors">
                  View Universe
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
