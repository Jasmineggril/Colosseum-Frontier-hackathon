import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const wolfImage = `${import.meta.env.BASE_URL}nox-wolf.jpeg`;

export function NoxAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const fullText = "I am NOX — your guide through the dreamscape. Describe your vision and I will forge a universe.";

  useEffect(() => {
    if (isOpen && textIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTextIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, textIndex]);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4 pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass p-4 rounded-2xl w-64 mr-4 mb-2 shadow-lg border border-primary/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-orbitron text-primary uppercase tracking-wider">NOX ONLINE</span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed font-mono min-h-[4rem]">
              {fullText.substring(0, textIndex)}
              <span className="animate-pulse">_</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="relative group focus:outline-none"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setTextIndex(0);
        }}
        data-testid="button-nox-assistant"
      >
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-colors duration-500" />
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50 shadow-[0_0_20px_rgba(140,80,255,0.4)] animate-float">
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 pointer-events-none" style={{ backdropFilter: 'hue-rotate(20deg)' }} />
          <img src={wolfImage} alt="NOX Assistant" className="w-full h-full object-cover scale-110" />
        </div>
      </motion.button>
    </div>
  );
}
