"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";

/*
 * An isometric factory drawn the way an engineer sketches one: white solids
 * with ink outlines on a light grid, purple for the parts that matter.
 * Four stations sit along the floor; `progress` (0..3) pans the camera from
 * one to the next.
 */

type Ref = { current: number };

const INK = "#15111f";
const PAPER = "#ffffff";
const ACCENT = "#7d52f4";
const LILAC = "#cbbcff";
const FLOOR = "#f3f1f8";

/** Station centres along the floor, in walk order. */
export const STATIONS: [number, number][] = [
  [0, 0],
  [9, -1],
  [18, 0],
  [27, -1],
];

const edgeMaterial = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.9 });

/*
 * Shared caches: the world has hundreds of solids but only a few dozen unique
 * shapes and colours. Building each outline, material and geometry once keeps
 * the first frames from stalling the main thread.
 */
const edgesCache = new WeakMap<THREE.BufferGeometry, THREE.EdgesGeometry>();
const edgesFor = (geometry: THREE.BufferGeometry) => {
  let edges = edgesCache.get(geometry);
  if (!edges) {
    edges = new THREE.EdgesGeometry(geometry, 30);
    edgesCache.set(geometry, edges);
  }
  return edges;
};

const materialCache = new Map<string, THREE.MeshLambertMaterial>();
const materialFor = (color: string) => {
  let material = materialCache.get(color);
  if (!material) {
    material = new THREE.MeshLambertMaterial({ color });
    materialCache.set(color, material);
  }
  return material;
};

const geometryCache = new Map<string, THREE.BufferGeometry>();
const cached = (key: string, make: () => THREE.BufferGeometry) => {
  let geometry = geometryCache.get(key);
  if (!geometry) {
    geometry = make();
    geometryCache.set(key, geometry);
  }
  return geometry;
};

/** A solid with an ink outline. */
function Solid({
  geometry,
  color = PAPER,
  position,
  rotation,
  scale,
  edges = true,
  children,
}: {
  geometry: THREE.BufferGeometry;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  edges?: boolean;
  children?: ReactNode;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={geometry} material={materialFor(color)} />
      {edges ? <lineSegments geometry={edgesFor(geometry)} material={edgeMaterial} /> : null}
      {children}
    </group>
  );
}

const box = (w: number, h: number, d: number) => cached(`b${w},${h},${d}`, () => new THREE.BoxGeometry(w, h, d));
const cyl = (r: number, h: number, seg = 20) => cached(`c${r},${h},${seg}`, () => new THREE.CylinderGeometry(r, r, h, seg));

/* ---------------- Station 1: real work on the floor ---------------- */

const BAND = "#f7f7f9";
const MINT = "#bfeee0";
const SKIN = "#e9d9cf";

/** Shared body parts for people in the world, built once for everyone. */
let personParts: ReturnType<typeof makePersonParts> | null = null;
function usePersonParts() {
  if (!personParts) personParts = makePersonParts();
  return personParts;
}

function makePersonParts() {
  return {
      head: new THREE.SphereGeometry(0.22, 24, 16),
      hair: new THREE.SphereGeometry(0.235, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2.1),
      neck: cyl(0.08, 0.16, 12),
      torso: new THREE.CapsuleGeometry(0.25, 0.5, 8, 18),
      hips: new THREE.CapsuleGeometry(0.22, 0.12, 6, 16),
      thigh: new THREE.CapsuleGeometry(0.1, 0.42, 4, 12),
      shin: new THREE.CapsuleGeometry(0.085, 0.42, 4, 12),
      shoe: box(0.14, 0.09, 0.28),
      upper: new THREE.CapsuleGeometry(0.075, 0.34, 4, 12),
      fore: new THREE.CapsuleGeometry(0.065, 0.32, 4, 12),
      hand: new THREE.SphereGeometry(0.07, 12, 10),
      band: new THREE.TorusGeometry(0.235, 0.032, 8, 36),
      bandUnit: box(0.12, 0.08, 0.06),
      lens: cyl(0.028, 0.03, 12),
      wrist: new THREE.TorusGeometry(0.08, 0.028, 8, 20),
      wristCam: box(0.07, 0.05, 0.06),
      dot: new THREE.SphereGeometry(0.025, 10, 8),
  };
}

/** The real kit on a person: Roboband on the head, a wristband on each wrist. */
function Kit3D({ g, rec }: { g: ReturnType<typeof usePersonParts>; rec?: React.RefObject<THREE.Mesh | null> }) {
  return (
    <group position={[0, 2.28, 0]}>
      <Solid geometry={g.band} rotation={[Math.PI / 2, 0, 0]} color={BAND} />
      {[-0.32, 0.32].map((a) => (
        <group key={a} position={[Math.sin(a) * 0.24, 0, Math.cos(a) * 0.24]} rotation={[0, a, 0]}>
          <Solid geometry={g.bandUnit} color={BAND} />
          <Solid geometry={g.lens} position={[0, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]} color={INK} edges={false} />
        </group>
      ))}
      {rec ? (
        <mesh geometry={g.dot} position={[0, 0.06, 0.27]} ref={rec}>
          <meshBasicMaterial color="#ff4d4d" transparent />
        </mesh>
      ) : null}
    </group>
  );
}

function Arm2({ g, side, reach }: { g: ReturnType<typeof usePersonParts>; side: 1 | -1; reach?: React.RefObject<THREE.Group | null> }) {
  return (
    <group ref={reach} position={[side * 0.34, 1.82, 0]} rotation={[-0.3, 0, side * 0.12]}>
      <Solid geometry={g.upper} position={[0, -0.24, 0]} color={LILAC} />
      <group position={[0, -0.46, 0]} rotation={[-0.7, 0, 0]}>
        <Solid geometry={g.fore} position={[0, -0.2, 0]} color={SKIN} />
        <Solid geometry={g.wrist} position={[0, -0.34, 0]} rotation={[Math.PI / 2, 0, 0]} color={MINT} />
        <Solid geometry={g.wristCam} position={[0, -0.34, 0.09]} color={MINT} />
        <Solid geometry={g.hand} position={[0, -0.46, 0]} color={SKIN} />
      </group>
    </group>
  );
}

