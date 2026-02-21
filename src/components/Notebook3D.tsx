import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const CYAN = '#06b6d4';
const CYAN_BRIGHT = '#22d3ee';
const BODY_COLOR = '#0e7490';
const BODY_LIGHT = '#0891b2';
const BODY_DARK = '#0c4a6e';

function AlienBody() {
  const bodyGeo = useMemo(() => {
    const geo = new THREE.LatheGeometry(
      [
        new THREE.Vector2(0, -1.35),
        new THREE.Vector2(0.42, -1.32),
        new THREE.Vector2(0.72, -1.2),
        new THREE.Vector2(0.92, -0.95),
        new THREE.Vector2(1.06, -0.55),
        new THREE.Vector2(1.12, -0.15),
        new THREE.Vector2(1.1, 0.25),
        new THREE.Vector2(1.02, 0.55),
        new THREE.Vector2(0.88, 0.85),
        new THREE.Vector2(0.68, 1.1),
        new THREE.Vector2(0.48, 1.32),
        new THREE.Vector2(0.28, 1.46),
        new THREE.Vector2(0, 1.52),
      ],
      48
    );
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group>
      <mesh geometry={bodyGeo} castShadow>
        <meshPhysicalMaterial
          color={BODY_COLOR}
          metalness={0.08}
          roughness={0.22}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          envMapIntensity={0.8}
          sheen={0.4}
          sheenColor={new THREE.Color(CYAN_BRIGHT)}
          sheenRoughness={0.3}
        />
      </mesh>

      <mesh position={[0.3, 0.9, 0.7]} scale={[0.6, 0.3, 0.15]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          roughness={0.1}
          metalness={0}
        />
      </mesh>
      <mesh position={[-0.2, 0.4, 0.85]} scale={[0.3, 0.15, 0.1]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
          roughness={0.1}
          metalness={0}
        />
      </mesh>

      <BellyDetail />
    </group>
  );
}

function BellyDetail() {
  return (
    <group position={[0, -0.6, 0.95]}>
      <mesh scale={[0.55, 0.45, 0.08]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshPhysicalMaterial
          color={BODY_LIGHT}
          metalness={0.02}
          roughness={0.35}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
          envMapIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

function AlienEye() {
  const irisRef = useRef<THREE.Mesh>(null);
  const pupilRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (irisRef.current && pupilRef.current) {
      const t = state.clock.elapsedTime;
      const lookX = Math.sin(t * 0.7) * 0.06 + state.pointer.x * 0.04;
      const lookY = Math.cos(t * 0.5) * 0.04 + state.pointer.y * 0.03;
      irisRef.current.position.x = lookX;
      irisRef.current.position.y = lookY;
      pupilRef.current.position.x = lookX * 1.3;
      pupilRef.current.position.y = lookY * 1.3;
    }
  });

  return (
    <group position={[0, 0.55, 0.95]}>
      <mesh castShadow>
        <sphereGeometry args={[0.54, 48, 48]} />
        <meshPhysicalMaterial
          color="#f0f4f8"
          metalness={0}
          roughness={0.03}
          clearcoat={1}
          clearcoatRoughness={0.01}
          envMapIntensity={0.4}
          ior={1.5}
        />
      </mesh>

      <mesh ref={irisRef} position={[0, 0, 0.38]}>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshPhysicalMaterial
          color="#0f172a"
          metalness={0.15}
          roughness={0.12}
          clearcoat={0.8}
          envMapIntensity={0.3}
        />
      </mesh>

      <mesh position={[0, 0, 0.37]} scale={[1.15, 1.15, 0.5]}>
        <torusGeometry args={[0.24, 0.025, 16, 48]} />
        <meshPhysicalMaterial
          color="#1e3a5f"
          metalness={0.2}
          roughness={0.3}
          clearcoat={0.5}
        />
      </mesh>

      <mesh ref={pupilRef} position={[0, 0, 0.46]}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial color="#000000" metalness={0.1} roughness={0.05} />
      </mesh>

      <mesh position={[0.1, 0.1, 0.52]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh position={[-0.06, -0.05, 0.51]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[0.04, 0.12, 0.5]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>

      <EyeSocket />
    </group>
  );
}

function EyeSocket() {
  const socketGeo = useMemo(() => {
    const geo = new THREE.TorusGeometry(0.54, 0.04, 16, 48);
    return geo;
  }, []);

  return (
    <mesh geometry={socketGeo} position={[0, 0, 0.02]} rotation={[0, 0, 0]}>
      <meshPhysicalMaterial
        color={BODY_DARK}
        metalness={0.1}
        roughness={0.4}
        clearcoat={0.5}
      />
    </mesh>
  );
}

function Antenna({ side }: { side: 'left' | 'right' }) {
  const tipRef = useRef<THREE.Mesh>(null);
  const xSign = side === 'left' ? -1 : 1;

  useFrame((state) => {
    if (tipRef.current) {
      const t = state.clock.elapsedTime;
      const offset = side === 'left' ? 0 : Math.PI * 0.7;
      tipRef.current.position.y = 0.95 + Math.sin(t * 2 + offset) * 0.05;
      tipRef.current.position.x = xSign * 0.35 + Math.sin(t * 1.5 + offset) * 0.03;
    }
  });

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(xSign * 0.15, 1.45, 0.1),
      new THREE.Vector3(xSign * 0.22, 1.6, 0.06),
      new THREE.Vector3(xSign * 0.3, 1.78, 0.01),
      new THREE.Vector3(xSign * 0.35, 1.95, -0.02),
      new THREE.Vector3(xSign * 0.36, 2.1, -0.04),
    ]);
  }, [xSign]);

  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, 24, 0.025, 12, false);
  }, [curve]);

  return (
    <group>
      <mesh geometry={tubeGeo}>
        <meshPhysicalMaterial
          color={BODY_COLOR}
          metalness={0.15}
          roughness={0.25}
          clearcoat={0.7}
          envMapIntensity={0.5}
        />
      </mesh>
      <mesh ref={tipRef} position={[xSign * 0.36, 2.1, -0.04]}>
        <sphereGeometry args={[0.07, 20, 20]} />
        <meshPhysicalMaterial
          color={CYAN_BRIGHT}
          emissive={CYAN_BRIGHT}
          emissiveIntensity={2}
          metalness={0.3}
          roughness={0.05}
          clearcoat={1}
          envMapIntensity={1}
        />
      </mesh>
      <mesh position={[xSign * 0.36, 2.1, -0.04]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={CYAN_BRIGHT}
          emissive={CYAN_BRIGHT}
          emissiveIntensity={0.5}
          transparent
          opacity={0.15}
        />
      </mesh>
      <pointLight
        position={[xSign * 0.36, 2.12, -0.04]}
        color={CYAN_BRIGHT}
        intensity={0.4}
        distance={1.8}
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
      armRef.current.rotation.z = xSign * 0.3 + Math.sin(t * 0.8 + offset) * 0.1;
      armRef.current.rotation.x = Math.sin(t * 0.6 + offset) * 0.06;
    }
  });

  const upperArmCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(xSign * 0.1, -0.12, 0.03),
      new THREE.Vector3(xSign * 0.18, -0.28, 0.06),
      new THREE.Vector3(xSign * 0.22, -0.42, 0.05),
    ]);
  }, [xSign]);

  const upperArmGeo = useMemo(() => {
    const radiusSegments = [0.12, 0.11, 0.095, 0.085];
    const path = upperArmCurve;
    const points = path.getPoints(20);
    const frames = path.computeFrenetFrames(20);
    const vertices: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    const segs = 12;

    points.forEach((point, i) => {
      const t = i / (points.length - 1);
      const rIdx = Math.min(Math.floor(t * (radiusSegments.length - 1)), radiusSegments.length - 2);
      const rT = (t * (radiusSegments.length - 1)) - rIdx;
      const radius = radiusSegments[rIdx] * (1 - rT) + radiusSegments[rIdx + 1] * rT;

      const N = frames.normals[i];
      const B = frames.binormals[i];

      for (let j = 0; j <= segs; j++) {
        const angle = (j / segs) * Math.PI * 2;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        const nx = cos * N.x + sin * B.x;
        const ny = cos * N.y + sin * B.y;
        const nz = cos * N.z + sin * B.z;

        vertices.push(
          point.x + radius * nx,
          point.y + radius * ny,
          point.z + radius * nz
        );
        normals.push(nx, ny, nz);
      }
    });

    for (let i = 0; i < points.length - 1; i++) {
      for (let j = 0; j < segs; j++) {
        const a = i * (segs + 1) + j;
        const b = a + 1;
        const c = (i + 1) * (segs + 1) + j;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [upperArmCurve]);

  const forearmCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(xSign * 0.22, -0.42, 0.05),
      new THREE.Vector3(xSign * 0.24, -0.52, 0.08),
      new THREE.Vector3(xSign * 0.22, -0.62, 0.1),
      new THREE.Vector3(xSign * 0.18, -0.72, 0.08),
    ]);
  }, [xSign]);

  const forearmGeo = useMemo(() => {
    return new THREE.TubeGeometry(forearmCurve, 16, 0.07, 10, false);
  }, [forearmCurve]);

  return (
    <group ref={armRef} position={[xSign * 0.98, 0.25, 0.12]}>
      <mesh geometry={upperArmGeo}>
        <meshPhysicalMaterial
          color={BODY_COLOR}
          metalness={0.08}
          roughness={0.22}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          sheen={0.4}
          sheenColor={new THREE.Color(CYAN_BRIGHT)}
          sheenRoughness={0.3}
          envMapIntensity={0.8}
        />
      </mesh>

      <mesh position={[xSign * 0.22, -0.42, 0.05]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshPhysicalMaterial
          color={BODY_DARK}
          metalness={0.15}
          roughness={0.3}
          clearcoat={0.6}
        />
      </mesh>

      <mesh geometry={forearmGeo}>
        <meshPhysicalMaterial
          color={BODY_COLOR}
          metalness={0.08}
          roughness={0.22}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          sheen={0.4}
          sheenColor={new THREE.Color(CYAN_BRIGHT)}
          sheenRoughness={0.3}
          envMapIntensity={0.8}
        />
      </mesh>

      <AlienHand position={[xSign * 0.18, -0.76, 0.08]} side={side} />
    </group>
  );
}

