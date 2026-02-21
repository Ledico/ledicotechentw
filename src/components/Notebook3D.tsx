import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const CYAN = '#06b6d4';
const CYAN_BRIGHT = '#22d3ee';
const ALUMINUM = '#c0c8d4';
const ALUMINUM_DARK = '#8a95a5';
const KEYBOARD_BG = '#1a1f2e';

function NotebookModel() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const glowRef = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();

  const screenTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d')!;

    const bg = ctx.createLinearGradient(0, 0, 0, 320);
    bg.addColorStop(0, '#0c1222');
    bg.addColorStop(1, '#0a0f1d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 320);

    ctx.strokeStyle = 'rgba(6,182,212,0.06)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 512; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 320);
      ctx.stroke();
    }
    for (let j = 0; j < 320; j += 20) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(512, j);
      ctx.stroke();
    }

    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = CYAN_BRIGHT;
    ctx.textAlign = 'left';
    ctx.fillText('> System Engineer', 35, 70);

    ctx.font = '15px monospace';
    ctx.fillStyle = 'rgba(148,163,184,0.7)';
    ctx.fillText('Cloud & Enterprise Solutions', 35, 100);

    ctx.strokeStyle = 'rgba(6,182,212,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(35, 120);
    ctx.lineTo(300, 120);
    ctx.stroke();

    const codeLines = [
      { text: '$ deploy --cloud azure', color: 'rgba(100,116,139,0.6)' },
      { text: '$ intune sync --all-devices', color: 'rgba(100,116,139,0.5)' },
      { text: '> status: operational', color: 'rgba(34,211,238,0.7)' },
    ];
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    codeLines.forEach((line, i) => {
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, 35, 148 + i * 22);
    });

    const barData = [0.6, 0.8, 0.45, 0.9, 0.7, 0.55];
    barData.forEach((h, i) => {
      const barX = 35 + i * 32;
      const barH = h * 60;
      const grad = ctx.createLinearGradient(barX, 280 - barH, barX, 280);
      grad.addColorStop(0, 'rgba(6,182,212,0.5)');
      grad.addColorStop(1, 'rgba(6,182,212,0.15)');
      ctx.fillStyle = grad;
      ctx.fillRect(barX, 280 - barH, 22, barH);
    });

    ctx.fillStyle = 'rgba(6,182,212,0.08)';
    ctx.fillRect(260, 140, 220, 150);
    ctx.strokeStyle = 'rgba(6,182,212,0.12)';
    ctx.strokeRect(260, 140, 220, 150);

    ctx.beginPath();
    ctx.arc(370, 215, 40, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(6,182,212,0.2)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(370, 215, 40, -Math.PI / 2, Math.PI * 0.8);
    ctx.strokeStyle = 'rgba(34,211,238,0.5)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = 'rgba(34,211,238,0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('87%', 370, 220);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const pointer = state.pointer;
    mouseTarget.current.x = pointer.x * 0.12;
    mouseTarget.current.y = pointer.y * 0.08;

    mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * 0.04;
    mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * 0.04;

    groupRef.current.rotation.y = -0.25 + mouseCurrent.current.x + Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
    groupRef.current.rotation.x = 0.1 + mouseCurrent.current.y + Math.cos(state.clock.elapsedTime * 0.2) * 0.015;

    if (glowRef.current) {
      glowRef.current.intensity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });

  const scale = viewport.width < 6 ? 0.65 : 0.9;

  const keyRows = [
    { cols: 12, y: -0.65, widths: Array(12).fill(0.18) },
    { cols: 11, y: -0.35, widths: Array(11).fill(0.18) },
    { cols: 10, y: -0.05, widths: Array(10).fill(0.18) },
    { cols: 8, y: 0.25, widths: [0.18, 0.18, 0.18, 0.7, 0.18, 0.18, 0.18, 0.18] },
  ];

  return (
    <group ref={groupRef} scale={scale} position={[0, 0.2, 0]}>
      <Float speed={1.2} rotationIntensity={0.03} floatIntensity={0.25}>
        <group>
          {/* Base body - aluminum */}
          <RoundedBox args={[3.4, 0.08, 2.3]} radius={0.03} position={[0, -0.06, 0]}>
            <meshStandardMaterial color={ALUMINUM} metalness={0.95} roughness={0.12} />
          </RoundedBox>

          {/* Base top surface - darker recessed area */}
          <RoundedBox args={[3.2, 0.02, 2.1]} radius={0.02} position={[0, 0, 0]}>
            <meshStandardMaterial color={KEYBOARD_BG} metalness={0.3} roughness={0.7} />
          </RoundedBox>

          {/* Keyboard keys */}
          {keyRows.map((row, ri) => {
            let xOffset = -1.1;
            return row.widths.map((w, ci) => {
              const x = xOffset + w / 2;
              xOffset += w + 0.05;
              return (
                <RoundedBox
                  key={`key-${ri}-${ci}`}
                  args={[w, 0.018, 0.22]}
                  radius={0.01}
                  position={[x, 0.02, row.y]}
                >
                  <meshStandardMaterial color="#2a3040" metalness={0.4} roughness={0.6} />
                </RoundedBox>
              );
            });
          })}

          {/* Trackpad */}
          <RoundedBox args={[1.1, 0.005, 0.7]} radius={0.02} position={[0, 0.015, 0.75]}>
            <meshStandardMaterial color="#28303e" metalness={0.5} roughness={0.4} />
          </RoundedBox>

          {/* Hinge - refined cylinder */}
          <mesh position={[0, 0.01, -1.16]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 3.3, 32]} />
            <meshStandardMaterial color={ALUMINUM_DARK} metalness={0.9} roughness={0.15} />
          </mesh>

          {/* Screen lid */}
          <group position={[0, 0.05, -1.16]} rotation={[-0.5, 0, 0]}>
            {/* Lid outer shell */}
            <RoundedBox args={[3.4, 2.2, 0.06]} radius={0.03} position={[0, 1.1, -0.04]}>
              <meshStandardMaterial color={ALUMINUM} metalness={0.95} roughness={0.1} envMapIntensity={1.2} />
            </RoundedBox>

            {/* Screen bezel */}
            <RoundedBox args={[3.15, 2.0, 0.02]} radius={0.02} position={[0, 1.1, 0.0]}>
              <meshStandardMaterial color="#080c14" metalness={0.2} roughness={0.9} />
            </RoundedBox>

            {/* Screen display */}
            <mesh position={[0, 1.1, 0.015]}>
              <planeGeometry args={[3.0, 1.88]} />
              <meshBasicMaterial map={screenTexture} />
            </mesh>

            {/* Screen glow overlay */}
            <mesh position={[0, 1.1, 0.018]}>
              <planeGeometry args={[3.0, 1.88]} />
              <meshBasicMaterial color={CYAN} transparent opacity={0.02} />
            </mesh>

            {/* Webcam dot */}
            <mesh position={[0, 2.08, 0.01]}>
              <circleGeometry args={[0.025, 16]} />
              <meshStandardMaterial
                color={CYAN_BRIGHT}
                emissive={CYAN_BRIGHT}
                emissiveIntensity={1.5}
              />
            </mesh>

            {/* Screen light casting on keyboard */}
            <pointLight
              ref={glowRef}
              position={[0, 0.2, 0.5]}
              intensity={0.6}
              color={CYAN}
              distance={4}
              decay={2}
            />
          </group>

          {/* Front edge chamfer accent */}
          <mesh position={[0, -0.09, 1.15]}>
            <boxGeometry args={[3.3, 0.005, 0.005]} />
            <meshStandardMaterial
              color={ALUMINUM}
              metalness={1}
              roughness={0.05}
            />
          </mesh>

          {/* Subtle bottom shadow plane */}
          <mesh position={[0, -0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.6, 2.6]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.2} />
          </mesh>
        </group>
      </Float>

      {/* Reflection glow beneath */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 3]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.04} />
      </mesh>
    </group>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#f1f5f9" castShadow />
      <directionalLight position={[-4, 6, -3]} intensity={0.3} color="#e2e8f0" />
      <directionalLight position={[0, -2, 4]} intensity={0.15} color={CYAN} />
      <pointLight position={[3, 3, 3]} intensity={0.3} color="#f8fafc" distance={15} decay={2} />
      <pointLight position={[-3, 3, 3]} intensity={0.3} color="#f8fafc" distance={15} decay={2} />
      <Environment preset="city" />
    </>
  );
}

export default function Notebook3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 2.2, 5.5], fov: 38 }}
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
