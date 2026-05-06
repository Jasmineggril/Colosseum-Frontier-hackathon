import { motion } from 'framer-motion';

const nodes = [
  "Dream Input",
  "Neural Tokenization",
  "Subconscious Mapping",
  "Universe Architecture",
  "Visual Synthesis",
  "Solana Mint"
];

export function AIPipelineSection() {
  return (
    <section className="py-24 relative z-10 overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-orbitron font-bold text-2xl md:text-3xl mb-16 text-foreground/80">NEURAL PROCESSING PIPELINE</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
          {nodes.map((node, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="glass px-4 py-3 rounded-xl border border-primary/20 text-xs md:text-sm font-mono whitespace-nowrap"
              >
                {node}
              </motion.div>
              
              {index < nodes.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.1 }}
                  className="w-[2px] h-8 md:w-8 md:h-[2px] bg-gradient-to-b md:bg-gradient-to-r from-primary to-secondary my-2 md:my-0 mx-0 md:mx-2 relative"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white] animate-pulse" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
