import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let frame;
    const duration = 2000;
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(ease * 100));

      if (p < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setReady(true);
          setTimeout(() => onComplete(), 800);
        }, 400);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  const strokeDash = progress * 2.83;

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-gray-950 flex flex-col items-center justify-center"
        >
          {/* Brand mark */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16"
          >
            <span className="text-3xl font-black tracking-[0.3em] text-white font-montserrat">
              SHIPCART
            </span>
          </motion.div>

          {/* Circular progress */}
          <div className="relative w-24 h-24 mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1.5"
              />
              <motion.circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="url(#preloaderGrad)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="88"
                strokeDashoffset={88 - strokeDash}
                initial={false}
              />
              <defs>
                <linearGradient id="preloaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C8102E" />
                  <stop offset="50%" stopColor="#C5A455" />
                  <stop offset="100%" stopColor="#8B0000" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                key={progress}
                initial={{ opacity: 0.3, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white/80 text-sm font-montserrat font-light tracking-widest"
              >
                {progress}%
              </motion.span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-48 h-[1px] bg-white/5 overflow-hidden rounded-full">
            <motion.div
              className="h-full bg-gradient-to-r from-[#C8102E] via-[#C5A455] to-[#8B0000]"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/20 text-[10px] uppercase tracking-[0.3em] mt-12 font-montserrat"
          >
            Loading Experience
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
