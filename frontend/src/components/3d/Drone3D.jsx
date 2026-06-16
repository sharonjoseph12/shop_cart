import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const CartierRotor = ({ position, speed = 1 }) => {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.y = state.clock.getElapsedTime() * 6 * speed;
  });
  return (
    <group ref={ref} position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.006, 0.006, 0.65, 6]} />
        <meshPhysicalMaterial color="#C5A455" emissive="#C5A455" emissiveIntensity={0.2} metalness={0.95} roughness={0.08} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.65, 6]} />
        <meshPhysicalMaterial color="#C5A455" emissive="#C5A455" emissiveIntensity={0.2} metalness={0.95} roughness={0.08} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.05, 0.32, 32]} />
        <meshBasicMaterial color="#C8102E" transparent opacity={0.03} side={2} depthWrite={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.32, 0.008, 8, 32]} />
        <meshPhysicalMaterial color="#C5A455" emissive="#C5A455" emissiveIntensity={0.15} transparent opacity={0.3} metalness={0.7} roughness={0.15} side={2} />
      </mesh>
    </group>
  );
};

const GoldAccent = ({ position, size = 0.005 }) => (
  <mesh position={position}>
    <boxGeometry args={[size, size, size * 3]} />
    <meshPhysicalMaterial color="#C5A455" emissive="#C5A455" emissiveIntensity={0.3} metalness={0.9} roughness={0.1} />
  </mesh>
);

export const Drone3D = ({ scrollProgress = 0 }) => {
  const group = useRef();
  const capsuleRef = useRef();
  const innerCoreRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!group.current) return;

    const hoverY = Math.sin(t * 0.5) * 0.08;
    const hoverRotZ = Math.sin(t * 0.2) * 0.01;
    const hoverRotX = Math.sin(t * 0.3) * 0.008;

    if (scrollProgress < 0.05) {
      group.current.position.y = hoverY;
      group.current.rotation.z = hoverRotZ;
      group.current.rotation.x = hoverRotX;
    } else {
      group.current.position.y = hoverY + scrollProgress * 3.5;
      group.current.rotation.z = hoverRotZ + scrollProgress * 0.4;
    }

    group.current.position.x = scrollProgress * 2;
    group.current.rotation.y = Math.sin(t * 0.15) * 0.1 + scrollProgress * Math.PI;

    if (capsuleRef.current) {
      capsuleRef.current.position.y = Math.sin(t * 0.8 + 1) * 0.02;
      capsuleRef.current.rotation.z = Math.sin(t * 0.4) * 0.02;
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.material.emissiveIntensity = 0.4 + Math.sin(t * 1.5) * 0.2;
    }
  });

  const scale = 0.7 - scrollProgress * 0.25;

  return (
    <group ref={group} scale={[scale, scale, scale]}>
      {/* Fuselage — Cartier black lacquer */}
      <mesh>
        <boxGeometry args={[0.5, 0.09, 0.32]} />
        <meshPhysicalMaterial
          color="#0A0A0A"
          metalness={0.95}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={2}
        />
      </mesh>

      {/* Fuselage red accent stripe */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.45, 0.008, 0.26]} />
        <meshPhysicalMaterial color="#C8102E" emissive="#C8102E" emissiveIntensity={0.3} metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Gold top plate */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.48, 0.015, 0.28]} />
        <meshPhysicalMaterial
          color="#C5A455"
          metalness={0.9}
          roughness={0.12}
          envMapIntensity={2.5}
        />
      </mesh>

      {/* Nose cone */}
      <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.09, 0.22, 12]} />
        <meshPhysicalMaterial
          color="#1A1A1A"
          metalness={0.85}
          roughness={0.15}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Gold nose tip */}
      <mesh position={[0.42, 0, 0]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshPhysicalMaterial color="#C5A455" metalness={0.95} roughness={0.05} envMapIntensity={3} />
      </mesh>

      {/* Arms */}
      {[
        [0.14, 0.045, 0.14],
        [-0.14, 0.045, 0.14],
        [0.14, -0.045, 0.14],
        [-0.14, -0.045, 0.14],
      ].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, 0, i < 2 ? 0.15 : -0.15]}>
          <cylinderGeometry args={[0.01, 0.012, 0.38, 6]} />
          <meshPhysicalMaterial color="#1A1A1A" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      {/* Rotors */}
      <CartierRotor position={[0.3, 0.1, 0.14]} speed={1} />
      <CartierRotor position={[-0.3, 0.1, 0.14]} speed={1.08} />
      <CartierRotor position={[0.3, -0.1, 0.14]} speed={0.92} />
      <CartierRotor position={[-0.3, -0.1, 0.14]} speed={1.05} />

      {/* Gold accents on arms */}
      <GoldAccent position={[0.14, 0.05, 0.14]} />
      <GoldAccent position={[-0.14, 0.05, 0.14]} />
      <GoldAccent position={[0.14, -0.05, 0.14]} />
      <GoldAccent position={[-0.14, -0.05, 0.14]} />

      {/* Red glow core */}
      <mesh>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshPhysicalMaterial color="#C8102E" emissive="#C8102E" emissiveIntensity={1.5} transparent opacity={0.9} />
      </mesh>

      {/* Glass capsule */}
      <group ref={capsuleRef} position={[0, -0.18, 0]}>
        <mesh>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshPhysicalMaterial
            color="#F5F0EB"
            transparent
            opacity={0.08}
            roughness={0}
            metalness={0}
            clearcoat={1}
            transmission={0.9}
            ior={1.5}
            thickness={0.4}
            envMapIntensity={2}
          />
        </mesh>
        <mesh ref={innerCoreRef}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshPhysicalMaterial color="#C8102E" emissive="#C8102E" emissiveIntensity={0.6} transparent opacity={0.8} />
        </mesh>
        {/* Gold ring around capsule */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.13, 0.15, 32]} />
          <meshPhysicalMaterial color="#C5A455" emissive="#C5A455" emissiveIntensity={0.15} transparent opacity={0.2} metalness={0.8} roughness={0.15} />
        </mesh>
      </group>

      {/* Red under-glow */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[0.38, 0.004, 0.22]} />
        <meshBasicMaterial color="#C8102E" transparent opacity={0.1} />
      </mesh>

      <pointLight position={[0, -0.25, 0]} intensity={0.4} color="#C8102E" distance={1} />
    </group>
  );
};