function Worker({
  active,
  position = [-1.2, 0, 0.6],
  turn = Math.PI / 5,
}: {
  active: Ref;
  position?: [number, number, number];
  turn?: number;
}) {
  const body = useRef<THREE.Group>(null);
  const arm = useRef<THREE.Group>(null);
  const rec = useRef<THREE.Mesh>(null);
  const g = usePersonParts();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (body.current) body.current.position.y = Math.sin(t * 2) * 0.015;
    if (arm.current) arm.current.rotation.x = -0.6 + Math.sin(t * 2.2) * 0.45 * (0.4 + active.current);
    if (rec.current) (rec.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(t * 6) > 0 ? 1 : 0.2;
  });
  return (
    <group position={position} rotation={[0, turn, 0]}>
      <group ref={body}>
        {[-0.12, 0.12].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <Solid geometry={g.shoe} position={[0, 0.05, 0.05]} color={INK} />
            <Solid geometry={g.shin} position={[0, 0.36, 0]} color="#d9d2ef" />
            <Solid geometry={g.thigh} position={[0, 0.82, 0]} color="#d9d2ef" />
          </group>
        ))}
        <Solid geometry={g.hips} position={[0, 1.1, 0]} rotation={[0, 0, Math.PI / 2]} color="#d9d2ef" />
        <Solid geometry={g.torso} position={[0, 1.55, 0]} color={LILAC} />
        <Solid geometry={g.neck} position={[0, 1.98, 0]} color={SKIN} />
        <Solid geometry={g.head} position={[0, 2.22, 0]} color={SKIN} />
        <Solid geometry={g.hair} position={[0, 2.25, -0.01]} color={INK} edges={false} />
        <Kit3D g={g} rec={rec} />
        <Emitter position={[0, 2.3, 0]} />
        <Arm2 g={g} side={-1} />
        <Arm2 g={g} side={1} reach={arm} />
      </group>
    </group>
  );
}

/** A reviewer at a screen: a person checks every recording. */
function Reviewer({ position, turn = 0 }: { position: [number, number, number]; turn?: number }) {
  const g = usePersonParts();
  const parts = useMemo(
    () => ({ seat: box(0.6, 0.08, 0.6), back: box(0.6, 0.6, 0.08), post: cyl(0.04, 0.5, 8), desk: box(1.3, 0.08, 0.7), screen: box(0.9, 0.56, 0.05), face: new THREE.PlaneGeometry(0.82, 0.48) }),
    [],
  );
  const head = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (head.current) head.current.rotation.y = Math.sin(clock.elapsedTime * 0.7 + position[0]) * 0.15;
  });
  return (
    <group position={position} rotation={[0, turn, 0]}>
      <Solid geometry={parts.desk} position={[0, 1.0, -0.55]} />
      <Solid geometry={parts.post} position={[0, 0.75, -0.55]} />
      <Solid geometry={parts.screen} position={[0, 1.4, -0.75]} />
      <mesh geometry={parts.face} position={[0, 1.4, -0.72]}>
        <meshBasicMaterial color="#efe9fd" />
      </mesh>
      <Solid geometry={parts.seat} position={[0, 0.55, 0.15]} color={LILAC} />
      <Solid geometry={parts.back} position={[0, 0.85, 0.45]} color={LILAC} />
      <Solid geometry={parts.post} position={[0, 0.27, 0.15]} />
      <group position={[0, -0.6, 0.15]}>
        <Solid geometry={g.thigh} position={[-0.12, 1.25, -0.2]} rotation={[Math.PI / 2, 0, 0]} color="#d9d2ef" />
        <Solid geometry={g.thigh} position={[0.12, 1.25, -0.2]} rotation={[Math.PI / 2, 0, 0]} color="#d9d2ef" />
        <Solid geometry={g.torso} position={[0, 1.65, 0.05]} color={PAPER} />
        <Solid geometry={g.neck} position={[0, 2.08, 0.02]} color={SKIN} />
        <group ref={head} position={[0, 2.3, 0]}>
          <Solid geometry={g.head} color={SKIN} />
          <Solid geometry={g.hair} position={[0, 0.03, 0]} color={INK} edges={false} />
        </group>
        <Solid geometry={g.upper} position={[-0.3, 1.75, -0.15]} rotation={[0.9, 0, 0]} color={PAPER} />
        <Solid geometry={g.upper} position={[0.3, 1.75, -0.15]} rotation={[0.9, 0, 0]} color={PAPER} />
      </group>
    </group>
  );
}

function Bin({ position, fill = ACCENT }: { position: [number, number, number]; fill?: string }) {
  const g = useMemo(() => ({ shell: box(1.8, 0.9, 1.2), part: box(0.32, 0.22, 0.32) }), []);
  const parts: [number, number][] = [];
  for (let x = -0.6; x <= 0.61; x += 0.4) for (let z = -0.3; z <= 0.31; z += 0.4) parts.push([x, z]);
  return (
    <group position={position}>
      <Solid geometry={g.shell} position={[0, 0.45, 0]} />
      {parts.map(([x, z]) => (
        <Solid key={`${x}${z}`} geometry={g.part} position={[x, 0.95, z]} color={fill} />
      ))}
    </group>
  );
}

function StationCapture({ active }: { active: Ref }) {
  const g = useMemo(() => ({ top: box(3.2, 0.12, 1.4), leg: box(0.1, 1.1, 0.1) }), []);
  return (
    <group position={[STATIONS[0][0], 0, STATIONS[0][1]]}>
      {/* Workbench */}
      <Solid geometry={g.top} position={[0.6, 1.15, -0.6]} />
      {[
        [-0.9, -1.2],
        [2.1, -1.2],
        [-0.9, 0],
        [2.1, 0],
      ].map(([x, z]) => (
        <Solid key={`${x}${z}`} geometry={g.leg} position={[x, 0.55, z]} />
      ))}
      <Bin position={[0.2, 1.21, -0.6]} />
      <Bin position={[2.6, 0, 1.4]} fill={LILAC} />
      <Worker active={active} />
    </group>
  );
}

/* ---------------- Data stream between stations ---------------- */

function DataStream({ from, to, active }: { from: THREE.Vector3; to: THREE.Vector3; active: Ref }) {
  const count = 90;
  const ref = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => new THREE.SphereGeometry(0.06, 8, 6), []);
  const seeds = useMemo(() => Array.from({ length: count }, (_, i) => i / count), []);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = clock.elapsedTime * 0.1;
    seeds.forEach((s, i) => {
      const k = (s + t) % 1;
      tmp.position.lerpVectors(from, to, k);
      tmp.position.y += Math.sin(k * Math.PI) * 1.5 + Math.sin(i * 7.1) * 0.3;
      tmp.position.z += Math.sin(i * 3.3) * 0.6;
      tmp.scale.setScalar((0.5 + 0.9 * Math.sin(k * Math.PI)) * (0.5 + active.current * 0.8));
      tmp.updateMatrix();
      mesh.setMatrixAt(i, tmp.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[geo, undefined, count]}>
      <meshBasicMaterial color={ACCENT} />
    </instancedMesh>
  );
}

