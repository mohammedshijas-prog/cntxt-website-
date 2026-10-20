"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { liteDevice } from "@/lib/device";

/*
 * Careers benefits as one small isometric world, drawn like the Physical AI
 * factory: white solids, ink outlines, purple for what matters. Four corners,
 * one per benefit; the camera glides to the corner of the open benefit.
 */

const INK = "#15111f";
const PAPER = "#ffffff";
const ACCENT = "#7d52f4";
const LILAC = "#cbbcff";
const SOFT = "#efe9fd";
const FLOOR = "#f3f1f8";
const SKIN = "#e9d9cf";

/** Where each benefit's corner sits on the floor (x, z). */
const SPOTS: [number, number][] = [
  [0, 0],
  [8, 0],
  [16, 0],
  [24, 0],
];

const edgeMaterial = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.85 });
const edgesCache = new WeakMap<THREE.BufferGeometry, THREE.EdgesGeometry>();
const edgesFor = (geometry: THREE.BufferGeometry) => {
  let edges = edgesCache.get(geometry);
  if (!edges) {
    edges = new THREE.EdgesGeometry(geometry, 30);
    edgesCache.set(geometry, edges);
  }
  return edges;
};
const materials = new Map<string, THREE.MeshLambertMaterial>();
const materialFor = (color: string) => {
  let material = materials.get(color);
  if (!material) {
    material = new THREE.MeshLambertMaterial({ color });
    materials.set(color, material);
  }
  return material;
};
const shapes = new Map<string, THREE.BufferGeometry>();
const shape = (key: string, make: () => THREE.BufferGeometry) => {
  let geometry = shapes.get(key);
  if (!geometry) {
    geometry = make();
    shapes.set(key, geometry);
  }
  return geometry;
};
const box = (w: number, h: number, d: number) => shape(`b${w},${h},${d}`, () => new THREE.BoxGeometry(w, h, d));
const cyl = (r: number, h: number, seg = 24) => shape(`c${r},${h},${seg}`, () => new THREE.CylinderGeometry(r, r, h, seg));
const ball = (r: number) => shape(`s${r}`, () => new THREE.SphereGeometry(r, 20, 14));
const capsule = (r: number, l: number) => shape(`k${r},${l}`, () => new THREE.CapsuleGeometry(r, l, 6, 14));

function Solid({
  geometry,
  color = PAPER,
  position,
  rotation,
  edges = true,
  children,
}: {
  geometry: THREE.BufferGeometry;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  edges?: boolean;
  children?: ReactNode;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry} material={materialFor(color)} />
      {edges ? <lineSegments geometry={edgesFor(geometry)} material={edgeMaterial} /> : null}
      {children}
    </group>
  );
}

/** A person, standing or seated, with an optional raised arm. */
function Person({
  position,
  turn = 0,
  seated = false,
  shirt = LILAC,
  point = false,
}: {
  position: [number, number, number];
  turn?: number;
  seated?: boolean;
  shirt?: string;
  point?: boolean;
}) {
  const arm = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime + position[0];
    if (body.current) body.current.position.y = Math.sin(t * 1.6) * 0.012;
    if (arm.current && point) arm.current.rotation.x = -1.2 + Math.sin(t * 1.4) * 0.18;
  });
  const lift = seated ? -0.45 : 0;
  return (
    <group position={position} rotation={[0, turn, 0]}>
      <group ref={body}>
        {seated ? (
          [-0.12, 0.12].map((x) => <Solid key={x} geometry={capsule(0.1, 0.42)} position={[x, 0.68, 0.22]} rotation={[Math.PI / 2, 0, 0]} color="#d9d2ef" />)
        ) : (
          [-0.12, 0.12].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <Solid geometry={box(0.14, 0.09, 0.28)} position={[0, 0.05, 0.05]} color={INK} />
              <Solid geometry={capsule(0.09, 0.84)} position={[0, 0.56, 0]} color="#d9d2ef" />
            </group>
          ))
        )}
        <Solid geometry={capsule(0.25, 0.5)} position={[0, 1.55 + lift, 0]} color={shirt} />
        <Solid geometry={ball(0.22)} position={[0, 2.22 + lift, 0]} color={SKIN} />
        <mesh geometry={shape("hair", () => new THREE.SphereGeometry(0.235, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2.1))} material={materialFor(INK)} position={[0, 2.25 + lift, -0.01]} />
        <Solid geometry={capsule(0.075, 0.6)} position={[-0.34, 1.5 + lift, 0]} rotation={[0, 0, 0.12]} color={shirt} />
        <group ref={arm} position={[0.34, 1.8 + lift, 0]} rotation={[point ? -1.2 : seated ? -0.9 : 0, 0, -0.12]}>
          <Solid geometry={capsule(0.075, 0.6)} position={[0, -0.36, 0]} color={shirt} />
          <Solid geometry={ball(0.07)} position={[0, -0.72, 0]} color={SKIN} />
        </group>
      </group>
    </group>
  );
}