function AlienHand({ position, side }: { position: [number, number, number]; side: 'left' | 'right' }) {
  const xSign = side === 'left' ? -1 : 1;

  const fingerCurves = useMemo(() => {
    const angles = [-0.35, 0, 0.35];
    return angles.map((angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(xSign * sin * 0.06, -0.06 * cos, 0.02),
        new THREE.Vector3(xSign * sin * 0.11, -0.12 * cos, 0.03),
        new THREE.Vector3(xSign * sin * 0.13, -0.16 * cos, 0.02),
      ]);
    });
  }, [xSign]);

  const fingerGeos = useMemo(() => {
    return fingerCurves.map((curve) => new THREE.TubeGeometry(curve, 10, 0.025, 8, false));
  }, [fingerCurves]);

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.07, 14, 14]} />
        <meshPhysicalMaterial
          color={BODY_COLOR}
          metalness={0.08}
          roughness={0.22}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          envMapIntensity={0.8}
        />
      </mesh>

      {fingerGeos.map((geo, i) => (
        <group key={i}>
          <mesh geometry={geo}>
            <meshPhysicalMaterial
              color={BODY_COLOR}
              metalness={0.08}
              roughness={0.25}
              clearcoat={0.8}
              envMapIntensity={0.6}
            />
          </mesh>
          <mesh position={[
            xSign * Math.sin([-0.35, 0, 0.35][i]) * 0.13,
            -0.16 * Math.cos([-0.35, 0, 0.35][i]),
            0.02
          ]}>
            <sphereGeometry args={[0.028, 10, 10]} />
            <meshPhysicalMaterial
              color={BODY_LIGHT}
              metalness={0.05}
              roughness={0.2}
              clearcoat={0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function AlienLeg({ side }: { side: 'left' | 'right' }) {
  const xSign = side === 'left' ? -1 : 1;

  const legGeo = useMemo(() => {
    const geo = new THREE.LatheGeometry(
      [
        new THREE.Vector2(0, -0.28),
        new THREE.Vector2(0.14, -0.26),
        new THREE.Vector2(0.17, -0.18),
        new THREE.Vector2(0.18, -0.05),
        new THREE.Vector2(0.17, 0.05),
        new THREE.Vector2(0.15, 0.15),
        new THREE.Vector2(0.14, 0.22),
        new THREE.Vector2(0.12, 0.28),
        new THREE.Vector2(0, 0.3),
      ],
      16
    );
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group position={[xSign * 0.42, -1.32, 0]}>
      <mesh geometry={legGeo}>
        <meshPhysicalMaterial
          color={BODY_COLOR}
          metalness={0.08}
          roughness={0.22}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          sheen={0.4}
          sheenColor={new THREE.Color(CYAN_BRIGHT)}
          sheenRoughness={0.3}
          envMapIntensity={0.8}
        />
      </mesh>

      <AlienFoot xSign={xSign} />
    </group>
  );
}

function AlienFoot({ xSign }: { xSign: number }) {
  const footGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.12, 0, 0.2, 0.08, 0.22, 0.04);
    shape.bezierCurveTo(0.24, 0, 0.2, -0.08, 0.1, -0.1);
    shape.bezierCurveTo(0.0, -0.12, -0.1, -0.1, -0.12, -0.06);
    shape.bezierCurveTo(-0.14, -0.02, -0.1, 0.02, 0, 0);

    const extrudeSettings = {
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 4,
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group position={[xSign * 0.03, -0.36, 0.08]} rotation={[-Math.PI / 2, 0, xSign * 0.1]}>
      <mesh geometry={footGeo} scale={[1.4, 1.4, 1]}>
        <meshPhysicalMaterial
          color={BODY_DARK}
          metalness={0.12}
          roughness={0.3}
          clearcoat={0.7}
          envMapIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

function Headset() {
  const bandCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.65, 1.1, 0.35),
      new THREE.Vector3(-0.55, 1.45, 0.22),
      new THREE.Vector3(-0.3, 1.62, 0.17),
      new THREE.Vector3(0, 1.68, 0.15),
      new THREE.Vector3(0.3, 1.62, 0.17),
      new THREE.Vector3(0.55, 1.45, 0.22),
      new THREE.Vector3(0.65, 1.1, 0.35),
    ]);
  }, []);

  const bandGeo = useMemo(() => {
    return new THREE.TubeGeometry(bandCurve, 32, 0.03, 10, false);
  }, [bandCurve]);

  const micCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.65, 1.1, 0.38),
      new THREE.Vector3(-0.72, 0.9, 0.48),
      new THREE.Vector3(-0.68, 0.7, 0.6),
      new THREE.Vector3(-0.55, 0.55, 0.7),
      new THREE.Vector3(-0.42, 0.5, 0.75),
    ]);
  }, []);

  const micGeo = useMemo(() => {
    return new THREE.TubeGeometry(micCurve, 20, 0.016, 10, false);
  }, [micCurve]);

  return (
    <group>
      <mesh geometry={bandGeo}>
        <meshPhysicalMaterial
          color="#1e293b"
          metalness={0.7}
          roughness={0.15}
          clearcoat={0.5}
          envMapIntensity={0.6}
        />
      </mesh>

      <mesh position={[0, 1.68, 0.15]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.15, 12]} />
        <meshPhysicalMaterial
          color="#1e293b"
          metalness={0.7}
          roughness={0.15}
        />
      </mesh>

      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.66, 1.05, 0.38]}>
            <cylinderGeometry args={[0.11, 0.1, 0.14, 20]} />
            <meshPhysicalMaterial
              color="#0f172a"
              metalness={0.6}
              roughness={0.2}
              clearcoat={0.4}
              envMapIntensity={0.5}
            />
          </mesh>
          <mesh position={[s * 0.68, 1.05, 0.38]}>
            <torusGeometry args={[0.085, 0.04, 12, 20]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.15}
              roughness={0.7}
            />
          </mesh>
          <mesh position={[s * 0.69, 1.05, 0.38]} rotation={[0, Math.PI / 2, 0]}>
            <ringGeometry args={[0.02, 0.06, 16]} />
            <meshStandardMaterial
              color="#475569"
              metalness={0.3}
              roughness={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      <mesh geometry={micGeo}>
        <meshPhysicalMaterial
          color="#1e293b"
          metalness={0.7}
          roughness={0.15}
          clearcoat={0.3}
        />
      </mesh>

      <group position={[-0.42, 0.5, 0.78]}>
        <mesh>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshPhysicalMaterial
            color="#1e293b"
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <circleGeometry args={[0.025, 16]} />
          <meshStandardMaterial
            color={CYAN_BRIGHT}
            emissive={CYAN_BRIGHT}
            emissiveIntensity={3}
          />
        </mesh>
        <pointLight
          position={[0, 0, 0.05]}
          color={CYAN_BRIGHT}
          intensity={0.2}
          distance={0.8}
          decay={2}
        />
      </group>
    </group>
  );
}