/** Dots rising off a camera as it records: the data being made. */
function Emitter({ position }: { position: [number, number, number] }) {
  const count = 18;
  const ref = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => new THREE.SphereGeometry(0.035, 6, 5), []);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      const k = (clock.elapsedTime * 0.35 + i / count) % 1;
      tmp.position.set(Math.sin(i * 2.4) * 0.25 * k, k * 1.4, 0.3 + Math.cos(i * 1.7) * 0.25 * k);
      tmp.scale.setScalar(1 - k);
      tmp.updateMatrix();
      mesh.setMatrixAt(i, tmp.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[geo, undefined, count]} position={position}>
      <meshBasicMaterial color={ACCENT} />
    </instancedMesh>
  );
}

/* ---------------- Station 2: verify and label ---------------- */

function StationLabel({ active }: { active: Ref }) {
  const g = useMemo(
    () => ({
      desk: box(2.8, 0.12, 1.3),
      leg: box(0.1, 1.05, 0.1),
      monitor: box(1.9, 1.2, 0.1),
      stand: box(0.12, 0.5, 0.12),
      screen: new THREE.PlaneGeometry(1.75, 1.05),
      boxA: new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.5, 0.42)),
      boxB: new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.36, 0.5)),
      check: new THREE.SphereGeometry(0.09, 12, 8),
      chair: box(0.6, 0.1, 0.6),
    }),
    [],
  );
  const scan = useRef<THREE.Mesh>(null);
  const marks = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (scan.current) scan.current.position.y = 1.85 + Math.sin(t * 1.6) * 0.42;
    if (marks.current) marks.current.scale.setScalar(0.9 + active.current * 0.1 + Math.sin(t * 3) * 0.03);
  });
  return (
    <group position={[STATIONS[1][0], 0, STATIONS[1][1]]} rotation={[0, -0.25, 0]}>
      <Solid geometry={g.desk} position={[0, 1.05, 0]} />
      {[
        [-1.25, -0.5],
        [1.25, -0.5],
        [-1.25, 0.5],
        [1.25, 0.5],
      ].map(([x, z]) => (
        <Solid key={`${x}${z}`} geometry={g.leg} position={[x, 0.52, z]} />
      ))}
      <Solid geometry={g.stand} position={[0, 1.36, -0.3]} />
      <Solid geometry={g.monitor} position={[0, 1.85, -0.35]} />
      <mesh geometry={g.screen} position={[0, 1.85, -0.29]}>
        <meshBasicMaterial color="#efe9fd" />
      </mesh>
      {/* Bounding boxes and labels on the frame being reviewed */}
      <group ref={marks} position={[0, 1.85, -0.28]}>
        <lineSegments geometry={g.boxA} position={[-0.42, -0.08, 0]}>
          <lineBasicMaterial color={ACCENT} />
        </lineSegments>
        <lineSegments geometry={g.boxB} position={[0.38, 0.05, 0]}>
          <lineBasicMaterial color={ACCENT} />
        </lineSegments>
        <mesh geometry={g.check} position={[0.72, 0.38, 0.01]}>
          <meshBasicMaterial color={ACCENT} />
        </mesh>
      </group>
      <mesh ref={scan} position={[0, 1.85, -0.27]}>
        <planeGeometry args={[1.75, 0.03]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.6} />
      </mesh>
      <Solid geometry={g.chair} position={[0, 0.6, 1.05]} color={LILAC} />
      {/* The review room: people check every recording before it is accepted */}
      <Reviewer position={[2.6, 0, 0.9]} />
      <Reviewer position={[4.2, 0, 0.9]} />
      <Reviewer position={[2.6, 0, 2.7]} />
      <Reviewer position={[4.2, 0, 2.7]} />
    </group>
  );
}

/* ---------------- Robot arm, shared by stations 3 and 4 ---------------- */

