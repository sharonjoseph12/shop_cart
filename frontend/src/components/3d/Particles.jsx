import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const rnd = () => Math.random();

const ParticleField = ({ count = 2000, mouse }) => {
  const mesh = useRef();

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (rnd() - 0.5) * 40;
      temp[i * 3 + 1] = (rnd() - 0.5) * 40;
      temp[i * 3 + 2] = (rnd() - 0.5) * 40;
    }
    return temp;
  }, [count]);

  const colors = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 0.4 + rnd() * 0.6;
      const g = 0.3 + rnd() * 0.5;
      const b = 0.8 + rnd() * 0.2;
      temp[i * 3] = r;
      temp[i * 3 + 1] = g;
      temp[i * 3 + 2] = b;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      const positionsArr = mesh.current.geometry.attributes.position.array;
      const targetX = mouse.current.x * 2;
      const targetY = mouse.current.y * 2;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const px = particles[i3];
        const py = particles[i3 + 1];

        const dx = targetX - px;
        const dy = targetY - py;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 5) {
          const force = (5 - dist) / 5 * 0.02;
          positionsArr[i3] += px > targetX ? force : -force;
          positionsArr[i3 + 1] += py > targetY ? force : -force;
        }

        positionsArr[i3] += Math.sin(t + i) * 0.002;
        positionsArr[i3 + 1] += Math.cos(t + i * 0.5) * 0.002;
      }
      positionsArr.needsUpdate = true;
      mesh.current.rotation.y = t * 0.02;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={2}
        depthWrite={false}
      />
    </points>
  );
};

export const Particles = ({ mouse }) => {
  const defaultMouse = useRef({ x: 0, y: 0 });

  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-50 dark:opacity-30">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ParticleField count={2000} mouse={mouse || defaultMouse} />
      </Canvas>
    </div>
  );
};
