import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const CYAN = '#06b6d4';
const CYAN_BRIGHT = '#22d3ee';
const DARK_SHELL = '#0f172a';

function NotebookModel() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const screenTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, 512, 320);

    const grd = ctx.createLinearGradient(0, 0, 512, 320);
    grd.addColorStop(0, 'rgba(6,182,212,0.15)');
    grd.addColorStop(0.5, 'rgba(6,182,212,0.05)');
    grd.addColorStop(1, 'rgba(6,182,212,0.12)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 512, 320);

    ctx.strokeStyle = 'rgba(6,182,212,0.08)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 512; i += 24) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 320);
      ctx.stroke();
    }
    for (let j = 0; j < 320; j += 24) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(512, j);
      ctx.stroke();
    }

    ctx.font = 'bold 28px monospace';
    ctx.fillStyle = CYAN_BRIGHT;
    ctx.textAlign = 'center';
    ctx.fillText('> System Engineer', 256, 100);
    ctx.font = '18px monospace';
    ctx.fillStyle = 'rgba(148,163,184,0.8)';
    ctx.fillText('Cloud & Enterprise Solutions', 256, 140);

    const codeLines = [
      '$ deploy --cloud azure',
      '$ intune sync --all-devices',
      '> status: operational ////',
    ];
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    codeLines.forEach((line, i) => {
      ctx.fillStyle = i === 2 ? 'rgba(34,211,238,0.6)' : 'rgba(100,116,139,0.5)';
      ctx.fillText(line, 40, 200 + i * 22);
    });

    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(80 + i * 60, 290, 4, 0, Math.PI * 2);
      ctx.fillStyle = i < 3 ? 'rgba(34,211,238,0.5)' : 'rgba(100,116,139,0.2)';
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const pointer = state.pointer;
    mouseTarget.current.x = pointer.x * 0.15;
    mouseTarget.current.y = pointer.y * 0.1;

    mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * 0.03;
    mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * 0.03;

    groupRef.current.rotation.y = -0.3 + mouseCurrent.current.x + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    groupRef.current.rotation.x = 0.15 + mouseCurrent.current.y + Math.cos(state.clock.elapsedTime * 0.2) * 0.02;
  });

  const shellMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: DARK_SHELL,
        metalness: 0.8,
        roughness: 0.2,
      }),
    []
  );

  const edgeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1e293b',
        metalness: 0.9,
        roughness: 0.15,
      }),
    []
  );

  const scale = viewport.width < 6 ? 0.7 : 1;

  return (
    <group ref={groupRef} scale={scale}>
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.3}>
        <group>
          {/* Base / Bottom */}
          <mesh position={[0, -0.08, 0]} material={shellMaterial}>
            <boxGeometry args={[3.2, 0.12, 2.2]} />
          </mesh>

          {/* Keyboard surface */}
          <mesh position={[0, -0.01, 0]}>
            <boxGeometry args={[3.0, 0.02, 2.0]} />
            <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.4} />
          </mesh>

          {/* Keyboard keys - rows */}
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => (
              <mesh
                key={`key-${row}-${col}`}
                position={[-1.15 + col * 0.26, 0.01, -0.55 + row * 0.35]}
              >
                <boxGeometry args={[0.2, 0.015, 0.2]} />
                <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.6} />
              </mesh>
            ))
          )}

          {/* Trackpad */}
          <mesh position={[0, 0.01, 0.65]}>
            <boxGeometry args={[1.0, 0.01, 0.6]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Trackpad cyan edge glow */}
          <mesh position={[0, 0.015, 0.65]}>
            <boxGeometry args={[1.02, 0.002, 0.62]} />
            <meshStandardMaterial
              color={CYAN}
              emissive={CYAN}
              emissiveIntensity={0.3}
              transparent
              opacity={0.4}
            />
          </mesh>

          {/* Hinge */}
          <mesh position={[0, 0.02, -1.1]} material={edgeMaterial}>
            <boxGeometry args={[3.2, 0.08, 0.08]} />
          </mesh>

          {/* Screen lid - angled back */}
          <group position={[0, 0.06, -1.1]} rotation={[-0.45, 0, 0]}>
            {/* Lid outer shell */}
            <mesh position={[0, 1.05, -0.06]} material={shellMaterial}>
              <boxGeometry args={[3.2, 2.15, 0.1]} />
            </mesh>

            {/* Screen bezel */}
            <mesh position={[0, 1.05, 0.01]}>
              <boxGeometry args={[3.05, 2.0, 0.02]} />
              <meshStandardMaterial color="#020617" metalness={0.3} roughness={0.8} />
            </mesh>

            {/* Screen display */}
            <mesh position={[0, 1.05, 0.025]}>
              <planeGeometry args={[2.85, 1.8]} />
              <meshBasicMaterial map={screenTexture} />
            </mesh>

            {/* Screen edge glow */}
            <mesh position={[0, 1.05, 0.03]}>
              <planeGeometry args={[2.9, 1.85]} />
              <meshBasicMaterial
                color={CYAN}
                transparent
                opacity={0.06}
              />
            </mesh>

            {/* Webcam dot */}
            <mesh position={[0, 2.0, 0.02]}>
              <circleGeometry args={[0.03, 16]} />
              <meshStandardMaterial
                color={CYAN_BRIGHT}
                emissive={CYAN_BRIGHT}
                emissiveIntensity={2}
              />
            </mesh>
          </group>

          {/* Base front edge glow */}
          <mesh position={[0, -0.02, 1.1]}>
            <boxGeometry args={[3.2, 0.02, 0.01]} />
            <meshStandardMaterial
              color={CYAN}
              emissive={CYAN}
              emissiveIntensity={0.5}
              transparent
              opacity={0.6}
            />
          </mesh>

          {/* Side accent lines */}
          <mesh position={[1.6, -0.04, 0]}>
            <boxGeometry args={[0.01, 0.01, 2.2]} />
            <meshStandardMaterial
              color={CYAN}
              emissive={CYAN}
              emissiveIntensity={0.4}
              transparent
              opacity={0.5}
            />
          </mesh>
          <mesh position={[-1.6, -0.04, 0]}>
            <boxGeometry args={[0.01, 0.01, 2.2]} />
            <meshStandardMaterial
              color={CYAN}
              emissive={CYAN}
              emissiveIntensity={0.4}
              transparent
              opacity={0.5}
            />
          </mesh>
        </group>
      </Float>

      {/* Ground reflection glow */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 4]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.03} />
      </mesh>
    </group>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} color="#e2e8f0" />
      <directionalLight position={[-3, 4, -2]} intensity={0.2} color="#0ea5e9" />
      <pointLight position={[0, 2, 3]} intensity={0.4} color={CYAN} distance={10} decay={2} />
      <pointLight position={[0, -1, 0]} intensity={0.15} color={CYAN} distance={6} decay={2} />
      <Environment preset="night" />
    </>
  );
}

export default function Notebook3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 5.5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneLighting />
        <NotebookModel />
      </Canvas>
    </div>
  );
}