function Arm({
  position,
  mirror = 1,
  speed = 1,
  active,
}: {
  position: [number, number, number];
  mirror?: number;
  speed?: number;
  active: Ref;
}) {
  const g = useMemo(
    () => ({
      base: cyl(0.32, 0.3),
      joint: new THREE.SphereGeometry(0.17, 16, 12),
      link: new THREE.CapsuleGeometry(0.11, 0.9, 6, 14),
      grip: box(0.08, 0.26, 0.08),
    }),
    [],
  );
  const shoulder = useRef<THREE.Group>(null);
  const elbow = useRef<THREE.Group>(null);
  const yaw = useRef<THREE.Group>(null);
  const fingers = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    const a = 0.25 + active.current * 0.75;
    const phase = (Math.sin(t * 1.4) + 1) / 2; // 0 = over the bin, 1 = over the conveyor
    if (yaw.current) yaw.current.rotation.y = mirror * (-0.9 + phase * 1.8 * a);
    if (shoulder.current) shoulder.current.rotation.z = mirror * (0.5 + Math.sin(t * 2.8) * 0.18 * a);
    if (elbow.current) elbow.current.rotation.z = mirror * (-1.2 + Math.cos(t * 2.8) * 0.22 * a);
    if (fingers.current) fingers.current.scale.x = 0.7 + Math.abs(Math.sin(t * 2.8)) * 0.6;
  });
  return (
    <group position={position}>
      <Solid geometry={g.base} position={[0, 0.15, 0]} color={ACCENT} />
      <group ref={yaw} position={[0, 0.3, 0]}>
        <Solid geometry={g.joint} position={[0, 0.1, 0]} color={ACCENT} />
        <group ref={shoulder} position={[0, 0.1, 0]}>
          <Solid geometry={g.link} position={[0, 0.6, 0]} />
          <group ref={elbow} position={[0, 1.2, 0]}>
            <Solid geometry={g.joint} color={ACCENT} />
            <Solid geometry={g.link} position={[0, 0.58, 0]} />
            <group ref={fingers} position={[0, 1.15, 0]}>
              <Solid geometry={g.grip} position={[-0.08, 0.1, 0]} />
              <Solid geometry={g.grip} position={[0.08, 0.1, 0]} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

/* ---------------- Station 3: train and set up ---------------- */

function StationTrain({ active }: { active: Ref }) {
  const g = useMemo(
    () => ({
      rack: box(1.1, 2.6, 1),
      slot: box(0.9, 0.06, 0.02),
      led: new THREE.SphereGeometry(0.04, 8, 6),
      cell: box(3, 0.2, 2.2),
      frame: box(0.08, 2.4, 0.08),
      beam: box(3, 0.08, 0.08),
    }),
    [],
  );
  const leds = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    leds.current?.children.forEach((led, i) => {
      const m = (led as THREE.Mesh).material as THREE.MeshBasicMaterial;
      m.opacity = Math.sin(t * 5 + i * 1.7) > 0.2 ? 1 : 0.15;
    });
  });
  return (
    <group position={[STATIONS[2][0], 0, STATIONS[2][1]]}>
      {/* Training rack */}
      <Solid geometry={g.rack} position={[-2.6, 1.3, -0.6]} />
      {Array.from({ length: 7 }, (_, i) => (
        <Solid key={i} geometry={g.slot} position={[-2.6, 0.4 + i * 0.32, -0.09]} edges={false} color={INK} />
      ))}
      <group ref={leds}>
        {Array.from({ length: 7 }, (_, i) => (
          <mesh key={i} geometry={g.led} position={[-2.25, 0.45 + i * 0.32, -0.08]}>
            <meshBasicMaterial color={ACCENT} transparent />
          </mesh>
        ))}
      </group>
      {/* Robot cell being set up: frame, base plate, two arms */}
      <Solid geometry={g.cell} position={[0.8, 0.1, 0]} />
      {[
        [-0.65, -1.05],
        [2.25, -1.05],
        [-0.65, 1.05],
        [2.25, 1.05],
      ].map(([x, z]) => (
        <Solid key={`${x}${z}`} geometry={g.frame} position={[x, 1.4, z]} />
      ))}
      <Solid geometry={g.beam} position={[0.8, 2.6, -1.05]} />
      <Solid geometry={g.beam} position={[0.8, 2.6, 1.05]} />
      <Arm position={[0.3, 0.2, 0]} active={active} speed={0.6} />
      <Arm position={[1.3, 0.2, 0]} mirror={-1} active={active} speed={0.6} />
    </group>
  );
}


/* ---------------- A humanoid robot doing the job it learned ---------------- */

function Humanoid({ position, turn = 0, phase = 0, active }: { position: [number, number, number]; turn?: number; phase?: number; active: Ref }) {
  const g = useMemo(
    () => ({
      head: box(0.42, 0.4, 0.4),
      visor: box(0.34, 0.12, 0.02),
      neck: cyl(0.08, 0.14),
      torso: box(0.62, 0.78, 0.36),
      chest: box(0.3, 0.2, 0.02),
      hips: box(0.5, 0.24, 0.32),
      upper: new THREE.CapsuleGeometry(0.08, 0.42, 4, 10),
      lower: new THREE.CapsuleGeometry(0.07, 0.38, 4, 10),
      leg: new THREE.CapsuleGeometry(0.1, 0.7, 4, 10),
      joint: new THREE.SphereGeometry(0.1, 12, 10),
      hand: box(0.12, 0.14, 0.1),
    }),
    [],
  );
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * (0.6 + active.current * 0.8) + phase;
    // Reach down into the bin, lift, and turn to the belt.
    const reach = (Math.sin(t * 1.6) + 1) / 2;
    if (left.current) left.current.rotation.x = -0.4 - reach * 1.1;
    if (right.current) right.current.rotation.x = -0.4 - reach * 1.1;
    if (body.current) body.current.rotation.y = Math.sin(t * 0.8) * 0.5;
  });
  return (
    <group position={position} rotation={[0, turn, 0]}>
      <Solid geometry={g.leg} position={[-0.14, 0.5, 0]} />
      <Solid geometry={g.leg} position={[0.14, 0.5, 0]} />
      <Solid geometry={g.hips} position={[0, 1.02, 0]} color={LILAC} />
      <group ref={body} position={[0, 1.1, 0]}>
        <Solid geometry={g.torso} position={[0, 0.45, 0]} />
        <Solid geometry={g.chest} position={[0, 0.55, 0.19]} color={ACCENT} edges={false} />
        <Solid geometry={g.neck} position={[0, 0.9, 0]} />
        <Solid geometry={g.head} position={[0, 1.15, 0]} />
        <Solid geometry={g.visor} position={[0, 1.18, 0.21]} color={ACCENT} edges={false} />
        {[
          [-0.4, left],
          [0.4, right],
        ].map(([x, ref]) => (
          <group key={String(x)} ref={ref as React.RefObject<THREE.Group>} position={[x as number, 0.78, 0]}>
            <Solid geometry={g.joint} color={ACCENT} />
            <Solid geometry={g.upper} position={[0, -0.3, 0.05]} />
            <Solid geometry={g.lower} position={[0, -0.62, 0.22]} rotation={[-0.6, 0, 0]} />
            <Solid geometry={g.hand} position={[0, -0.82, 0.38]} color={INK} />
          </group>
        ))}
      </group>
    </group>
  );
}

/* ---------------- Station 4: into production ---------------- */

