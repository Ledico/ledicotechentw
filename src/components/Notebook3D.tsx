import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const CYAN = '#06b6d4';
const CYAN_BRIGHT = '#22d3ee';
const BODY_COLOR = '#0e7490';
const BODY_DARK = '#0c4a6e';

function AlienBody() {
  const bodyGeo = useMemo(() => {
    const geo = new THREE.LatheGeometry(
      [
        new THREE.Vector2(0, -1.3),
        new THREE.Vector2(0.45, -1.28),
        new THREE.Vector2(0.75, -1.15),
        new THREE.Vector2(0.95, -0.9),
        new THREE.Vector2(1.08, -0.5),
        new THREE.Vector2(1.12, -0.1),
        new THREE.Vector2(1.1, 0.3),
        new THREE.Vector2(1.0, 0.6),
        new THREE.Vector2(0.85, 0.9),
        new THREE.Vector2(0.65, 1.15),
        new THREE.Vector2(0.45, 1.35),
        new THREE.Vector2(0.25, 1.48),
        new THREE.Vector2(0, 1.52),
      ],
      32
    );
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={bodyGeo} castShadow>
      <meshPhysicalMaterial
        color={BODY_COLOR}
        metalness={0.05}
        roughness={0.28}
        clearcoat={0.8}
        clearcoatRoughness={0.15}
        envMapIntensity={0.6}
        sheen={0.3}
        sheenColor={new THREE.Color(CYAN_BRIGHT)}
      />
    </mesh>
  );
}

function AlienEye() {
  const irisRef = useRef<THREE.Mesh>(null);
  const pupilRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (irisRef.current && pupilRef.current) {
      const t = state.clock.elapsedTime;
      const lookX = Math.sin(t * 0.7) * 0.06;
      const lookY = Math.cos(t * 0.5) * 0.04;
      irisRef.current.position.x = lookX;
      irisRef.current.position.y = lookY;
      pupilRef.current.position.x = lookX * 1.3;
      pupilRef.current.position.y = lookY * 1.3;
    }
  });

  return (
    <group position={[0, 0.55, 0.95]}>
      <mesh castShadow>
        <sphereGeometry args={[0.52, 32, 32]} />
        <meshPhysicalMaterial
          color="#f0f4f8"
          metalness={0}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.02}
          envMapIntensity={0.3}
        />
      </mesh>
      <mesh ref={irisRef} position={[0, 0, 0.38]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshPhysicalMaterial
          color="#0f172a"
          metalness={0.1}
          roughness={0.15}
          clearcoat={0.5}
        />
      </mesh>
      <mesh ref={pupilRef} position={[0, 0, 0.44]}>
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshStandardMaterial color="#000000" metalness={0} roughness={0.1} />
      </mesh>
      <mesh position={[0.08, 0.08, 0.5]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[-0.05, -0.04, 0.49]}>
        <sphereGeometry args={[0.02, 10, 10]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

function Antenna({ side }: { side: 'left' | 'right' }) {
  const tipRef = useRef<THREE.Mesh>(null);
  const xSign = side === 'left' ? -1 : 1;

  useFrame((state) => {
    if (tipRef.current) {
      const t = state.clock.elapsedTime;
      const offset = side === 'left' ? 0 : Math.PI * 0.7;
      tipRef.current.position.y = 0.95 + Math.sin(t * 2 + offset) * 0.04;
      tipRef.current.position.x = xSign * 0.35 + Math.sin(t * 1.5 + offset) * 0.02;
    }
  });

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(xSign * 0.15, 1.45, 0.1),
      new THREE.Vector3(xSign * 0.25, 1.65, 0.05),
      new THREE.Vector3(xSign * 0.32, 1.85, 0),
      new THREE.Vector3(xSign * 0.35, 2.05, -0.03),
    ]);
  }, [xSign]);

  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, 20, 0.028, 8, false);
  }, [curve]);

  return (
    <group>
      <mesh geometry={tubeGeo}>
        <meshPhysicalMaterial
          color={BODY_COLOR}
          metalness={0.1}
          roughness={0.3}
          clearcoat={0.6}
        />
      </mesh>
      <mesh ref={tipRef} position={[xSign * 0.35, 2.05, -0.03]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhysicalMaterial
          color={CYAN_BRIGHT}
          emissive={CYAN_BRIGHT}
          emissiveIntensity={1.5}
          metalness={0.2}
          roughness={0.1}
          clearcoat={1}
        />
      </mesh>
      <pointLight
        position={[xSign * 0.35, 2.1, -0.03]}
        color={CYAN_BRIGHT}
        intensity={0.3}
        distance={1.5}
        decay={2}
      />
    </group>
  );
}

