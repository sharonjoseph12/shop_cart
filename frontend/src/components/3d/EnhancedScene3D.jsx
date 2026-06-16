import { useRef, useMemo, useEffect, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshReflectorMaterial, Environment, ContactShadows } from '@react-three/drei';
import { Drone3D } from './Drone3D';

const rnd = () => Math.random();

const Floor = memo(() => (
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
));

const AmbientParticles = memo(({ count = 300 }) => {
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
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#C5A455" transparent opacity={0.08} sizeAttenuation depthWrite={false} blending={2} />
    </points>
  );
});

const CameraController = ({ scrollRef }) => {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 1.2, z: 5.5 });

  useFrame(() => {
    const sp = scrollRef.current;
    target.current.y = 1.2 + sp * 0.4;
    target.current.z = 5.5 - sp * 2.5;
    camera.position.lerp(target.current, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const SceneContent = memo(({ scrollRef }) => (
  <>
    <fog attach="fog" args={['#0A0A0A', 6, 16]} />
    <ambientLight intensity={0.25} color="#F5F0EB" />
    <directionalLight position={[3, 6, 4]} intensity={0.8} color="#F5F0EB" />
    <spotLight position={[-4, 4, 4]} angle={0.2} penumbra={1} intensity={1.5} color="#C8102E" />
    <spotLight position={[4, -1, 2]} angle={0.15} penumbra={1} intensity={1} color="#C5A455" />
    <pointLight position={[0, 2, 1]} intensity={0.6} color="#C5A455" />
    <Drone3D scrollRef={scrollRef} />
    <Floor />
    <ContactShadows position={[0, -1.25, 0]} opacity={0.3} scale={8} blur={2.5} far={2.5} />
    <Environment preset="city" />
    <AmbientParticles />
  </>
));

export const EnhancedScene3D = memo(({ scrollProgress = 0 }) => {
  const scrollRef = useRef(scrollProgress);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 1.2, 5.5], fov: 50 }}
        dpr={[0.5, 1.5]}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          alpha: false,
          failIfMajorPerformanceCaveat: false
        }}
        onCreated={({ gl }) => { gl.setClearColor('#0A0A0A'); }}
      >
        <CameraController scrollRef={scrollRef} />
        <SceneContent scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
});