function StationProduction({ active }: { active: Ref }) {
  const g = useMemo(
    () => ({
      belt: box(5.2, 0.14, 1.1),
      body: box(5.2, 0.8, 1.0),
      roller: cyl(0.36, 1.12, 24),
      part: box(0.42, 0.3, 0.42),
      gate: box(0.15, 1.8, 0.15),
      gateTop: box(0.15, 0.15, 1.5),
      light: box(0.6, 0.12, 0.12),
    }),
    [],
  );
  const items = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * (0.4 + active.current * 0.6);
    items.current?.children.forEach((item, i) => {
      item.position.x = ((t * 0.9 + i * 1.05) % 5) - 2.5;
    });
  });
  return (
    <group position={[STATIONS[3][0], 0, STATIONS[3][1]]}>
      <Solid geometry={g.body} position={[0.6, 0.45, 0.6]} />
      <Solid geometry={g.belt} position={[0.6, 0.92, 0.6]} color="#efecf5" />
      <Solid geometry={g.roller} position={[-2, 0.62, 0.6]} rotation={[Math.PI / 2, 0, 0]} color={ACCENT} />
      <Solid geometry={g.roller} position={[3.2, 0.62, 0.6]} rotation={[Math.PI / 2, 0, 0]} color={ACCENT} />
      <group ref={items} position={[0.6, 1.14, 0.6]}>
        {Array.from({ length: 5 }, (_, i) => (
          <Solid key={i} geometry={g.part} color={i % 2 ? ACCENT : LILAC} />
        ))}
      </group>
      {/* Quality gate the finished parts pass through */}
      <Solid geometry={g.gate} position={[2.3, 1.1, -0.15]} />
      <Solid geometry={g.gate} position={[2.3, 1.1, 1.35]} />
      <Solid geometry={g.gateTop} position={[2.3, 2.0, 0.6]} />
      <Solid geometry={g.light} position={[2.3, 2.12, 0.6]} rotation={[0, Math.PI / 2, 0]} color={ACCENT} />
      <Bin position={[-1.2, 0, -1.4]} fill={LILAC} />
      <Arm position={[-0.6, 0, -0.5]} active={active} speed={1} />
      {/* Humanoid robots working the line, the job they learned from real work */}
      <Bin position={[0.2, 0, 2.6]} fill={ACCENT} />
      <Humanoid position={[0.4, 0, 1.75]} turn={Math.PI} active={active} />
      <Bin position={[2.4, 0, 2.6]} fill={LILAC} />
      <Humanoid position={[2.6, 0, 1.75]} turn={Math.PI} phase={1.4} active={active} />
    </group>
  );
}


/* ---------------- The capture kit, on a display plinth ---------------- */

export const KIT: [number, number] = [-8, 0.5];

function Kit() {
  const g = useMemo(
    () => ({
      plinth: box(4.6, 0.5, 2.4),
      head: new THREE.SphereGeometry(0.42, 24, 16),
      neck: cyl(0.16, 0.5),
      strap: new THREE.TorusGeometry(0.44, 0.05, 8, 32),
      phone: box(0.7, 0.36, 0.06),
      screen: box(0.6, 0.3, 0.01),
      band: new THREE.TorusGeometry(0.45, 0.09, 10, 40),
      unit: box(0.2, 0.14, 0.12),
      lens: cyl(0.05, 0.06, 16),
      forearm: new THREE.CapsuleGeometry(0.16, 0.9, 6, 16),
      hand: box(0.36, 0.12, 0.42),
      wrist: new THREE.TorusGeometry(0.19, 0.06, 10, 28),
      wristCam: box(0.16, 0.1, 0.14),
    }),
    [],
  );
  const spin = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (spin.current) spin.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.2;
  });
  return (
    <group position={[KIT[0], 0, KIT[1]]}>
      <Solid geometry={g.plinth} position={[0, 0.25, 0]} />
      <group ref={spin} position={[0, 0.5, 0]}>
        {/* The contributor's own phone, sideways in a head strap */}
        <group position={[-1.5, 0, 0]}>
          <Solid geometry={g.neck} position={[0, 0.25, 0]} />
          <Solid geometry={g.head} position={[0, 0.85, 0]} />
          <Solid geometry={g.strap} position={[0, 0.98, 0]} rotation={[Math.PI / 2, 0, 0]} color={INK} edges={false} />
          <Solid geometry={g.phone} position={[0, 1.12, 0.47]} color={INK} />
          <Solid geometry={g.screen} position={[0, 1.12, 0.51]} color={LILAC} edges={false} />
        </group>
        {/* Roboband: a light headband with clip-on camera units */}
        <group position={[0, 0, 0]}>
          <Solid geometry={g.neck} position={[0, 0.25, 0]} />
          <Solid geometry={g.head} position={[0, 0.85, 0]} />
          <Solid geometry={g.band} position={[0, 1.02, 0]} rotation={[Math.PI / 2, 0, 0]} />
          {[-0.5, -0.17, 0.17, 0.5].map((a) => (
            <group key={a} position={[Math.sin(a) * 0.5, 1.02, Math.cos(a) * 0.5]} rotation={[0, a, 0]}>
              <Solid geometry={g.unit} />
              <Solid geometry={g.lens} position={[0, 0, 0.07]} rotation={[Math.PI / 2, 0, 0]} color={INK} />
            </group>
          ))}
        </group>
        {/* The wristband: a 154° camera on the hand */}
        <group position={[1.5, 0.35, 0]} rotation={[0, 0, Math.PI / 2.3]}>
          <Solid geometry={g.forearm} />
          <Solid geometry={g.hand} position={[0, 0.72, 0]} />
          <Solid geometry={g.wrist} position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]} color="#bfeee0" />
          <Solid geometry={g.wristCam} position={[0, 0.42, 0.2]} color={ACCENT} />
        </group>
      </group>
    </group>
  );
}

/* ---------------- Real environments, each with someone recording ---------------- */

export const ROOMS: [number, number][] = [
  [0, -10],
  [8, -10],
  [16, -10],
  [24, -10],
  [32, -10],
];

function Room({ at, tint, children }: { at: [number, number]; tint: string; children: ReactNode }) {
  const g = useMemo(() => ({ floor: box(6, 0.12, 5), wallBack: box(6, 2.4, 0.12), wallSide: box(0.12, 2.4, 5) }), []);
  return (
    <group position={[at[0], 0, at[1]]}>
      <Solid geometry={g.floor} position={[0, 0.06, 0]} color={tint} />
      <Solid geometry={g.wallBack} position={[0, 1.2, -2.5]} />
      <Solid geometry={g.wallSide} position={[-3, 1.2, 0]} />
      {children}
    </group>
  );
}

function Warehouse({ active }: { active: Ref }) {
  const g = useMemo(() => ({ post: box(0.08, 2.2, 0.08), shelf: box(2.4, 0.08, 0.9), carton: box(0.42, 0.34, 0.42), pallet: box(1.2, 0.16, 1) }), []);
  return (
    <Room at={ROOMS[0]} tint="#efeaf9">
      {[-2.4, -0.2].map((x) => (
        <group key={x} position={[x + 1.2, 0, -1.7]}>
          {[-1.15, 1.15].flatMap((dx) => [-0.4, 0.4].map((dz) => (
            <Solid key={`${dx}${dz}`} geometry={g.post} position={[dx, 1.1, dz]} />
          )))}
          {[0.5, 1.2, 1.9].map((y, i) => (
            <group key={y}>
              <Solid geometry={g.shelf} position={[0, y, 0]} />
              {[-0.8, -0.3, 0.2, 0.7].slice(0, 4 - i).map((cx) => (
                <Solid key={cx} geometry={g.carton} position={[cx, y + 0.21, 0]} color={(cx + i) % 2 ? LILAC : PAPER} />
              ))}
            </group>
          ))}
        </group>
      ))}
      <Solid geometry={g.pallet} position={[1.6, 0.2, 1]} />
      <Solid geometry={g.carton} position={[1.4, 0.45, 0.9]} color={ACCENT} />
      <Solid geometry={g.carton} position={[1.85, 0.45, 1.15]} color={LILAC} />
      <Worker active={active} position={[0.4, 0.12, 0.6]} turn={-Math.PI / 2.5} />
    </Room>
  );
}

