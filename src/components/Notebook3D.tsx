import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const CYAN = '#06b6d4';
const CYAN_BRIGHT = '#22d3ee';

function createTaperedBase() {
  const shape = new THREE.Shape();
  const w = 1.65;
  const r = 0.04;

  shape.moveTo(-w + r, 0);
  shape.lineTo(w - r, 0);
  shape.quadraticCurveTo(w, 0, w, r);
  shape.lineTo(w - 0.015, 0.055);
  shape.quadraticCurveTo(w - 0.02, 0.065, w - 0.04, 0.065);
  shape.lineTo(-w + 0.04, 0.065);
  shape.quadraticCurveTo(-w + 0.02, 0.065, -w + 0.015, 0.055);
  shape.lineTo(-w, r);
  shape.quadraticCurveTo(-w, 0, -w + r, 0);

  const extrudeSettings = {
    steps: 1,
    depth: 2.15,
    bevelEnabled: true,
    bevelThickness: 0.005,
    bevelSize: 0.005,
    bevelSegments: 3,
  };

  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

function createLidGeometry() {
  const shape = new THREE.Shape();
  const w = 1.65;
  const h = 2.15;
  const r = 0.03;

  shape.moveTo(-w + r, 0);
  shape.lineTo(w - r, 0);
  shape.quadraticCurveTo(w, 0, w, r);
  shape.lineTo(w, h - r);
  shape.quadraticCurveTo(w, h, w - r, h);
  shape.lineTo(-w + r, h);
  shape.quadraticCurveTo(-w, h, -w, h - r);
  shape.lineTo(-w, r);
  shape.quadraticCurveTo(-w, 0, -w + r, 0);

  const extrudeSettings = {
    steps: 1,
    depth: 0.035,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 3,
  };

  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

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
      const radius = 2;
      ctx.beginPath();
      ctx.moveTo(bx + radius, 165 - bh);
      ctx.lineTo(bx + 15 - radius, 165 - bh);
      ctx.quadraticCurveTo(bx + 15, 165 - bh, bx + 15, 165 - bh + radius);
      ctx.lineTo(bx + 15, 165);
      ctx.lineTo(bx, 165);
      ctx.lineTo(bx, 165 - bh + radius);
      ctx.quadraticCurveTo(bx, 165 - bh, bx + radius, 165 - bh);
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

function NotebookModel() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const glowRef = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();

  const screenTexture = useScreenTexture();

  const baseGeometry = useMemo(() => createTaperedBase(), []);
  const lidGeometry = useMemo(() => createLidGeometry(), []);

  const aluminumMaterial = useMemo(() =>
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#d0d5dd'),
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      reflectivity: 0.8,
    }), []);

  const darkAluminumMaterial = useMemo(() =>
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#b0b8c4'),
      metalness: 0.9,
      roughness: 0.12,
      clearcoat: 0.2,
      clearcoatRoughness: 0.3,
    }), []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const pointer = state.pointer;
    mouseTarget.current.x = pointer.x * 0.1;
    mouseTarget.current.y = pointer.y * 0.06;

    mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * 0.035;
    mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * 0.035;

    groupRef.current.rotation.y = -0.3 + mouseCurrent.current.x + Math.sin(state.clock.elapsedTime * 0.25) * 0.02;
    groupRef.current.rotation.x = 0.15 + mouseCurrent.current.y + Math.cos(state.clock.elapsedTime * 0.18) * 0.01;

    if (glowRef.current) {
      glowRef.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  const scale = viewport.width < 5 ? 0.55 : viewport.width < 7 ? 0.7 : 0.85;

  const keyboardKeys = useMemo(() => {
    const keys: { x: number; z: number; w: number; h: number }[] = [];
    const rows = [
      { count: 13, z: -0.72, w: 0.17, gap: 0.035 },
      { count: 12, z: -0.46, w: 0.17, gap: 0.035 },
      { count: 11, z: -0.2, w: 0.17, gap: 0.035 },
      { count: 10, z: 0.06, w: 0.17, gap: 0.035 },
    ];
    rows.forEach(row => {
      const totalW = row.count * row.w + (row.count - 1) * row.gap;
      const startX = -totalW / 2;
      for (let i = 0; i < row.count; i++) {
        keys.push({
          x: startX + i * (row.w + row.gap) + row.w / 2,
          z: row.z,
          w: row.w,
          h: 0.2,
        });
      }
    });

    const spaceRow = [
      { x: -1.0, z: 0.32, w: 0.22, h: 0.2 },
      { x: -0.74, z: 0.32, w: 0.22, h: 0.2 },
      { x: -0.05, z: 0.32, w: 1.1, h: 0.2 },
      { x: 0.64, z: 0.32, w: 0.22, h: 0.2 },
      { x: 0.9, z: 0.32, w: 0.22, h: 0.2 },
    ];
    keys.push(...spaceRow);
    return keys;
  }, []);

  return (
    <group ref={groupRef} scale={scale} position={[0, -0.15, 0]}>
      <Float speed={1.0} rotationIntensity={0.02} floatIntensity={0.2}>
        <group>
          <mesh
            geometry={baseGeometry}
            material={aluminumMaterial}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, 1.075]}
          />

          <mesh position={[0, 0.068, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.1, 2.0]} />
            <meshStandardMaterial color="#161c28" metalness={0.2} roughness={0.8} />
          </mesh>

          {keyboardKeys.map((key, i) => (
            <mesh key={i} position={[key.x, 0.072, key.z]}>
              <boxGeometry args={[key.w, 0.008, key.h]} />
              <meshStandardMaterial
                color="#252d3a"
                metalness={0.3}
                roughness={0.7}
              />
            </mesh>
          ))}

          <mesh position={[0, 0.07, 0.72]}>
            <planeGeometry args={[1.15, 0.72]} />
            <meshPhysicalMaterial
              color="#1e2536"
              metalness={0.4}
              roughness={0.5}
              clearcoat={0.3}
            />
          </mesh>
          <mesh position={[0, 0.071, 0.72]}>
            <planeGeometry args={[1.17, 0.74]} />
            <meshBasicMaterial color="#1a2030" transparent opacity={0.3} />
          </mesh>

          <mesh position={[0, 0.04, -1.075]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.028, 0.028, 3.25, 24]} />
            <meshStandardMaterial {...darkAluminumMaterial} />
          </mesh>

          <group position={[0, 0.065, -1.075]} rotation={[-0.55, 0, 0]}>
            <mesh
              geometry={lidGeometry}
              material={aluminumMaterial}
              position={[-1.65, 0, -0.035]}
            />

            <mesh position={[0, 1.075, 0.001]}>
              <planeGeometry args={[3.12, 2.0]} />
              <meshStandardMaterial color="#050810" metalness={0.1} roughness={0.95} />
            </mesh>

            <mesh position={[0, 1.075, 0.003]}>
              <planeGeometry args={[2.98, 1.88]} />
              <meshBasicMaterial map={screenTexture} />
            </mesh>

            <mesh position={[0, 1.075, 0.004]}>
              <planeGeometry args={[2.98, 1.88]} />
              <meshBasicMaterial color={CYAN} transparent opacity={0.015} />
            </mesh>

            <mesh position={[0, 2.12, 0.002]}>
              <circleGeometry args={[0.018, 16]} />
              <meshStandardMaterial
                color="#1a1f2e"
                metalness={0.3}
                roughness={0.8}
              />
            </mesh>
            <mesh position={[0, 2.12, 0.004]}>
              <circleGeometry args={[0.008, 12]} />
              <meshStandardMaterial
                color={CYAN_BRIGHT}
                emissive={CYAN_BRIGHT}
                emissiveIntensity={2}
              />
            </mesh>

            <pointLight
              ref={glowRef}
              position={[0, 0.3, 0.6]}
              intensity={0.5}
              color={CYAN}
              distance={3.5}
              decay={2}
            />
          </group>

          <mesh position={[0, -0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.5, 2.5]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.35} />
          </mesh>
        </group>
      </Float>

      <mesh position={[0, -0.55, 0.2]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.8, 1.2, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.025} />
      </mesh>
    </group>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[5, 10, 6]}
        intensity={0.9}
        color="#f8fafc"
        castShadow
      />
      <directionalLight position={[-5, 8, -3]} intensity={0.35} color="#e2e8f0" />
      <directionalLight position={[0, -3, 5]} intensity={0.12} color={CYAN} />
      <spotLight
        position={[0, 8, 3]}
        intensity={0.5}
        angle={0.5}
        penumbra={0.8}
        color="#f1f5f9"
        distance={20}
        decay={2}
      />
      <pointLight position={[4, 4, 4]} intensity={0.25} color="#f8fafc" distance={12} decay={2} />
      <pointLight position={[-4, 4, 4]} intensity={0.25} color="#f8fafc" distance={12} decay={2} />
      <Environment preset="city" />
    </>
  );
}

export default function Notebook3D() {
  return (
    <div className="w-full h-full" style={{ minHeight: '100%' }}>
      <Canvas
        camera={{ position: [0, 2.5, 5.8], fov: 35 }}
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
