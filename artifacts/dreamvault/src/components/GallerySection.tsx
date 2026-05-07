import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Heart, Eye, TrendingUp, Zap } from 'lucide-react';
import { Button } from './ui/button';
import HoverParallax from './HoverParallax';

const galleryItems = [
  { title: "Neon Labyrinth of Echoes", creator: "0x1A2b...F9c3", rarity: "LEGENDARY", rarityColor: "text-amber-400", borderColor: "border-amber-400/40", glowColor: "rgba(245,158,11,0.25)", price: "2.4 SOL", bg: "from-fuchsia-900 via-purple-950 to-black", likes: 847, views: 12400 },
  { title: "The Quantum Tide", creator: "0x8F4d...E2a1", rarity: "EPIC", rarityColor: "text-purple-400", borderColor: "border-purple-400/40", glowColor: "rgba(168,85,247,0.2)", price: "1.8 SOL", bg: "from-blue-900 via-teal-950 to-black", likes: 412, views: 6800 },
  { title: "Shattered Monoliths", creator: "0x3C9e...B7d5", rarity: "RARE", rarityColor: "text-blue-400", borderColor: "border-blue-400/30", glowColor: "rgba(96,165,250,0.15)", price: "0.9 SOL", bg: "from-rose-900 via-slate-950 to-black", likes: 203, views: 3200 },
  { title: "Crimson Horizon Protocol", creator: "0x9E2a...C4f8", rarity: "EPIC", rarityColor: "text-purple-400", borderColor: "border-purple-400/40", glowColor: "rgba(168,85,247,0.2)", price: "1.5 SOL", bg: "from-red-900 via-orange-950 to-black", likes: 531, views: 9100 },
  { title: "Astral Canopy", creator: "0x5D1b...A3e9", rarity: "RARE", rarityColor: "text-blue-400", borderColor: "border-blue-400/30", glowColor: "rgba(96,165,250,0.15)", price: "0.7 SOL", bg: "from-indigo-900 via-cyan-950 to-black", likes: 178, views: 2700 },
  { title: "Chronos Fracture", creator: "0x7A4c...D8b2", rarity: "LEGENDARY", rarityColor: "text-amber-400", borderColor: "border-amber-400/40", glowColor: "rgba(245,158,11,0.25)", price: "3.2 SOL", bg: "from-emerald-900 via-violet-950 to-black", likes: 1203, views: 18900 },
];

const liveActivities = [
  { action: "minted", dream: "Void Spiral", user: "0xA3f1...B2", time: "2s ago" },
  { action: "sold", dream: "Solar Wraith", user: "0x4D8e...C9", time: "14s ago" },
  { action: "generated", dream: "Echo Labyrinth", user: "0xF2b7...E5", time: "31s ago" },
  { action: "minted", dream: "Crimson Veil", user: "0x1A9c...D3", time: "45s ago" },
  { action: "sold", dream: "Quantum Shore", user: "0x7B3f...A8", time: "1m ago" },
];

export function GallerySection() {
  const [activityIndex, setActivityIndex] = useState(0);
  const [onlineCount, setOnlineCount] = useState(742);
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex(prev => (prev + 1) % liveActivities.length);
      setOnlineCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleLike = (i: number) => {
    setLikedItems(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const activity = liveActivities[activityIndex];

  return (
    <section id="gallery" className="py-24 relative z-10 bg-black/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="font-orbitron font-bold text-3xl md:text-4xl gradient-text mb-2">COMMUNITY GALLERY</h2>
            <p className="text-muted-foreground">Universes forged from the collective subconscious.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="glass px-4 py-2 rounded-xl border border-primary/20 flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 animate-ping opacity-50" />
              </div>
              <span className="text-xs font-mono text-muted-foreground"><strong className="text-foreground">{onlineCount}</strong> dreamers online</span>
            </div>
            <Button variant="outline" className="glass border-primary/30 hover:border-primary/60" data-testid="button-view-all">
              View All
            </Button>
          </div>
        </div>

        <motion.div
          key={activityIndex}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mb-8 px-4 py-3 rounded-xl border border-primary/15 flex items-center gap-3"
        >
          <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-xs font-mono text-muted-foreground">
            <strong className="text-foreground">{activity.user}</strong>{' '}
            <span className={activity.action === 'sold' ? 'text-amber-400' : activity.action === 'minted' ? 'text-green-400' : 'text-primary'}>
              {activity.action}
            </span>{' '}
            <strong className="text-foreground/80">"{activity.dream}"</strong>
            <span className="text-muted-foreground/50 ml-2">{activity.time}</span>
          </span>
          <TrendingUp className="w-3 h-3 text-primary/50 ml-auto shrink-0" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, i) => (
            <HoverParallax key={i}>
              <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08 }}
              className={`glass rounded-2xl border ${item.borderColor} overflow-hidden group transition-all duration-500`}
              style={{ boxShadow: `0 0 0 rgba(0,0,0,0)` }}
              whileHover={{ boxShadow: `0 8px 40px ${item.glowColor}` }}
            >
              <div className={`h-48 w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${item.bg} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wOCIvPjwvc3ZnPg==')]" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="glass px-3 py-1.5 rounded-lg border border-white/20 text-xs font-mono text-white/70">AI ARTWORK</div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-bold font-orbitron px-2 py-1 rounded-md border ${item.borderColor} ${item.rarityColor} bg-black/40`}>
                    {item.rarity}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <Eye className="w-3 h-3 text-white/40" />
                  <span className="text-[10px] font-mono text-white/40">{(item.views / 1000).toFixed(1)}K</span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-orbitron font-semibold text-base mb-1 truncate">{item.title}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground font-mono text-xs truncate mr-4">by {item.creator}</span>
                  <span className={`font-mono text-sm font-bold ${item.rarityColor}`}>{item.price}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 hover:border-primary/60 transition-all text-xs h-9 rounded-xl"
                    data-testid={`button-view-universe-${i}`}
                  >
                    View Universe
                  </Button>
                  <button
                    onClick={() => toggleLike(i)}
                    data-testid={`button-like-${i}`}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 ${
                      likedItems.has(i) ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'glass border-white/10 text-muted-foreground hover:text-rose-400 hover:border-rose-500/30'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedItems.has(i) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <p className="text-center text-[10px] font-mono text-muted-foreground/50 mt-2">
                  {item.likes + (likedItems.has(i) ? 1 : 0)} likes
                </p>
              </div>
              </motion.div>
            </HoverParallax>
          ))}
        </div>
      </div>
    </section>
  );
}