function AlienArm({ side }: { side: 'left' | 'right' }) {
  const armRef = useRef<THREE.Group>(null);
  const xSign = side === 'left' ? -1 : 1;

  useFrame((state) => {
    if (armRef.current) {
      const t = state.clock.elapsedTime;
      const offset = side === 'left' ? 0 : Math.PI;
      armRef.current.rotation.z = xSign * 0.35 + Math.sin(t * 0.8 + offset) * 0.12;
      armRef.current.rotation.x = Math.sin(t * 0.6 + offset) * 0.08;
    }
  });

  const armCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(xSign * 0.15, -0.2, 0.05),
      new THREE.Vector3(xSign * 0.25, -0.45, 0.08),
      new THREE.Vector3(xSign * 0.2, -0.65, 0.04),
    ]);
  }, [xSign]);

  const armGeo = useMemo(() => {
    return new THREE.TubeGeometry(armCurve, 16, 0.13, 8, false);
  }, [armCurve]);

  return (
    <group ref={armRef} position={[xSign * 0.95, 0.3, 0.15]}>
      <mesh geometry={armGeo}>
        <meshPhysicalMaterial
          color={BODY_COLOR}
          metalness={0.05}
          roughness={0.28}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
          sheen={0.3}
          sheenColor={new THREE.Color(CYAN_BRIGHT)}
        />
      </mesh>
      <mesh position={[xSign * 0.2, -0.7, 0.04]}>
        <sphereGeometry args={[0.13, 14, 14]} />
        <meshPhysicalMaterial
          color={BODY_COLOR}
          metalness={0.05}
          roughness={0.28}
          clearcoat={0.8}
        />
      </mesh>
    </group>
  );
}

function AlienLeg({ side }: { side: 'left' | 'right' }) {
  const xSign = side === 'left' ? -1 : 1;

  return (
    <group position={[xSign * 0.42, -1.3, 0]}>
      <mesh>
        <capsuleGeometry args={[0.16, 0.35, 8, 12]} />
        <meshPhysicalMaterial
          color={BODY_COLOR}
          metalness={0.05}
          roughness={0.28}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
          sheen={0.3}
          sheenColor={new THREE.Color(CYAN_BRIGHT)}
        />
      </mesh>
      <mesh position={[xSign * 0.03, -0.38, 0.08]}>
        <sphereGeometry args={[0.18, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color={BODY_DARK}
          metalness={0.1}
          roughness={0.35}
          clearcoat={0.6}
        />
      </mesh>
    </group>
  );
}

function Headset() {
  const bandCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.65, 1.1, 0.35),
      new THREE.Vector3(-0.5, 1.55, 0.2),
      new THREE.Vector3(0, 1.7, 0.15),
      new THREE.Vector3(0.5, 1.55, 0.2),
      new THREE.Vector3(0.65, 1.1, 0.35),
    ]);
  }, []);

  const bandGeo = useMemo(() => {
    return new THREE.TubeGeometry(bandCurve, 24, 0.028, 8, false);
  }, [bandCurve]);

  const micCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.65, 1.1, 0.38),
      new THREE.Vector3(-0.72, 0.85, 0.5),
      new THREE.Vector3(-0.6, 0.6, 0.65),
      new THREE.Vector3(-0.42, 0.5, 0.75),
    ]);
  }, []);

  const micGeo = useMemo(() => {
    return new THREE.TubeGeometry(micCurve, 16, 0.018, 8, false);
  }, [micCurve]);

  return (
    <group>
      <mesh geometry={bandGeo}>
        <meshPhysicalMaterial
          color="#1e293b"
          metalness={0.6}
          roughness={0.2}
          clearcoat={0.4}
        />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.65, 1.05, 0.38]}>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
          <meshPhysicalMaterial
            color="#0f172a"
            metalness={0.5}
            roughness={0.25}
            clearcoat={0.3}
          />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`pad-${s}`} position={[s * 0.67, 1.05, 0.38]}>
          <torusGeometry args={[0.08, 0.035, 8, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.2} roughness={0.6} />
        </mesh>
      ))}
      <mesh geometry={micGeo}>
        <meshPhysicalMaterial
          color="#1e293b"
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-0.42, 0.5, 0.78]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshPhysicalMaterial
          color={CYAN_BRIGHT}
          emissive={CYAN_BRIGHT}
          emissiveIntensity={2}
          metalness={0.3}
          roughness={0.1}
        />
      </mesh>
      <pointLight
        position={[-0.42, 0.5, 0.8]}
        color={CYAN_BRIGHT}
        intensity={0.15}
        distance={0.8}
        decay={2}
      />
    </group>
  );
}

