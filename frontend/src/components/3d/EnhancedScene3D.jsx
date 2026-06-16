import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshReflectorMaterial, Environment, ContactShadows } from '@react-three/drei';
import { Drone3D } from './Drone3D';

const rnd = () => Math.random();

const Floor = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.3, 0]}>
    <planeGeometry args={[20, 20]} />
    <MeshReflectorMaterial
      blur={[200, 80]}
      resolution={1024}
      mixBlur={1}
      mixStrength={0.4}
      roughness={0.4}
      metalness={0.9}
      color="#0A0A0A"
      transparent
      opacity={0.7}
    />
  </mesh>
);

const AmbientParticles = ({ count = 300 }) => {
  const ref = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rnd() - 0.5) * 25;
      pos[i * 3 + 1] = (rnd() - 0.5) * 18;
      pos[i * 3 + 2] = (rnd() - 0.5) * 12 - 4;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#C5A455" transparent opacity={0.08} sizeAttenuation depthWrite={false} blending={2} />
    </points>
  );
};

const CameraController = ({ scrollProgress }) => {
  const { camera } = useThree();

  useFrame(() => {
    const targetZ = 5.5 - scrollProgress * 2.5;
    const targetY = 1.2 + scrollProgress * 0.4;
    const x = camera.position.x * 0.98;
    const y = camera.position.y + (targetY - camera.position.y) * 0.02;
    const z = camera.position.z + (targetZ - camera.position.z) * 0.02;
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const SceneContent = ({ scrollProgress }) => (
  <>
    <fog attach="fog" args={['#0A0A0A', 6, 16]} />
    <ambientLight intensity={0.25} color="#F5F0EB" />
    <directionalLight position={[3, 6, 4]} intensity={0.8} color="#F5F0EB" />
    <spotLight position={[-4, 4, 4]} angle={0.2} penumbra={1} intensity={1.5} color="#C8102E" />
    <spotLight position={[4, -1, 2]} angle={0.15} penumbra={1} intensity={1} color="#C5A455" />
    <pointLight position={[0, 2, 1]} intensity={0.6} color="#C5A455" />

    <Drone3D scrollProgress={scrollProgress} />

    <Floor />
    <ContactShadows position={[0, -1.25, 0]} opacity={0.3} scale={8} blur={2.5} far={2.5} />
    <Environment preset="city" />

    <AmbientParticles />
  </>
);

export const EnhancedScene3D = ({ scrollProgress = 0 }) => (
  <div className="absolute inset-0 pointer-events-none z-0">
    <Canvas
      camera={{ position: [0, 1.2, 5.5], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, toneMapping: 3, toneMappingExposure: 1.1 }}
    >
      <CameraController scrollProgress={scrollProgress} />
      <SceneContent scrollProgress={scrollProgress} />
    </Canvas>
  </div>
);
