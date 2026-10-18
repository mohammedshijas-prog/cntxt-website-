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
  const outline = useMemo(() => new THREE.EdgesGeometry(geometry, 30), [geometry]);
  useEffect(() => () => outline.dispose(), [outline]);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={geometry}>
        <meshLambertMaterial color={color} />
      </mesh>
      {edges ? <lineSegments geometry={outline} material={edgeMaterial} /> : null}
      {children}
    </group>
  );
}

const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
const cyl = (r: number, h: number, seg = 20) => new THREE.CylinderGeometry(r, r, h, seg);

/* ---------------- Station 1: real work on the floor ---------------- */

function Worker({ active }: { active: Ref }) {
  const body = useRef<THREE.Group>(null);
  const arm = useRef<THREE.Group>(null);
  const rec = useRef<THREE.Mesh>(null);
  const g = useMemo(
    () => ({
      torso: new THREE.CapsuleGeometry(0.32, 0.8, 6, 16),
      head: new THREE.SphereGeometry(0.26, 20, 14),
      leg: new THREE.CapsuleGeometry(0.12, 0.8, 4, 10),
      arm: new THREE.CapsuleGeometry(0.09, 0.6, 4, 10),
      cam: box(0.18, 0.12, 0.16),
      strap: new THREE.TorusGeometry(0.27, 0.03, 6, 24),
      dot: new THREE.SphereGeometry(0.035, 10, 8),
    }),
    [],
  );
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (body.current) body.current.position.y = Math.sin(t * 2) * 0.02;
    if (arm.current) arm.current.rotation.x = -0.9 + Math.sin(t * 2.2) * 0.35 * (0.4 + active.current);
    if (rec.current) (rec.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(t * 6) > 0 ? 1 : 0.2;
  });
  return (
    <group position={[-1.2, 0, 0.6]} rotation={[0, Math.PI / 5, 0]}>
      <group ref={body}>
        <Solid geometry={g.leg} position={[-0.14, 0.52, 0]} />
        <Solid geometry={g.leg} position={[0.14, 0.52, 0]} />
        <Solid geometry={g.torso} position={[0, 1.55, 0]} color={LILAC} />
        <Solid geometry={g.head} position={[0, 2.35, 0]} />
        <Solid geometry={g.strap} position={[0, 2.4, 0]} rotation={[Math.PI / 2, 0, 0]} color={INK} edges={false} />
        <Solid geometry={g.cam} position={[0, 2.5, 0.24]} color={ACCENT} />
        <mesh geometry={g.dot} position={[0.06, 2.55, 0.33]} ref={rec}>
          <meshBasicMaterial color="#ff4d4d" transparent />
        </mesh>
        <Solid geometry={g.arm} position={[-0.42, 1.6, 0]} rotation={[0.2, 0, 0.15]} />
        <group ref={arm} position={[0.42, 1.95, 0]}>
          <Solid geometry={g.arm} position={[0, -0.4, 0]} />
        </group>
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
  const count = 36;
  const ref = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => box(0.14, 0.14, 0.14), []);
  const seeds = useMemo(() => Array.from({ length: count }, (_, i) => i / count), []);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = clock.elapsedTime * 0.12;
    seeds.forEach((s, i) => {
      const k = (s + t) % 1;
      tmp.position.lerpVectors(from, to, k);
      tmp.position.y += Math.sin(k * Math.PI) * 1.4 + Math.sin(i * 7.1) * 0.25;
      tmp.position.z += Math.sin(i * 3.3) * 0.5;
      const size = (0.35 + 0.65 * Math.sin(k * Math.PI)) * (0.3 + active.current);
      tmp.scale.setScalar(size);
      tmp.rotation.set(k * 4, k * 3, 0);
      tmp.updateMatrix();
      mesh.setMatrixAt(i, tmp.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[geo, undefined, count]}>
      <meshLambertMaterial color={ACCENT} />
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
    </group>
  );
}

/* ---------------- Floor, camera and canvas ---------------- */

function Floor() {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(80, 80, "#d9d4e4", "#e4e0ec");
    g.position.set(13, 0.001, 0);
    return g;
  }, []);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[13, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial color={FLOOR} />
      </mesh>
      <primitive object={grid} />
    </>
  );
}

function Rig({ progress, zoom }: { progress: Ref; zoom: number }) {
  const smooth = useRef(0);
  const look = useRef(new THREE.Vector3());
  useFrame((state, delta) => {
    const { camera, size } = state;
    smooth.current += (progress.current - smooth.current) * Math.min(1, delta * 3);
    const p = Math.min(STATIONS.length - 1, Math.max(0, smooth.current));
    const i = Math.min(STATIONS.length - 2, Math.floor(p));
    const t = p - i;
    const e = t * t * (3 - 2 * t);
    const x = STATIONS[i][0] + (STATIONS[i + 1][0] - STATIONS[i][0]) * e;
    const z = STATIONS[i][1] + (STATIONS[i + 1][1] - STATIONS[i][1]) * e;
    const phone = size.width < 734;
    // Shift the view so the station sits right of the copy on wide screens
    // (screen-right in this view is +x, -z).
    const shift = phone ? 0 : 1.9;
    const target = look.current.set(x + 0.4 - shift, phone ? -0.6 : 0.9, z + shift);
    camera.position.set(target.x + 10, target.y + 9, target.z + 10);
    camera.lookAt(target);
    const ortho = camera as THREE.OrthographicCamera;
    // About 13 units across on desktop; phones frame one station tightly.
    ortho.zoom = (phone ? size.width / 5.2 : Math.min(size.width, size.height * 1.6) / 11.5) * zoom;
    ortho.updateProjectionMatrix();
  });
  return null;
}

export default function FactoryScene({
  progress,
  activity,
  className,
  zoom = 1,
}: {
  progress: Ref;
  /** 0..1 per station: how busy each one is (the current station is fully animated). */
  activity: Ref[];
  className?: string;
  zoom?: number;
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
        dpr={[1, 1.75]}
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
        <Rig progress={progress} zoom={zoom} />
      </Canvas>
    </div>
  );
}
