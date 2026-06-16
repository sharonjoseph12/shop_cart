import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { Drone3D } from './Drone3D';

const SceneContent = ({ scrollProgress }) => {
  const ambientGroup = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ambientGroup.current) {
      ambientGroup.current.rotation.y += (Math.sin(t / 6) / 4 - ambientGroup.current.rotation.y) * 0.01;
      ambientGroup.current.rotation.x += (Math.cos(t / 8) / 6 - ambientGroup.current.rotation.x) * 0.01;
    }
  });

  return (
    <>
      <Drone3D scrollProgress={scrollProgress} />

      {/* Ambient floating ring */}
      <group ref={ambientGroup}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
          <ringGeometry args={[1.2, 1.4, 64]} />
          <meshPhysicalMaterial
            color="#6366f1"
            emissive="#6366f1"
            emissiveIntensity={0.15}
            transparent
            opacity={0.2}
            side={2}
            wireframe={false}
          />
        </mesh>
      </group>
    </>
  );
};

export const Hero3D = ({ mouse, scrollProgress = 0 }) => {
  const defaultMouse = useRef({ x: 0, y: 0 });

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 1.5, 6], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} />
        <spotLight position={[-5, 5, 5]} angle={0.2} penumbra={1} intensity={2} color="#ec4899" />
        <spotLight position={[5, -3, 3]} angle={0.2} penumbra={1} intensity={1.5} color="#6366f1" />

        <SceneContent mouse={mouse || defaultMouse} scrollProgress={scrollProgress} />

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.3}
          scale={15}
          blur={3}
          far={3}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};
