import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 }
  },
  slideRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  }
};

const Reveal = ({ children, variant = 'fadeUp', delay = 0, duration = 0.6, className = '', once = true }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants[variant] || variants.fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
