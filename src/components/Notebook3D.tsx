import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const CYAN = '#06b6d4';
const CYAN_BRIGHT = '#22d3ee';

function useScreenTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 400;
    const ctx = canvas.getContext('2d')!;

    const bg = ctx.createLinearGradient(0, 0, 640, 400);
    bg.addColorStop(0, '#070d1a');
    bg.addColorStop(0.5, '#0a1020');
    bg.addColorStop(1, '#060b16');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 640, 400);

    ctx.strokeStyle = 'rgba(6,182,212,0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 640; i += 25) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 400);
      ctx.stroke();
    }
    for (let j = 0; j < 400; j += 25) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(640, j);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(6,182,212,0.04)';
    ctx.fillRect(25, 20, 590, 32);
    ctx.font = 'bold 13px -apple-system, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(34,211,238,0.6)';
    ctx.textAlign = 'left';
    ctx.fillText('Dashboard', 38, 42);

    const tabs = ['Overview', 'Devices', 'Compliance', 'Logs'];
    ctx.font = '10px -apple-system, system-ui, sans-serif';
    tabs.forEach((tab, i) => {
      ctx.fillStyle = i === 0 ? 'rgba(34,211,238,0.7)' : 'rgba(148,163,184,0.35)';
      ctx.fillText(tab, 180 + i * 80, 42);
    });

    ctx.fillStyle = 'rgba(6,182,212,0.02)';
    ctx.fillRect(25, 65, 200, 120);
    ctx.strokeStyle = 'rgba(6,182,212,0.06)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(25, 65, 200, 120);

    ctx.font = 'bold 11px -apple-system, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(34,211,238,0.8)';
    ctx.fillText('> System Engineer', 38, 90);
    ctx.font = '9px -apple-system, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(148,163,184,0.5)';
    ctx.fillText('Cloud & Enterprise Solutions', 38, 108);

    ctx.strokeStyle = 'rgba(6,182,212,0.08)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(38, 118);
    ctx.lineTo(210, 118);
    ctx.stroke();

    const lines = [
      { t: '$ deploy --cloud azure', c: 'rgba(100,116,139,0.4)' },
      { t: '$ intune sync --devices', c: 'rgba(100,116,139,0.35)' },
      { t: '> status: operational', c: 'rgba(34,211,238,0.55)' },
    ];
    ctx.font = '8px monospace';
    lines.forEach((l, i) => {
      ctx.fillStyle = l.c;
      ctx.fillText(l.t, 38, 135 + i * 15);
    });

    ctx.fillStyle = 'rgba(6,182,212,0.02)';
    ctx.fillRect(240, 65, 180, 120);
    ctx.strokeStyle = 'rgba(6,182,212,0.06)';
    ctx.strokeRect(240, 65, 180, 120);
    ctx.font = '9px -apple-system, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(148,163,184,0.4)';
    ctx.fillText('Infrastructure Health', 252, 82);

    const bars = [0.55, 0.78, 0.42, 0.92, 0.68, 0.85, 0.6];
    bars.forEach((h, i) => {
      const bx = 258 + i * 22;
      const bh = h * 70;
      const g = ctx.createLinearGradient(bx, 165 - bh, bx, 165);
      g.addColorStop(0, `rgba(6,182,212,${0.3 + h * 0.3})`);
      g.addColorStop(1, 'rgba(6,182,212,0.06)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(bx + 2, 165 - bh);
      ctx.lineTo(bx + 13, 165 - bh);
      ctx.quadraticCurveTo(bx + 15, 165 - bh, bx + 15, 165 - bh + 2);
      ctx.lineTo(bx + 15, 165);
      ctx.lineTo(bx, 165);
      ctx.lineTo(bx, 165 - bh + 2);
      ctx.quadraticCurveTo(bx, 165 - bh, bx + 2, 165 - bh);
      ctx.fill();
    });

    ctx.fillStyle = 'rgba(6,182,212,0.02)';
    ctx.fillRect(435, 65, 180, 120);
    ctx.strokeStyle = 'rgba(6,182,212,0.06)';
    ctx.strokeRect(435, 65, 180, 120);
    ctx.font = '9px -apple-system, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(148,163,184,0.4)';
    ctx.fillText('Compliance Rate', 448, 82);

    ctx.beginPath();
    ctx.arc(525, 130, 35, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(6,182,212,0.08)';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(525, 130, 35, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.87);
    ctx.strokeStyle = 'rgba(34,211,238,0.45)';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.font = 'bold 13px -apple-system, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(34,211,238,0.6)';
    ctx.textAlign = 'center';
    ctx.fillText('87%', 525, 135);
    ctx.textAlign = 'left';

    ctx.fillStyle = 'rgba(6,182,212,0.015)';
    ctx.fillRect(25, 200, 590, 180);
    ctx.strokeStyle = 'rgba(6,182,212,0.04)';
    ctx.strokeRect(25, 200, 590, 180);
    ctx.font = '9px -apple-system, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(148,163,184,0.4)';
    ctx.fillText('Recent Activity', 38, 218);

    const rows = [
      { name: 'Azure AD Sync', status: 'Completed', col: 'rgba(52,211,153,0.4)' },
      { name: 'Intune Policy Push', status: 'Running', col: 'rgba(34,211,238,0.4)' },
      { name: 'Endpoint Security', status: 'Completed', col: 'rgba(52,211,153,0.4)' },
      { name: 'Compliance Check', status: 'Pending', col: 'rgba(251,191,36,0.4)' },
      { name: 'Device Enrollment', status: 'Completed', col: 'rgba(52,211,153,0.4)' },
      { name: 'Config Profile', status: 'Running', col: 'rgba(34,211,238,0.4)' },
    ];
    ctx.font = '8px -apple-system, system-ui, sans-serif';
    rows.forEach((row, i) => {
      const ry = 235 + i * 22;
      if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(6,182,212,0.015)';
        ctx.fillRect(30, ry - 8, 580, 20);
      }
      ctx.fillStyle = 'rgba(203,213,225,0.35)';
      ctx.fillText(row.name, 42, ry + 4);
      ctx.fillStyle = row.col;
      ctx.beginPath();
      ctx.arc(350, ry + 1, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(row.status, 360, ry + 4);
      ctx.fillStyle = 'rgba(100,116,139,0.25)';
      ctx.fillText('Just now', 520, ry + 4);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

function KeyboardKeys() {
  const keys = useMemo(() => {
    const result: { x: number; z: number; w: number }[] = [];
    const rowConfigs = [
      { count: 13, z: -0.62, keyW: 0.17 },
      { count: 12, z: -0.38, keyW: 0.17 },
      { count: 11, z: -0.14, keyW: 0.17 },
      { count: 10, z: 0.10, keyW: 0.17 },
    ];
    rowConfigs.forEach(row => {
      const gap = 0.04;
      const totalW = row.count * row.keyW + (row.count - 1) * gap;
      const startX = -totalW / 2;
      for (let i = 0; i < row.count; i++) {
        result.push({
          x: startX + i * (row.keyW + gap) + row.keyW / 2,
          z: row.z,
          w: row.keyW,
        });
      }
    });
    result.push(
      { x: -0.95, z: 0.34, w: 0.22 },
      { x: -0.68, z: 0.34, w: 0.22 },
      { x: 0.05, z: 0.34, w: 1.2 },
      { x: 0.72, z: 0.34, w: 0.22 },
      { x: 0.99, z: 0.34, w: 0.22 },
    );
    return result;
  }, []);

  return (
    <>
      {keys.map((key, i) => (
        <RoundedBox
          key={i}
          args={[key.w, 0.012, 0.19]}
          radius={0.008}
          position={[key.x, 0.025, key.z]}
        >
          <meshStandardMaterial color="#272f3c" metalness={0.35} roughness={0.65} />
        </RoundedBox>
      ))}
    </>
  );
}

function NotebookModel() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const glowRef = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();
  const screenTexture = useScreenTexture();

  useFrame((state) => {
    if (!groupRef.current) return;
    mouseTarget.current.x = state.pointer.x * 0.1;
    mouseTarget.current.y = state.pointer.y * 0.06;
    mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * 0.035;
    mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * 0.035;
    groupRef.current.rotation.y = -0.28 + mouseCurrent.current.x + Math.sin(state.clock.elapsedTime * 0.25) * 0.02;
    groupRef.current.rotation.x = 0.12 + mouseCurrent.current.y + Math.cos(state.clock.elapsedTime * 0.18) * 0.01;
    if (glowRef.current) {
      glowRef.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  const scale = viewport.width < 5 ? 0.55 : viewport.width < 7 ? 0.72 : 0.88;

  return (
    <group ref={groupRef} scale={scale} position={[0, 0.1, 0]}>
      <Float speed={1.0} rotationIntensity={0.02} floatIntensity={0.2}>
        <group>
          {/* === BASE === */}
          {/* Bottom shell - thin wedge shape simulated with two stacked pieces */}
          <RoundedBox args={[3.3, 0.04, 2.2]} radius={0.02} position={[0, -0.04, 0]}>
            <meshPhysicalMaterial
              color="#c8cdd6"
              metalness={0.9}
              roughness={0.12}
              clearcoat={0.4}
              clearcoatRoughness={0.15}
            />
          </RoundedBox>
          {/* Upper base shell - slightly thinner to create taper illusion */}
          <RoundedBox args={[3.28, 0.03, 2.18]} radius={0.015} position={[0, -0.005, 0]}>
            <meshPhysicalMaterial
              color="#bcc3ce"
              metalness={0.88}
              roughness={0.14}
              clearcoat={0.3}
              clearcoatRoughness={0.2}
            />
          </RoundedBox>

          {/* Keyboard recessed area */}
          <mesh position={[0, 0.014, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.0, 1.85]} />
            <meshStandardMaterial color="#151b27" metalness={0.2} roughness={0.85} />
          </mesh>

          {/* Keys */}
          <group position={[0, 0, -0.05]}>
            <KeyboardKeys />
          </group>

          {/* Trackpad */}
          <RoundedBox args={[1.15, 0.004, 0.7]} radius={0.015} position={[0, 0.016, 0.7]}>
            <meshPhysicalMaterial
              color="#232b38"
              metalness={0.45}
              roughness={0.45}
              clearcoat={0.5}
              clearcoatRoughness={0.3}
            />
          </RoundedBox>
          {/* Trackpad subtle border */}
          <mesh position={[0, 0.0165, 0.7]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.17, 0.72]} />
            <meshBasicMaterial color="#1c2332" transparent opacity={0.4} />
          </mesh>

          {/* Front edge accent line */}
          <mesh position={[0, -0.02, 1.1]}>
            <boxGeometry args={[3.2, 0.003, 0.003]} />
            <meshPhysicalMaterial color="#d0d5dd" metalness={1} roughness={0.05} />
          </mesh>

          {/* === HINGE === */}
          <mesh position={[0, 0.01, -1.1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.032, 0.032, 3.2, 24]} />
            <meshPhysicalMaterial
              color="#a0a8b4"
              metalness={0.92}
              roughness={0.1}
              clearcoat={0.2}
            />
          </mesh>

          {/* === SCREEN LID === */}
          <group position={[0, 0.04, -1.1]} rotation={[-0.52, 0, 0]}>
            {/* Back of lid */}
            <RoundedBox args={[3.3, 2.15, 0.04]} radius={0.02} position={[0, 1.08, -0.025]}>
              <meshPhysicalMaterial
                color="#c8cdd6"
                metalness={0.9}
                roughness={0.1}
                clearcoat={0.5}
                clearcoatRoughness={0.12}
                envMapIntensity={1.0}
              />
            </RoundedBox>

            {/* Screen bezel */}
            <RoundedBox args={[3.15, 2.02, 0.015]} radius={0.015} position={[0, 1.08, 0.001]}>
              <meshStandardMaterial color="#0a0e16" metalness={0.15} roughness={0.92} />
            </RoundedBox>

            {/* Screen display */}
            <mesh position={[0, 1.08, 0.01]}>
              <planeGeometry args={[2.95, 1.85]} />
              <meshBasicMaterial map={screenTexture} />
            </mesh>

            {/* Screen subtle glow overlay */}
            <mesh position={[0, 1.08, 0.012]}>
              <planeGeometry args={[2.95, 1.85]} />
              <meshBasicMaterial color={CYAN} transparent opacity={0.012} />
            </mesh>

            {/* Webcam housing */}
            <mesh position={[0, 2.06, 0.005]}>
              <circleGeometry args={[0.02, 16]} />
              <meshStandardMaterial color="#141820" metalness={0.3} roughness={0.8} />
            </mesh>
            {/* Webcam LED */}
            <mesh position={[0, 2.06, 0.008]}>
              <circleGeometry args={[0.007, 12]} />
              <meshStandardMaterial
                color={CYAN_BRIGHT}
                emissive={CYAN_BRIGHT}
                emissiveIntensity={2}
              />
            </mesh>

            {/* Screen light */}
            <pointLight
              ref={glowRef}
              position={[0, 0.3, 0.6]}
              intensity={0.5}
              color={CYAN}
              distance={3.5}
              decay={2}
            />
          </group>

          {/* Shadow beneath laptop */}
          <mesh position={[0, -0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.5, 2.5]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.3} />
          </mesh>
        </group>
      </Float>

      {/* Cyan reflection glow on ground */}
      <mesh position={[0, -0.5, 0.2]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.8, 1.2, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.02} />
      </mesh>
    </group>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 6]} intensity={0.85} color="#f8fafc" />
      <directionalLight position={[-5, 8, -3]} intensity={0.3} color="#e2e8f0" />
      <directionalLight position={[0, -2, 5]} intensity={0.1} color={CYAN} />
      <spotLight
        position={[0, 8, 3]}
        intensity={0.4}
        angle={0.5}
        penumbra={0.8}
        color="#f1f5f9"
        distance={20}
        decay={2}
      />
      <pointLight position={[4, 4, 4]} intensity={0.2} color="#f8fafc" distance={12} decay={2} />
      <pointLight position={[-4, 4, 4]} intensity={0.2} color="#f8fafc" distance={12} decay={2} />
      <Environment preset="city" />
    </>
  );
}

export default function Notebook3D() {
  return (
    <div className="w-full h-full" style={{ minHeight: '100%' }}>
      <Canvas
        camera={{ position: [0, 2.5, 5.5], fov: 36 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneLighting />
        <NotebookModel />
      </Canvas>
    </div>
  );
}