function Kitchen({ active }: { active: Ref }) {
  const g = useMemo(
    () => ({
      counter: box(4.6, 1, 1.1),
      top: box(4.7, 0.08, 1.2),
      hob: box(1.2, 0.04, 0.8),
      pot: cyl(0.3, 0.36, 20),
      pan: cyl(0.32, 0.08, 20),
      handle: box(0.5, 0.05, 0.06),
      hood: box(1.4, 0.5, 0.8),
      island: box(1.8, 1, 1),
    }),
    [],
  );
  const steam = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    steam.current?.children.forEach((c, i) => {
      c.position.y = 1.6 + ((clock.elapsedTime * 0.4 + i * 0.3) % 1) * 0.8;
      ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.5 - ((clock.elapsedTime * 0.4 + i * 0.3) % 1) * 0.5;
    });
  });
  return (
    <Room at={ROOMS[1]} tint="#f3eefb">
      <Solid geometry={g.counter} position={[0, 0.62, -1.8]} />
      <Solid geometry={g.top} position={[0, 1.16, -1.8]} />
      <Solid geometry={g.hob} position={[-0.8, 1.22, -1.8]} color={INK} />
      <Solid geometry={g.pot} position={[-1.1, 1.42, -1.8]} color={ACCENT} />
      <Solid geometry={g.pan} position={[-0.45, 1.28, -1.8]} />
      <Solid geometry={g.handle} position={[-0.05, 1.28, -1.8]} />
      <Solid geometry={g.hood} position={[-0.8, 2.25, -2]} />
      <group ref={steam} position={[-1.1, 0, -1.8]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[i * 0.1 - 0.1, 1.7, 0]}>
            <sphereGeometry args={[0.08, 8, 6]} />
            <meshBasicMaterial color={LILAC} transparent />
          </mesh>
        ))}
      </group>
      <Solid geometry={g.island} position={[1.2, 0.62, 0.9]} />
      <Solid geometry={g.pan} position={[1.0, 1.17, 0.9]} color={LILAC} />
      <Worker active={active} position={[0.4, 0.12, -0.6]} turn={Math.PI} />
    </Room>
  );
}

function Hotel({ active }: { active: Ref }) {
  const g = useMemo(
    () => ({
      base: box(2.4, 0.5, 2.8),
      mattress: box(2.3, 0.28, 2.7),
      blanket: box(2.36, 0.08, 1.6),
      pillow: box(0.9, 0.18, 0.5),
      head: box(2.6, 1.3, 0.12),
      stand: box(0.6, 0.6, 0.5),
      lamp: cyl(0.16, 0.36, 16),
      towels: box(0.6, 0.12, 0.4),
      cart: box(0.9, 0.9, 0.6),
    }),
    [],
  );
  return (
    <Room at={ROOMS[2]} tint="#efeaf9">
      <group position={[-0.6, 0, -0.9]}>
        <Solid geometry={g.head} position={[0, 0.9, -1.45]} color={LILAC} />
        <Solid geometry={g.base} position={[0, 0.37, 0]} />
        <Solid geometry={g.mattress} position={[0, 0.76, 0]} />
        <Solid geometry={g.blanket} position={[0, 0.94, 0.5]} color={ACCENT} />
        <Solid geometry={g.pillow} position={[-0.55, 1.0, -1.0]} />
        <Solid geometry={g.pillow} position={[0.55, 1.0, -1.0]} />
      </group>
      <Solid geometry={g.stand} position={[1.4, 0.42, -2]} />
      <Solid geometry={g.lamp} position={[1.4, 0.9, -2]} color={LILAC} />
      <Solid geometry={g.cart} position={[2.1, 0.57, 1.2]} />
      {[0, 1, 2].map((i) => (
        <Solid key={i} geometry={g.towels} position={[2.1, 1.08 + i * 0.13, 1.2]} color={i % 2 ? LILAC : PAPER} />
      ))}
      <Worker active={active} position={[1.3, 0.12, 0.2]} turn={-Math.PI / 1.6} />
    </Room>
  );
}

function Hospital({ active }: { active: Ref }) {
  const g = useMemo(
    () => ({
      frame: box(1.2, 0.5, 2.5),
      mattress: box(1.1, 0.2, 2.4),
      rail: box(0.05, 0.3, 1.4),
      pillow: box(0.8, 0.14, 0.4),
      pole: cyl(0.04, 2, 10),
      bag: box(0.3, 0.42, 0.1),
      trolley: box(1.1, 0.08, 0.7),
      leg: box(0.05, 0.8, 0.05),
      bin: box(0.4, 0.3, 0.3),
    }),
    [],
  );
  return (
    <Room at={ROOMS[3]} tint="#f3eefb">
      <group position={[-1.2, 0, -0.8]}>
        <Solid geometry={g.frame} position={[0, 0.5, 0]} />
        <Solid geometry={g.mattress} position={[0, 0.85, 0]} />
        <Solid geometry={g.pillow} position={[0, 1.02, -0.9]} />
        <Solid geometry={g.rail} position={[0.62, 1.05, 0.2]} color={ACCENT} />
        <Solid geometry={g.rail} position={[-0.62, 1.05, 0.2]} color={ACCENT} />
      </group>
      <Solid geometry={g.pole} position={[-0.2, 1.1, -2]} />
      <Solid geometry={g.bag} position={[-0.2, 1.9, -1.94]} color={LILAC} />
      {/* The porter's trolley, being pushed */}
      <group position={[1.5, 0, 0.9]}>
        <Solid geometry={g.trolley} position={[0, 0.9, 0]} />
        <Solid geometry={g.trolley} position={[0, 0.35, 0]} />
        {[-0.5, 0.5].flatMap((x) => [-0.3, 0.3].map((z) => <Solid key={`${x}${z}`} geometry={g.leg} position={[x, 0.55, z]} />))}
        <Solid geometry={g.bin} position={[-0.2, 1.1, 0]} color={ACCENT} />
        <Solid geometry={g.bin} position={[0.25, 1.1, 0]} color={LILAC} />
      </group>
      <Worker active={active} position={[0.4, 0.12, 1]} turn={Math.PI / 2} />
    </Room>
  );
}