/** A desk with a screen; the screen face can carry a drawing. */
function Desk({ position, turn = 0, children }: { position: [number, number, number]; turn?: number; children?: ReactNode }) {
  return (
    <group position={position} rotation={[0, turn, 0]}>
      <Solid geometry={box(1.8, 0.08, 0.9)} position={[0, 0.95, 0]} />
      {[-0.8, 0.8].map((x) => (
        <Solid key={x} geometry={box(0.06, 0.95, 0.8)} position={[x, 0.47, 0]} />
      ))}
      <Solid geometry={box(1.2, 0.74, 0.06)} position={[0, 1.5, -0.3]} />
      <Solid geometry={box(0.08, 0.2, 0.08)} position={[0, 1.08, -0.3]} />
      <group position={[0, 1.5, -0.265]}>{children}</group>
    </group>
  );
}

function Chair({ position, turn = 0 }: { position: [number, number, number]; turn?: number }) {
  return (
    <group position={position} rotation={[0, turn, 0]}>
      <Solid geometry={box(0.6, 0.08, 0.6)} position={[0, 0.5, 0]} color={LILAC} />
      <Solid geometry={box(0.6, 0.6, 0.08)} position={[0, 0.82, 0.28]} color={LILAC} />
      <Solid geometry={cyl(0.04, 0.5, 8)} position={[0, 0.25, 0]} />
    </group>
  );
}

