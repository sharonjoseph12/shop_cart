import { motion, useScroll } from 'framer-motion';

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#C8102E] origin-left z-50 shadow-[0_0_10px_rgba(200,16,46,0.5)]"
      style={{ scaleX: scrollYProgress }}
    />
  );
};
