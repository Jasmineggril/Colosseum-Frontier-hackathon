import { useEffect, useState } from 'react';

const initialActivities = [
  { action: 'generated', dream: 'Void Spiral', user: '0xA3f1...B2', time: '2s ago' },
  { action: 'minted', dream: 'Solar Wraith', user: '0x4D8e...C9', time: '14s ago' },
  { action: 'sold', dream: 'Echo Labyrinth', user: '0xF2b7...E5', time: '31s ago' },
  { action: 'generated', dream: 'Crimson Veil', user: '0x1A9c...D3', time: '45s ago' },
];

export function ActivityFeed() {
  const [activities, setActivities] = useState(initialActivities);

  useEffect(() => {
    const t = setInterval(() => {
      // rotate fake activity feed
      setActivities((prev) => {
        const next = prev.slice();
        next.unshift({ action: ['generated','minted','sold'][Math.floor(Math.random()*3)], dream: ['Quantum Shore','Neon Tides','Crimson Overmind'][Math.floor(Math.random()*3)], user: `0x${Math.random().toString(16).slice(2,8)}`, time: 'just now' });
        return next.slice(0, 6);
      });
    }, 4000 + Math.random()*3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="glass rounded-2xl border border-primary/20 p-4 w-full max-w-sm">
      <h4 className="font-orbitron text-sm text-primary mb-3">Activity Feed</h4>
      <ul className="space-y-3 text-xs text-muted-foreground">
        {activities.map((a, i) => (
          <li key={i} className="flex items-center justify-between">
            <div>
              <div className="text-foreground font-mono">{a.user}</div>
              <div className="text-muted-foreground/70">{a.action} "<span className="text-primary">{a.dream}</span>"</div>
            </div>
            <div className="text-[11px] text-muted-foreground">{a.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityFeed;
