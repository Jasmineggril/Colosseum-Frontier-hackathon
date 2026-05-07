import { motion } from 'framer-motion';

export default function HoverParallax({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      className="transform-gpu will-change-transform"
      style={{ perspective: 800 }}
    >
      <motion.div
        initial={{ rotateX: 0, rotateY: 0 }}
        whileHover={{ rotateX: -6, rotateY: 6 }}
        transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        className="rounded-lg"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