function Home({ active }: { active: Ref }) {
  const g = useMemo(
    () => ({
      sofa: box(2.2, 0.5, 0.9),
      sofaBack: box(2.2, 0.6, 0.25),
      rug: box(2.6, 0.03, 1.8),
      table: box(1.6, 0.08, 0.9),
      leg: box(0.06, 0.7, 0.06),
      basket: cyl(0.3, 0.4, 18),
      shirt: box(0.5, 0.04, 0.4),
      plant: new THREE.SphereGeometry(0.32, 14, 10),
      pot: cyl(0.2, 0.36, 14),
    }),
    [],
  );
  return (
    <Room at={ROOMS[4]} tint="#efeaf9">
      <Solid geometry={g.rug} position={[0.2, 0.14, 0.3]} color={LILAC} />
      <Solid geometry={g.sofaBack} position={[-0.6, 0.8, -2.15]} />
      <Solid geometry={g.sofa} position={[-0.6, 0.37, -1.75]} />
      {/* Laundry being folded at the table: a task recorded at home */}
      <Solid geometry={g.table} position={[1.3, 0.85, 0.4]} />
      {[
        [0.6, 0.0],
        [2.0, 0.0],
        [0.6, 0.8],
        [2.0, 0.8],
      ].map(([x, z]) => (
        <Solid key={`${x}${z}`} geometry={g.leg} position={[x, 0.47, z]} />
      ))}
      <Solid geometry={g.shirt} position={[1.1, 0.92, 0.35]} color={ACCENT} />
      <Solid geometry={g.shirt} position={[1.6, 0.92, 0.45]} color={PAPER} />
      <Solid geometry={g.basket} position={[2.2, 0.32, 1.4]} />
      <Solid geometry={g.pot} position={[-2.4, 0.3, -2]} />
      <Solid geometry={g.plant} position={[-2.4, 0.8, -2]} color="#cfe9dd" />
      <Worker active={active} position={[1.3, 0.12, 1.3]} turn={Math.PI} />
    </Room>
  );
}

/* ---------------- Floor, camera and canvas ---------------- */

/* ---------------- The street: an autonomous car reading its surroundings ---------------- */
export const STREET: [number, number] = [0, 13];

/** A 3D bounding box drawn as a glowing violet wireframe, like a perception label. */
function Label3D({ size, position }: { size: [number, number, number]; position: [number, number, number] }) {
  const lines = useMemo(() => new THREE.EdgesGeometry(box(...size)), [size]);
  const ref = useRef<THREE.LineSegments>(null);
  useEffect(() => () => lines.dispose(), [lines]);
  useFrame(({ clock }) => {
    const m = ref.current?.material as THREE.LineBasicMaterial | undefined;
    if (m) m.opacity = 0.65 + Math.sin(clock.elapsedTime * 3) * 0.3;
  });
  return (
    <lineSegments ref={ref} geometry={lines} position={position}>
      <lineBasicMaterial color={ACCENT} transparent opacity={0.9} />
    </lineSegments>
  );
}

function Car({ color = PAPER, lidar = false }: { color?: string; lidar?: boolean }) {
  const g = useMemo(
    () => ({ body: box(2.1, 0.45, 1.05), cabin: box(1.15, 0.42, 0.92), wheel: cyl(0.2, 0.16, 16), puck: cyl(0.14, 0.14, 16) }),
    [],
  );
  return (
    <group>
      <Solid geometry={g.body} position={[0, 0.42, 0]} color={color} />
      <Solid geometry={g.cabin} position={[-0.1, 0.86, 0]} color={color === PAPER ? LILAC : PAPER} />
      {[-0.65, 0.65].flatMap((x) => [-0.53, 0.53].map((z) => (
        <Solid key={`${x}${z}`} geometry={g.wheel} position={[x, 0.2, z]} rotation={[Math.PI / 2, 0, 0]} color={INK} />
      )))}
      {lidar ? <Solid geometry={g.puck} position={[-0.1, 1.14, 0]} color={ACCENT} /> : null}
    </group>
  );
}

function Pedestrian() {
  const g = useMemo(() => ({ body: cyl(0.16, 0.7, 12), head: new THREE.SphereGeometry(0.14, 14, 12) }), []);
  return (
    <group>
      <Solid geometry={g.body} position={[0, 0.5, 0]} color={LILAC} />
      <Solid geometry={g.head} position={[0, 1.02, 0]} color={SKIN} edges={false} />
    </group>
  );
}