/* ---------------- 01 Mentorship ---------------- */
function Mentorship() {
  const dots = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    dots.current?.children.forEach((dot, i) => {
      const p = (t * 0.45 + i / 5) % 1;
      dot.position.set(THREE.MathUtils.lerp(0.9, -0.3, p), 2.5 + Math.sin(p * Math.PI) * 0.7, THREE.MathUtils.lerp(0.4, 0.2, p));
      dot.scale.setScalar(0.6 + Math.sin(p * Math.PI) * 0.6);
    });
  });
  return (
    <group position={[SPOTS[0][0], 0, SPOTS[0][1]]}>
      <Desk position={[-0.4, 0, -0.4]}>
        <mesh geometry={shape("face", () => new THREE.PlaneGeometry(1.1, 0.64))}>
          <meshBasicMaterial color={SOFT} />
        </mesh>
        {[0.18, 0.02, -0.14].map((y, i) => (
          <mesh key={y} position={[-0.15 + i * 0.05, y, 0.01]} geometry={shape(`ln${i}`, () => new THREE.PlaneGeometry(0.6 - i * 0.12, 0.06))}>
            <meshBasicMaterial color={i === 0 ? ACCENT : LILAC} />
          </mesh>
        ))}
      </Desk>
      <Chair position={[-0.4, 0, 0.35]} turn={0} />
      <Person position={[-0.4, 0, 0.3]} turn={Math.PI} seated shirt={PAPER} />
      <Person position={[1.3, 0, 0.85]} turn={-Math.PI / 2.4} point shirt={ACCENT} />
      <group ref={dots}>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={i} geometry={ball(0.07)}>
            <meshBasicMaterial color={ACCENT} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ---------------- 02 Hands-on projects ---------------- */
function Projects() {
  const belt = useRef<THREE.Group>(null);
  const boxes = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    belt.current?.children.forEach((cube, i) => {
      const p = (t * 0.22 + i / 4) % 1;
      cube.position.x = THREE.MathUtils.lerp(-1.8, 1.8, p);
      (cube.children[0] as THREE.Mesh).material = materialFor(p > 0.55 ? ACCENT : PAPER);
    });
    boxes.current?.children.forEach((frame, i) => {
      frame.scale.setScalar(0.92 + Math.max(0, Math.sin(t * 2 - i)) * 0.12);
    });
  });
  return (
    <group position={[SPOTS[1][0], 0, SPOTS[1][1]]}>
      <Desk position={[0, 0, -1.1]}>
        <mesh geometry={shape("face", () => new THREE.PlaneGeometry(1.1, 0.64))}>
          <meshBasicMaterial color={SOFT} />
        </mesh>
        {/* A labelled frame: two boxes drawn around what matters. */}
        <group ref={boxes}>
          {[
            [-0.22, 0.02, 0.36, 0.4],
            [0.24, -0.04, 0.3, 0.3],
          ].map(([x, y, w, h], i) => (
            <lineSegments key={i} position={[x, y, 0.012]} geometry={shape(`frame${i}`, () => new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, h)))}>
              <lineBasicMaterial color={ACCENT} />
            </lineSegments>
          ))}
        </group>
      </Desk>
      <Chair position={[0, 0, -0.35]} />
      <Person position={[0, 0, -0.4]} turn={Math.PI} seated shirt={LILAC} />
      {/* Data on a belt: grey in, labelled purple out. */}
      <Solid geometry={box(4, 0.3, 0.7)} position={[0, 0.35, 1.2]} />
      <group ref={belt} position={[0, 0.72, 1.2]}>
        {Array.from({ length: 4 }, (_, i) => (
          <group key={i}>
            <mesh geometry={box(0.42, 0.42, 0.42)} material={materialFor(PAPER)} />
            <lineSegments geometry={edgesFor(box(0.42, 0.42, 0.42))} material={edgeMaterial} />
          </group>
        ))}
      </group>
    </group>
  );
}