function FloatingHologram() {
  const holoRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

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
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 0.7;
      ring3Ref.current.rotation.x = t * 0.2;
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
        <mesh ref={ring3Ref}>
          <torusGeometry args={[0.15, 0.006, 12, 36]} />
          <meshStandardMaterial
            color={CYAN_BRIGHT}
            emissive={CYAN_BRIGHT}
            emissiveIntensity={0.8}
            transparent
            opacity={0.3}
          />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.1, 1]} />
          <meshStandardMaterial
            color={CYAN_BRIGHT}
            emissive={CYAN_BRIGHT}
            emissiveIntensity={2}
            transparent
            opacity={0.7}
          />
        </mesh>
        <mesh scale={[0.06, 0.06, 0.06]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={CYAN_BRIGHT}
            emissiveIntensity={3}
            transparent
            opacity={0.9}
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

  const { positions, sizes } = useMemo(() => {
    const count = 60;
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      sz[i] = Math.random() * 0.03 + 0.01;
    }
    return { positions: pos, sizes: sz };
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
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color={CYAN_BRIGHT}
        size={0.03}
        transparent
        opacity={0.5}
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
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 6]} intensity={1} color="#f8fafc" />
      <directionalLight position={[-5, 8, -3]} intensity={0.3} color="#e2e8f0" />
      <directionalLight position={[0, -2, 5]} intensity={0.2} color={CYAN} />
      <spotLight
        position={[0, 8, 4]}
        intensity={0.6}
        angle={0.5}
        penumbra={0.8}
        color="#f1f5f9"
        distance={20}
        decay={2}
      />
      <spotLight
        position={[-3, 5, 5]}
        intensity={0.3}
        angle={0.4}
        penumbra={0.9}
        color={CYAN}
        distance={15}
        decay={2}
      />
      <pointLight position={[3, 3, 3]} intensity={0.2} color="#f8fafc" distance={10} decay={2} />
      <pointLight position={[-3, 3, 3]} intensity={0.2} color="#f8fafc" distance={10} decay={2} />
      <pointLight position={[0, -1, 4]} intensity={0.15} color={CYAN} distance={8} decay={2} />
      <pointLight position={[0, 2, -2]} intensity={0.1} color="#94a3b8" distance={8} decay={2} />
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