/** Rings of LiDAR pulses rolling out from the roof sensor. */
function LidarPulse() {
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const geometry = useMemo(() => new THREE.RingGeometry(0.96, 1, 64), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame(({ clock }) => {
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const t = (clock.elapsedTime * 0.45 + i / 3) % 1;
      ring.scale.setScalar(0.6 + t * 4.4);
      (ring.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - t);
    });
  });
  return (
    <group position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(node) => { rings.current[i] = node; }} geometry={geometry}>
          <meshBasicMaterial color={ACCENT} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function Street() {
  const g = useMemo(
    () => ({ road: box(18, 0.06, 5.2), walk: box(18, 0.14, 1.2), dash: box(0.9, 0.02, 0.12), pole: cyl(0.05, 2.2, 8), lamp: box(0.5, 0.08, 0.2) }),
    [],
  );
  const ego = useRef<THREE.Group>(null);
  const lead = useRef<THREE.Group>(null);
  const oncoming = useRef<THREE.Group>(null);
  const walker = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const loop = (speed: number, offset: number) => ((t * speed + offset) % 16) - 8;
    if (ego.current) ego.current.position.x = loop(1.1, 4);
    if (lead.current) lead.current.position.x = loop(1.1, 8.6);
    if (oncoming.current) oncoming.current.position.x = -loop(1.6, 2);
    if (walker.current) walker.current.position.z = -1.9 + ((t * 0.35) % 3.8);
  });
  return (
    <group position={[STREET[0], 0, STREET[1]]}>
      <Solid geometry={g.road} position={[0, 0.03, 0]} color="#e6e1f2" />
      <Solid geometry={g.walk} position={[0, 0.07, -3.2]} />
      <Solid geometry={g.walk} position={[0, 0.07, 3.2]} />
      {Array.from({ length: 9 }, (_, i) => (
        <Solid key={i} geometry={g.dash} position={[-8 + i * 2, 0.07, 0]} color={PAPER} edges={false} />
      ))}
      {/* Crossing stripes */}
      {Array.from({ length: 6 }, (_, i) => (
        <Solid key={`c${i}`} geometry={box(0.7, 0.02, 0.32)} position={[5, 0.07, -2.1 + i * 0.84]} color={PAPER} edges={false} />
      ))}
      {[-6, 0, 6].map((x) => (
        <group key={x} position={[x, 0, -3.4]}>
          <Solid geometry={g.pole} position={[0, 1.1, 0]} />
          <Solid geometry={g.lamp} position={[0, 2.22, 0.18]} color={LILAC} />
        </group>
      ))}
      <group ref={ego} position={[0, 0.06, 1.3]}>
        <Car color={PAPER} lidar />
        <LidarPulse />
      </group>
      <group ref={lead} position={[3, 0.06, 1.3]}>
        <Car color={LILAC} />
        <Label3D size={[2.4, 1.3, 1.35]} position={[0, 0.66, 0]} />
      </group>
      <group ref={oncoming} position={[-3, 0.06, -1.3]}>
        <Car color={PAPER} />
        <Label3D size={[2.4, 1.3, 1.35]} position={[0, 0.66, 0]} />
      </group>
      <group ref={walker} position={[5, 0.07, -1.9]}>
        <Pedestrian />
        <Label3D size={[0.6, 1.3, 0.6]} position={[0, 0.65, 0]} />
      </group>
    </group>
  );
}

/* ---------------- Floor ---------------- */
function Floor() {
  // A dot matrix instead of ruled lines: the same dotted language as the home page.
  const dots = useMemo(() => {
    const pts: number[] = [];
    for (let x = -50; x <= 70; x += 1) for (let z = -65; z <= 55; z += 1) pts.push(x, 0.01, z);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  useEffect(() => () => dots.dispose(), [dots]);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0, -5]}>
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial color={FLOOR} />
      </mesh>
      <points geometry={dots}>
        <pointsMaterial color="#7d52f4" size={3} sizeAttenuation={false} transparent opacity={0.45} />
      </points>
    </>
  );
}

/** A camera framing: where to look and how many world units fit across. */
export type Shot = { x: number; z: number; y?: number; width: number };

function Rig({ progress, shots, centred = false }: { progress: Ref; shots: Shot[]; centred?: boolean }) {
  const smooth = useRef(0);
  const look = useRef(new THREE.Vector3());
  useFrame((state, delta) => {
    const { camera, size } = state;
    smooth.current += (progress.current - smooth.current) * Math.min(1, delta * 2.6);
    const p = Math.min(shots.length - 1, Math.max(0, smooth.current));
    const i = Math.min(shots.length - 2, Math.floor(p));
    const t = Math.max(0, Math.min(1, p - i));
    const e = t * t * (3 - 2 * t);
    const a = shots[i];
    const b = shots[Math.min(shots.length - 1, i + 1)];
    const lerp = (u: number, v: number) => u + (v - u) * e;
    const phone = size.width < 734;
    // On wide screens the subject sits right of the copy (screen-right is +x, -z).
    // A centred panel (no copy beside it) frames the subject in the middle.
    const shift = phone || centred ? 0 : lerp(a.width, b.width) * 0.17;
    const target = look.current.set(
      lerp(a.x, b.x) - shift,
      // Lower the look-at point so subjects sit above the chapter card.
      lerp(a.y ?? 0.8, b.y ?? 0.8) - (centred ? 0 : phone ? 1.6 : 0.9),
      lerp(a.z, b.z) + shift,
    );
    camera.position.set(target.x + 10, target.y + 9, target.z + 10);
    camera.lookAt(target);
    const ortho = camera as THREE.OrthographicCamera;
    const across = lerp(a.width, b.width) * (phone && !centred ? 0.62 : 1);
    ortho.zoom = size.width / across;
    ortho.updateProjectionMatrix();
  });
  return null;
}

export default function FactoryScene({
  progress,
  activity,
  className,
  shots,
  centred = false,
}: {
  centred?: boolean;
  progress: Ref;
  /** 0..1 per station: how busy each one is (the current station is fully animated). */
  activity: Ref[];
  className?: string;
  /** Camera framings; `progress` runs from 0 to shots.length - 1. */
  shots: Shot[];
}) {
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const seen = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    seen.observe(node);
    return () => seen.disconnect();
  }, []);

  const from = useMemo(() => new THREE.Vector3(STATIONS[0][0] + 1.5, 1.8, STATIONS[0][1]), []);
  const to = useMemo(() => new THREE.Vector3(STATIONS[1][0] - 1, 2.1, STATIONS[1][1]), []);
  const from2 = useMemo(() => new THREE.Vector3(STATIONS[1][0] + 1.2, 2.1, STATIONS[1][1]), []);
  const to2 = useMemo(() => new THREE.Vector3(STATIONS[2][0] - 2.6, 2.2, STATIONS[2][1] - 0.6), []);

  return (
    <div ref={box} className={className} aria-hidden="true">
      <Canvas
        orthographic
        dpr={[1, typeof window !== "undefined" && window.innerWidth <= 734 ? 1.25 : 1.5]}
        camera={{ position: [10, 9, 10], zoom: 80, near: -100, far: 200 }}
        gl={{ antialias: true, alpha: false }}
        frameloop={visible && !reduced ? "always" : "demand"}
      >
        <color attach="background" args={[FLOOR]} />
        <ambientLight intensity={2.2} />
        <directionalLight position={[6, 12, 4]} intensity={1.1} />
        <Floor />
        <StationCapture active={activity[0]} />
        <DataStream from={from} to={to} active={activity[1]} />
        <StationLabel active={activity[1]} />
        <DataStream from={from2} to={to2} active={activity[2]} />
        <StationTrain active={activity[2]} />
        <StationProduction active={activity[3]} />
        <Kit />
        <Warehouse active={activity[0]} />
        <Kitchen active={activity[0]} />
        <Hotel active={activity[0]} />
        <Hospital active={activity[0]} />
        <Home active={activity[0]} />
        <Street />
        <Rig progress={progress} shots={shots} centred={centred} />
      </Canvas>
    </div>
  );
}