/* ---------------- 03 Professional certifications ---------------- */
function Certifications() {
  const badge = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (badge.current) {
      badge.current.rotation.y = clock.elapsedTime * 0.8;
      badge.current.position.y = 2.15 + Math.sin(clock.elapsedTime * 1.5) * 0.08;
    }
  });
  const check = useMemo(() => {
    const path = new THREE.Shape();
    path.moveTo(-0.22, 0.02);
    path.lineTo(-0.07, -0.14);
    path.lineTo(0.24, 0.18);
    path.lineTo(0.18, 0.24);
    path.lineTo(-0.07, -0.02);
    path.lineTo(-0.16, -0.08);
    path.closePath();
    return new THREE.ShapeGeometry(path);
  }, []);
  return (
    <group position={[SPOTS[2][0], 0, SPOTS[2][1]]}>
      {/* Plinth with a turning badge. */}
      <Solid geometry={box(1.3, 0.9, 1.3)} position={[0.6, 0.45, 0.2]} />
      <Solid geometry={box(1.0, 0.12, 1.0)} position={[0.6, 0.96, 0.2]} color={LILAC} />
      <group ref={badge} position={[0.6, 2.15, 0.2]}>
        <Solid geometry={cyl(0.55, 0.12, 40)} rotation={[Math.PI / 2, 0, 0]} color={ACCENT} />
        <Solid geometry={cyl(0.4, 0.14, 40)} rotation={[Math.PI / 2, 0, 0]} color={PAPER} />
        {[1, -1].map((side) => (
          <mesh key={side} geometry={check} position={[0, 0, side * 0.08]} rotation={[0, side < 0 ? Math.PI : 0, 0]}>
            <meshBasicMaterial color={ACCENT} side={THREE.DoubleSide} />
          </mesh>
        ))}
        {[-0.22, 0.22].map((x) => (
          <Solid key={x} geometry={box(0.18, 0.6, 0.04)} position={[x, -0.75, 0]} rotation={[0, 0, x > 0 ? -0.25 : 0.25]} color={LILAC} />
        ))}
      </group>
      {/* The certificate on an easel. */}
      <group position={[-1.2, 0, -0.6]} rotation={[0, 0.5, 0]}>
        <Solid geometry={box(1.3, 0.95, 0.06)} position={[0, 1.5, 0]} rotation={[-0.15, 0, 0]} />
        <group position={[0, 1.5, 0.04]} rotation={[-0.15, 0, 0]}>
          <mesh geometry={shape("cert", () => new THREE.PlaneGeometry(1.1, 0.75))}>
            <meshBasicMaterial color={SOFT} />
          </mesh>
          {[0.2, 0.06, -0.06].map((y, i) => (
            <mesh key={y} position={[-0.1, y, 0.01]} geometry={shape(`cl${i}`, () => new THREE.PlaneGeometry(0.7 - i * 0.15, 0.05))}>
              <meshBasicMaterial color={i === 0 ? INK : LILAC} />
            </mesh>
          ))}
          <mesh position={[0.32, -0.2, 0.012]} geometry={shape("seal", () => new THREE.CircleGeometry(0.11, 24))}>
            <meshBasicMaterial color={ACCENT} />
          </mesh>
        </group>
        {[-0.45, 0.45].map((x) => (
          <Solid key={x} geometry={box(0.06, 1.1, 0.06)} position={[x, 0.55, 0.15]} />
        ))}
      </group>
      <Person position={[-0.2, 0, 1.2]} turn={-Math.PI / 4} shirt={PAPER} />
    </group>
  );
}

/* ---------------- 04 Remote and on-site ---------------- */
function RemoteOnsite() {
  const packets = useRef<THREE.Group>(null);
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(-1.6, 1.4, 0.6), new THREE.Vector3(-0.2, 2.6, 0.4), new THREE.Vector3(1.4, 2.9, -0.2)]),
    [],
  );
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 40, 0.025, 6), [curve]);
  useFrame(({ clock }) => {
    packets.current?.children.forEach((packet, i) => {
      const p = (clock.elapsedTime * 0.3 + i / 3) % 1;
      packet.position.copy(curve.getPoint(i % 2 ? 1 - p : p));
    });
  });
  const roof = useMemo(() => new THREE.ConeGeometry(1.0, 0.7, 4), []);
  return (
    <group position={[SPOTS[3][0], 0, SPOTS[3][1]]}>
      {/* Home: remote. */}
      <group position={[-2, 0, 0.8]}>
        <Solid geometry={box(1.4, 1.0, 1.2)} position={[0, 0.5, 0]} />
        <Solid geometry={roof} position={[0, 1.35, 0]} rotation={[0, Math.PI / 4, 0]} color={LILAC} />
        <Solid geometry={box(0.3, 0.55, 0.04)} position={[0.25, 0.28, 0.62]} color={ACCENT} />
        <Solid geometry={box(0.34, 0.28, 0.04)} position={[-0.3, 0.6, 0.62]} color={SOFT} />
      </group>
      {/* Office: on site. */}
      <group position={[1.6, 0, -0.6]}>
        <Solid geometry={box(1.6, 2.8, 1.4)} position={[0, 1.4, 0]} />
        {[0.7, 1.3, 1.9, 2.5].map((y) =>
          [-0.4, 0, 0.4].map((x) => <Solid key={`${x}${y}`} geometry={box(0.24, 0.3, 0.04)} position={[x, y, 0.72]} color={y === 1.9 && x === 0 ? ACCENT : SOFT} edges={false} />),
        )}
        <Solid geometry={box(0.42, 0.5, 0.04)} position={[0, 0.25, 0.72]} color={LILAC} />
      </group>
      <mesh geometry={tube}>
        <meshBasicMaterial color={LILAC} />
      </mesh>
      <group ref={packets}>
        {Array.from({ length: 3 }, (_, i) => (
          <group key={i}>
            <mesh geometry={box(0.2, 0.2, 0.2)} material={materialFor(ACCENT)} />
          </group>
        ))}
      </group>
      <Person position={[-0.3, 0, 1.4]} turn={0.4} shirt={LILAC} />
    </group>
  );
}

