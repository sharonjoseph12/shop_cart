import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

const LenisContext = createContext({ progress: 0 });

export const LenisProvider = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      infinite: false,
      lerp: 0.08,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', (e) => {
      setProgress(Math.max(0, Math.min(1, e.progress)));
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <LenisContext.Provider value={{ progress }}>
      {children}
    </LenisContext.Provider>
  );
};

export const useLenisProgress = () => useContext(LenisContext);