function FloatingHologram() {
  const holoRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (holoRef.current) {
      holoRef.current.position.y = 0.5 + Math.sin(t * 1.2) * 0.08;
      holoRef.current.rotation.y = t * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.6;
      ringRef.current.rotation.z = t * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.4;
      ring2Ref.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group position={[1.4, 0.8, 0.3]}>
      <group ref={holoRef}>
        <mesh ref={ringRef}>
          <torusGeometry args={[0.3, 0.012, 16, 48]} />
          <meshStandardMaterial
            color={CYAN_BRIGHT}
            emissive={CYAN_BRIGHT}
            emissiveIntensity={1.5}
            transparent
            opacity={0.6}
          />
        </mesh>
        <mesh ref={ring2Ref}>
          <torusGeometry args={[0.22, 0.008, 16, 48]} />
          <meshStandardMaterial
            color={CYAN}
            emissive={CYAN}
            emissiveIntensity={1}
            transparent
            opacity={0.4}
          />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.1, 0]} />
          <meshStandardMaterial
            color={CYAN_BRIGHT}
            emissive={CYAN_BRIGHT}
            emissiveIntensity={2}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>
      <pointLight
        position={[0, 0.5, 0]}
        color={CYAN_BRIGHT}
        intensity={0.4}
        distance={2.5}
        decay={2}
      />
    </group>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 40;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position;
      const t = state.clock.elapsedTime;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        pos.setY(i, y + Math.sin(t * 0.5 + i) * 0.001);
        const x = pos.getX(i);
        pos.setX(i, x + Math.cos(t * 0.3 + i * 0.5) * 0.0008);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={CYAN_BRIGHT}
        size={0.03}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function AlienCharacter() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    mouseTarget.current.x = state.pointer.x * 0.12;
    mouseTarget.current.y = state.pointer.y * 0.06;
    mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * 0.03;
    mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * 0.03;
    groupRef.current.rotation.y = mouseCurrent.current.x + Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
    groupRef.current.rotation.x = mouseCurrent.current.y;
  });

  const scale = viewport.width < 5 ? 0.55 : viewport.width < 7 ? 0.68 : 0.82;

  return (
    <group ref={groupRef} scale={scale} position={[0, 0.2, 0]}>
      <Float speed={1.5} rotationIntensity={0.02} floatIntensity={0.25}>
        <group>
          <AlienBody />
          <AlienEye />
          <Antenna side="left" />
          <Antenna side="right" />
          <AlienArm side="left" />
          <AlienArm side="right" />
          <AlienLeg side="left" />
          <AlienLeg side="right" />
          <Headset />
          <FloatingHologram />
        </group>
      </Float>
      <FloatingParticles />
    </group>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 10, 6]} intensity={0.9} color="#f8fafc" />
      <directionalLight position={[-5, 8, -3]} intensity={0.25} color="#e2e8f0" />
      <directionalLight position={[0, -2, 5]} intensity={0.15} color={CYAN} />
      <spotLight
        position={[0, 8, 4]}
        intensity={0.5}
        angle={0.5}
        penumbra={0.8}
        color="#f1f5f9"
        distance={20}
        decay={2}
      />
      <pointLight position={[3, 3, 3]} intensity={0.15} color="#f8fafc" distance={10} decay={2} />
      <pointLight position={[-3, 3, 3]} intensity={0.15} color="#f8fafc" distance={10} decay={2} />
      <pointLight position={[0, -1, 3]} intensity={0.15} color={CYAN} distance={6} decay={2} />
      <Environment preset="city" />
    </>
  );
}

export default function Notebook3D() {
  return (
    <div className="w-full h-full" style={{ minHeight: '100%' }}>
      <Canvas
        camera={{ position: [0, 0.3, 5.8], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneLighting />
        <AlienCharacter />
      </Canvas>
    </div>
  );
}