function Floor() {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(60, 60, "#ddd6ee", "#e8e3f3");
    g.position.set(12, 0.001, 0);
    return g;
  }, []);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[12, 0, 0]}>
        <planeGeometry args={[60, 30]} />
        <meshBasicMaterial color={FLOOR} />
      </mesh>
      <primitive object={grid} />
      {SPOTS.map(([x, z]) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.002, z]}>
          <circleGeometry args={[3, 48]} />
          <meshBasicMaterial color="#ebe5f8" />
        </mesh>
      ))}
    </>
  );
}

/** Glides the isometric camera to the open benefit's corner. */
function Rig({ active, snap }: { active: number; snap: boolean }) {
  const invalidate = useThree((state) => state.invalidate);
  const target = useRef(new THREE.Vector3(SPOTS[0][0], 1.1, SPOTS[0][1]));
  const goal = useRef(new THREE.Vector3());
  // When frames only render on demand (reduced motion, off screen), jump straight there.
  useEffect(() => {
    if (snap) {
      const [x, z] = SPOTS[Math.max(0, Math.min(SPOTS.length - 1, active))];
      target.current.set(x, 1.1, z);
    }
    invalidate();
  }, [active, snap, invalidate]);
  useFrame((state, delta) => {
    const { camera, size } = state;
    const [x, z] = SPOTS[Math.max(0, Math.min(SPOTS.length - 1, active))];
    target.current.lerp(goal.current.set(x, 1.1, z), 1 - Math.exp(-delta * 3.5));
    camera.position.set(target.current.x + 10, target.current.y + 9, target.current.z + 10);
    camera.lookAt(target.current);
    const ortho = camera as THREE.OrthographicCamera;
    ortho.zoom = Math.min(size.width, size.height) / 5.3;
    ortho.updateProjectionMatrix();
  });
  return null;
}

export default function BenefitScene({ active, className }: { active: number; className?: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [lite] = useState(liteDevice);
  const [reduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const node = holder.current;
    if (!node) return;
    const seen = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    seen.observe(node);
    return () => seen.disconnect();
  }, []);

  return (
    <div ref={holder} className={className} aria-hidden="true">
      <Canvas
        orthographic
        dpr={lite ? 1 : [1, 1.5]}
        camera={{ position: [10, 10, 10], zoom: 70, near: -100, far: 200 }}
        gl={{ antialias: !lite, alpha: false, powerPreference: lite ? "low-power" : "default" }}
        frameloop={visible && !reduced ? "always" : "demand"}
      >
        <color attach="background" args={[FLOOR]} />
        <ambientLight intensity={2.2} />
        <directionalLight position={[6, 12, 4]} intensity={1.1} />
        <Floor />
        <Mentorship />
        <Projects />
        <Certifications />
        <RemoteOnsite />
        <Rig active={active} snap={reduced || !visible} />
      </Canvas>
    </div>
  );
}
