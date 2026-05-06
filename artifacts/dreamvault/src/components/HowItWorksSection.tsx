import { motion } from 'framer-motion';
import { PenTool, Cpu, Lock, Compass } from 'lucide-react';

const steps = [
  {
    number: "01",
    title: "DESCRIBE",
    icon: <PenTool className="w-6 h-6" />,
    description: "Write your dream fragment in natural language."
  },
  {
    number: "02",
    title: "GENERATE",
    icon: <Cpu className="w-6 h-6" />,
    description: "NOX AI constructs your universe architecture in real-time."
  },
  {
    number: "03",
    title: "OWN",
    icon: <Lock className="w-6 h-6" />,
    description: "Mint your dream as a unique, permanent Solana NFT."
  },
  {
    number: "04",
    title: "EXPLORE",
    icon: <Compass className="w-6 h-6" />,
    description: "Dive into your living dream universe and discover its secrets."
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative z-10 bg-black/40">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-4 gradient-text">THE PROTOCOL</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Four phases to digital transcendence.</p>
        </div>

        <div className="relative">
          {/* Connecting line desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent -translate-y-1/2" />
          
          {/* Connecting line mobile */}
          <div className="md:hidden absolute top-0 left-[28px] w-[2px] h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent" />

          <div className="grid md:grid-cols-4 gap-12 md:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative z-10 flex flex-row md:flex-col items-start md:items-center gap-6 md:gap-4 md:text-center"
              >
                <div className="w-14 h-14 md:w-20 md:h-20 shrink-0 rounded-full glass border-2 border-primary/50 flex items-center justify-center neon-glow bg-background relative">
                  <span className="absolute -top-3 -left-3 font-orbitron font-black text-transparent text-stroke-primary text-opacity-0" style={{ WebkitTextStroke: '1px rgba(140,80,255,0.5)' }}>{step.number}</span>
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-lg text-primary mb-2 tracking-wider">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
