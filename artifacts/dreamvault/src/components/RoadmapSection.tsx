export default function RoadmapSection() {
  const items = [
    { quarter: 'Q2 2026', text: 'Cinematic reveal + onboarding' },
    { quarter: 'Q3 2026', text: 'AI image pipeline integration' },
    { quarter: 'Q4 2026', text: 'Minting flow & marketplace' },
  ];

  return (
    <section id="roadmap" className="py-16">
      <div className="container mx-auto px-6">
        <h3 className="font-orbitron text-2xl text-primary mb-6">Roadmap</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it) => (
            <div key={it.quarter} className="glass p-4 rounded-2xl border border-primary/10">
              <div className="text-sm text-muted-foreground font-mono">{it.quarter}</div>
              <div className="mt-2 font-medium">{it.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
