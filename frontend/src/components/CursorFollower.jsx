import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CursorFollower = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 100, damping: 30 });
  const springY = useSpring(cursorY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{
        translateX: springX,
        translateY: springY,
      }}
      className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#C8102E]/8 via-[#C5A455]/5 to-transparent blur-[120px] pointer-events-none z-[9999] mix-blend-screen -translate-x-1/2 -translate-y-1/2"
    />
  );
};
