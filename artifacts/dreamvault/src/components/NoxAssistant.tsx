import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const wolfImage = `/nox-wolf.jpeg`;

const idleMessages = [
  "I am NOX — your guide through the dreamscape. Describe your vision and I will forge a universe.",
  "I can feel dream fragments forming in the aether. Are you ready to begin?",
  "Your subconscious holds worlds yet uncharted. Let us map them together.",
  "A rare universe awaits inside your mind. I can sense its coordinates.",
  "The boundary between sleep and digital reality is thinner than you think.",
  "Every dream you describe becomes a permanent universe on the blockchain.",
];

const generatingMessages = [
  "I can feel the fragments forming...",
  "Your subconscious is awakening.",
  "A rare universe is emerging from the void.",
  "The neural pathways are aligning...",
  "Something extraordinary is crystallizing.",
];

export function NoxAssistant({ isGenerating = false }: { isGenerating?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [eyeBlink, setEyeBlink] = useState(false);

  const messages = isGenerating ? generatingMessages : idleMessages;
  const currentMessage = messages[messageIndex % messages.length];

  // Eye blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 150);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  const startTyping = useCallback(() => {
    setTextIndex(0);
    setIsTyping(true);
  }, []);

  useEffect(() => {
    if (isGenerating && !isOpen) {
      setIsOpen(true);
    }
  }, [isGenerating]);

  useEffect(() => {
    startTyping();
  }, [messageIndex, startTyping]);

  useEffect(() => {
    if (!isTyping) return;
    if (textIndex < currentMessage.length) {
      const timeout = setTimeout(() => setTextIndex(prev => prev + 1), 35);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      const next = setTimeout(() => setMessageIndex(prev => prev + 1), 4000);
      return () => clearTimeout(next);
    }
  }, [isTyping, textIndex, currentMessage]);

  useEffect(() => {
    if (isOpen) startTyping();
  }, [isOpen, startTyping]);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, x: 10 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="glass p-4 rounded-2xl w-72 shadow-[0_0_30px_rgba(140,80,255,0.15)] border border-primary/25"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 animate-ping opacity-60" />
                </div>
                <span className="text-xs font-orbitron text-primary uppercase tracking-widest">NOX ONLINE</span>
              </div>
              {isGenerating && (
                <span className="text-[10px] font-mono text-amber-400/80 animate-pulse tracking-wider">SCANNING...</span>
              )}
            </div>
            <p className="text-sm text-foreground/85 leading-relaxed font-mono min-h-[3.5rem]">
              {currentMessage.substring(0, textIndex)}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-[2px] h-[14px] bg-primary/70 ml-0.5 align-middle"
              />
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="relative group focus:outline-none"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) startTyping();
        }}
        data-testid="button-nox-assistant"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isGenerating
              ? ['0 0 20px rgba(140,80,255,0.5)', '0 0 50px rgba(140,80,255,0.8)', '0 0 20px rgba(140,80,255,0.5)']
              : ['0 0 15px rgba(140,80,255,0.3)', '0 0 30px rgba(140,80,255,0.5)', '0 0 15px rgba(140,80,255,0.3)'],
          }}
          transition={{ duration: isGenerating ? 1 : 2.5, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as any }}
        />
        <div className="absolute -inset-2 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors duration-500" />
        <motion.div
          className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/60"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as any }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent mix-blend-overlay z-10" />
          <div className="absolute inset-0 bg-indigo-500/10 mix-blend-screen z-10" />
          <img src={wolfImage} alt="NOX" className="w-full h-full object-cover scale-110 transition-all" style={{ opacity: eyeBlink ? 0.3 : 1 }} />
          {/* Eyes glow overlay */}
          <div className="absolute inset-0 flex items-center justify-between px-3 z-20">
            <motion.div
              animate={{
                boxShadow: isGenerating ? [
                  '0 0 8px #00d4ff, inset 0 0 4px #06b6d4',
                  '0 0 16px #00d4ff, inset 0 0 6px #06b6d4',
                  '0 0 8px #00d4ff, inset 0 0 4px #06b6d4'
                ] : [
                  '0 0 6px #7c3aed, inset 0 0 2px #a78bfa',
                  '0 0 12px #7c3aed, inset 0 0 4px #a78bfa',
                  '0 0 6px #7c3aed, inset 0 0 2px #a78bfa'
                ]
              }}
              transition={{ duration: isGenerating ? 0.8 : 2, repeat: Infinity }}
              className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-primary to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <motion.div
              animate={{
                boxShadow: isGenerating ? [
                  '0 0 8px #00d4ff, inset 0 0 4px #06b6d4',
                  '0 0 16px #00d4ff, inset 0 0 6px #06b6d4',
                  '0 0 8px #00d4ff, inset 0 0 4px #06b6d4'
                ] : [
                  '0 0 6px #7c3aed, inset 0 0 2px #a78bfa',
                  '0 0 12px #7c3aed, inset 0 0 4px #a78bfa',
                  '0 0 6px #7c3aed, inset 0 0 2px #a78bfa'
                ]
              }}
              transition={{ duration: isGenerating ? 0.8 : 2, repeat: Infinity }}
              className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-primary to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="absolute inset-0 rounded-full ring-2 ring-primary/40 z-20" />
        </motion.div>
        {isGenerating && (
          <motion.div
            className="absolute -inset-1 rounded-full border-2 border-primary/60"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: [0, 0, 1, 1] as any }}
            style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }}
          />
        )}
      </motion.button>
    </div>
  );
}
