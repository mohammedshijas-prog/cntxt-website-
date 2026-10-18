"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Ref = { current: number };
/** Where the form sits and how big it is; eased toward every frame. */
export type Place = { current: { x: number; y: number; scale: number } };

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uLevel;
  uniform float uSize;
  uniform float uPixel;
  uniform float uFall;
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aSeed;
  varying float vFront;

  void main() {
    vec3 from = aFrom;
    // The first shape can be rain: each speck falls and wraps to the top.
    from.y = mix(from.y, 2.0 - mod(2.0 - from.y + uTime * (0.35 + fract(aSeed * 7.0) * 0.35), 4.0), uFall);
    vec3 p = mix(from, aTo, uMorph);
    // Ripples run across the surface; the voice level drives their height.
    float ripple = 1.0
      + uLevel * 0.16 * sin(p.y * 7.0 + uTime * 4.2 + aSeed * 2.0)
      + uLevel * 0.08 * sin(p.x * 5.0 - uTime * 2.6)
      + 0.025 * sin(aSeed * 6.2831 + uTime * 1.4);
    p *= ripple;
    // A slow drift so nothing is ever perfectly still.
    p += 0.015 * vec3(sin(uTime * 0.7 + aSeed * 9.0), cos(uTime * 0.6 + aSeed * 7.0), 0.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vFront = smoothstep(5.6, 3.0, -mv.z);
    gl_PointSize = uSize * uPixel * (0.55 + vFront * 0.9) / -mv.z;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uBack;
  uniform vec3 uFront;
  varying float vFront;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float soft = smoothstep(0.5, 0.0, d);
    vec3 colour = mix(uBack, uFront, vFront);
    gl_FragColor = vec4(colour, soft * (0.2 + vFront * 0.8));
  }
`;

function Points({
  shapes,
  progress,
  level,
  spin,
  sway,
  yaw,
  scale,
  pointSize,
  fall,
  place,
}: {
  shapes: Float32Array[];
  progress?: Ref;
  level?: Ref;
  spin: number;
  sway?: number;
  yaw: number;
  scale: number;
  pointSize: number;
  fall: boolean;
  place?: Place;
}) {
  const group = useRef<THREE.Group>(null);
  const cloud = useRef<THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const segment = useRef(-1);
  const smooth = useRef({ morph: 0, level: 0.2, progress: 0 });
  const { gl, size } = useThree();
  const count = shapes[0].length / 3;

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(shapes[0].slice(), 3));
    g.setAttribute("aFrom", new THREE.BufferAttribute(shapes[0].slice(), 3));
    g.setAttribute("aTo", new THREE.BufferAttribute(shapes[0].slice(), 3));
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) seeds[i] = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);
    return g;
  }, [shapes, count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uLevel: { value: 0.2 },
          uFall: { value: 0 },
          uSize: { value: 26 },
          uPixel: { value: 1 },
          uBack: { value: new THREE.Color("#4b2bb8") },
          uFront: { value: new THREE.Color("#efe9ff") },
        },
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((_, delta) => {
    const points = cloud.current;
    if (!points) return;
    const s = smooth.current;
    const u = points.material.uniforms;
    const shape = points.geometry;
    u.uTime.value += delta;
    u.uPixel.value = gl.getPixelRatio();
    // Smaller canvases get finer points so the form keeps its texture.
    u.uSize.value = pointSize * Math.min(1, Math.max(0.5, size.height / 640));

    // Ease toward the target progress so scroll jumps still morph smoothly.
    const target = Math.min(shapes.length - 1, Math.max(0, progress?.current ?? 0));
    s.progress += (target - s.progress) * Math.min(1, delta * 4);
    const index = Math.min(shapes.length - 2, Math.floor(s.progress));
    if (shapes.length > 1 && index !== segment.current) {
      segment.current = index;
      const from = shape.getAttribute("aFrom") as THREE.BufferAttribute;
      const to = shape.getAttribute("aTo") as THREE.BufferAttribute;
      from.set(shapes[index]);
      to.set(shapes[index + 1]);
      from.needsUpdate = true;
      to.needsUpdate = true;
    }
    const t = shapes.length > 1 ? Math.min(1, Math.max(0, s.progress - index)) : 0;
    u.uFall.value = fall && index === 0 ? 1 : 0;
    u.uMorph.value = t * t * (3 - 2 * t);

    s.level += ((level?.current ?? 0.2) - s.level) * Math.min(1, delta * 4);
    u.uLevel.value = s.level;

    if (group.current) {
      if (place) {
        const g = group.current;
        const k = Math.min(1, delta * 4);
        g.position.x += (place.current.x - g.position.x) * k;
        g.position.y += (place.current.y - g.position.y) * k;
        const next = g.scale.x + (place.current.scale * scale - g.scale.x) * k;
        g.scale.setScalar(next);
      }
      if (sway) {
        // Rock back and forth so flat shapes never turn edge-on.
        group.current.rotation.y = yaw + Math.sin(u.uTime.value * 0.3) * sway;
        group.current.rotation.x = 0.22;
      } else {
        group.current.rotation.y += delta * spin * (1 + s.level);
        group.current.rotation.x = 0.38;
      }
    }
  });

  return (
    <group ref={group} scale={scale}>
      <points ref={cloud} geometry={geometry} material={material} />
    </group>
  );
}

/**
 * A WebGL particle field. Pass one shape for a breathing form, or several to
 * morph between them as `progress` runs from 0 to shapes.length - 1.
 * Rendering pauses when the field is off screen or motion is reduced.
 */
export default function ParticleField({
  shapes,
  progress,
  level,
  spin = 0.12,
  sway,
  yaw = 0,
  scale = 1,
  pointSize = 26,
  fall = false,
  place,
  paused = false,
  className,
}: {
  shapes: Float32Array[];
  progress?: Ref;
  level?: Ref;
  spin?: number;
  /** Rock by this many radians instead of spinning. */
  sway?: number;
  /** Resting angle the sway rocks around. */
  yaw?: number;
  /** Base point size; smaller keeps line detail crisp. */
  pointSize?: number;
  /** Make the first shape fall like rain. */
  fall?: boolean;
  place?: Place;
  /** Stop rendering, e.g. while the field is faded out. */
  paused?: boolean;
  scale?: number;
  className?: string;
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

  return (
    <div ref={box} className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        frameloop={visible && !reduced && !paused ? "always" : "demand"}
      >
        <Points shapes={shapes} progress={progress} level={level} spin={spin} sway={sway} yaw={yaw} scale={scale} pointSize={pointSize} fall={fall} place={place} />
      </Canvas>
    </div>
  );
}
