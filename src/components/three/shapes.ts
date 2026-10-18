/**
 * Point clouds for the particle field. Every shape has the same number of
 * points so the field can morph from one to the next.
 */

// Deterministic random so server and client agree and shapes are stable.
function random(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Evenly spread points on a sphere (golden-angle spiral). */
export function sphere(count: number, radius = 1) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = i * 2.399963;
    out[i * 3] = Math.cos(theta) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return out;
}

/** Raw, uneven data: loose clusters scattered through a wide volume. */
export function scatter(count: number, seed = 7) {
  const rand = random(seed);
  const centres = Array.from({ length: 9 }, () => [rand() * 4 - 2, rand() * 2.4 - 1.2, rand() * 2 - 1]);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const c = centres[i % centres.length];
    const spread = 0.18 + rand() * 0.45;
    out[i * 3] = c[0] + (rand() - 0.5) * spread * 2;
    out[i * 3 + 1] = c[1] + (rand() - 0.5) * spread * 2;
    out[i * 3 + 2] = c[2] + (rand() - 0.5) * spread * 2;
  }
  return out;
}

/** Verified data: an orderly lattice, tilted like a table of labelled rows. */
export function grid(count: number) {
  const out = new Float32Array(count * 3);
  const cols = Math.ceil(Math.sqrt(count * 1.6));
  const rows = Math.ceil(count / cols);
  for (let i = 0; i < count; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = (c / (cols - 1) - 0.5) * 3.2;
    const y = (r / (rows - 1) - 0.5) * 2.0;
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    // A gentle curve, like a sheet of labelled frames.
    out[i * 3 + 2] = -0.18 * x * x + 0.2;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Meaningful forms for the home story. Each is sampled from simple    */
/* primitives, weighted by size, then padded to exactly `count`.       */
/* ------------------------------------------------------------------ */

type V = [number, number, number];
type Part = { weight: number; sample: (rand: () => number) => V };

function build(count: number, parts: Part[], seed: number) {
  const rand = random(seed);
  const total = parts.reduce((sum, part) => sum + part.weight, 0);
  const out = new Float32Array(count * 3);
  let i = 0;
  for (const part of parts) {
    const n = Math.round((part.weight / total) * count);
    for (let k = 0; k < n && i < count; k++, i++) out.set(part.sample(rand), i * 3);
  }
  // Rounding leaves a few slots; fill them from the first part.
  while (i < count) out.set(parts[0].sample(rand), i++ * 3);
  return out;
}

const sphereAt = (c: V, r: number): Part["sample"] => (rand) => {
  const u = rand() * 2 - 1;
  const t = rand() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return [c[0] + r * s * Math.cos(t), c[1] + r * u, c[2] + r * s * Math.sin(t)];
};

/** Surface of a capsule from a to b. */
const capsule = (a: V, b: V, r: number): Part["sample"] => (rand) => {
  const t = rand();
  const p: V = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const d: V = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const len = Math.hypot(...d) || 1;
  const n: V = [d[0] / len, d[1] / len, d[2] / len];
  // Two vectors perpendicular to the axis.
  const helper: V = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const u: V = [n[1] * helper[2] - n[2] * helper[1], n[2] * helper[0] - n[0] * helper[2], n[0] * helper[1] - n[1] * helper[0]];
  const ul = Math.hypot(...u);
  u[0] /= ul; u[1] /= ul; u[2] /= ul;
  const w: V = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
  const angle = rand() * Math.PI * 2;
  const c = Math.cos(angle) * r;
  const s = Math.sin(angle) * r;
  return [p[0] + u[0] * c + w[0] * s, p[1] + u[1] * c + w[1] * s, p[2] + u[2] * c + w[2] * s];
};

/** Surface of an axis-aligned box. */
const box = (c: V, size: V): Part["sample"] => (rand) => {
  const face = Math.floor(rand() * 6);
  const axis = face >> 1;
  const p: V = [(rand() - 0.5) * size[0], (rand() - 0.5) * size[1], (rand() - 0.5) * size[2]];
  p[axis] = (face & 1 ? 0.5 : -0.5) * size[axis];
  return [c[0] + p[0], c[1] + p[1], c[2] + p[2]];
};

/** Points along a straight line, lightly jittered. */
const line = (a: V, b: V, jitter = 0.012): Part["sample"] => (rand) => {
  const t = rand();
  return [
    a[0] + (b[0] - a[0]) * t + (rand() - 0.5) * jitter,
    a[1] + (b[1] - a[1]) * t + (rand() - 0.5) * jitter,
    a[2] + (b[2] - a[2]) * t + (rand() - 0.5) * jitter,
  ];
};

/** Outline of a rectangle in the x/y plane at depth z. */
const rect = (cx: number, cy: number, w: number, h: number, z: number): Part["sample"] => (rand) => {
  const edge = rand() * 2 * (w + h);
  let x: number;
  let y: number;
  if (edge < w) [x, y] = [edge - w / 2, h / 2];
  else if (edge < w + h) [x, y] = [w / 2, h / 2 - (edge - w)];
  else if (edge < 2 * w + h) [x, y] = [w / 2 - (edge - w - h), -h / 2];
  else [x, y] = [-w / 2, -h / 2 + (edge - 2 * w - h)];
  return [cx + x, cy + y, z];
};

/** Real work: a person carrying a box. */
export function worker(count: number) {
  const s = 0.95;
  const v = (x: number, y: number, z: number): V => [x * s, y * s, z * s];
  return build(
    count,
    [
      { weight: 7, sample: sphereAt(v(0, 1.18, 0), 0.2 * s) },
      { weight: 16, sample: capsule(v(0, 0.86, 0), v(0, 0.12, 0), 0.27 * s) },
      // Arms reach forward to hold the box.
      { weight: 5, sample: capsule(v(-0.32, 0.8, 0), v(-0.36, 0.42, 0.24), 0.08 * s) },
      { weight: 5, sample: capsule(v(0.32, 0.8, 0), v(0.36, 0.42, 0.24), 0.08 * s) },
      { weight: 4, sample: capsule(v(-0.36, 0.42, 0.24), v(-0.26, 0.38, 0.5), 0.07 * s) },
      { weight: 4, sample: capsule(v(0.36, 0.42, 0.24), v(0.26, 0.38, 0.5), 0.07 * s) },
      { weight: 18, sample: box(v(0, 0.5, 0.62), v(0.62, 0.46, 0.46)) },
      // Mid-stride legs.
      { weight: 9, sample: capsule(v(-0.13, 0.1, 0), v(-0.2, -1.2, 0.18), 0.11 * s) },
      { weight: 9, sample: capsule(v(0.13, 0.1, 0), v(0.18, -1.2, -0.2), 0.11 * s) },
    ],
    11,
  );
}

/** Verified data: a fanned stack of video frames, one object boxed and labelled. */
export function frames(count: number) {
  const parts: Part[] = [];
  [-0.5, 0, 0.5].forEach((z, i) => {
    const x = -0.32 + i * 0.32;
    const y = 0.22 - i * 0.22;
    parts.push({ weight: 12, sample: rect(x, y, 1.9, 1.15, z) });
    // A sparse fill so each frame reads as an image, not just a border.
    parts.push({
      weight: i === 2 ? 4 : 2,
      sample: (rand) => [x + (rand() - 0.5) * 1.8, y + (rand() - 0.5) * 1.05, z],
    });
  });
  // On the front frame: a bounding box around an object, and its label tab.
  parts.push({ weight: 8, sample: rect(0.62, -0.32, 0.62, 0.5, 0.52) });
  parts.push({ weight: 3, sample: (rand) => [0.42 + rand() * 0.42, -0.02 + rand() * 0.12, 0.52] });
  parts.push({ weight: 4, sample: sphereAt([0.62, -0.34, 0.56], 0.14) });
  return build(count, parts, 23);
}

/** Models: a neural network, four layers of nodes and their connections. */
export function network(count: number) {
  const layers = [4, 6, 6, 3];
  const xs = [-1.35, -0.45, 0.45, 1.35];
  const nodes = layers.map((n, l) =>
    Array.from({ length: n }, (_, i) => [xs[l], (i - (n - 1) / 2) * 0.42, 0] as V),
  );
  const parts: Part[] = [];
  nodes.flat().forEach((node) => parts.push({ weight: 4, sample: sphereAt(node, 0.085) }));
  for (let l = 0; l < nodes.length - 1; l++) {
    for (const a of nodes[l]) for (const b of nodes[l + 1]) parts.push({ weight: 0.9, sample: line(a, b) });
  }
  return build(count, parts, 37);
}

/** Agents: a speech bubble holding a voice waveform and a completed check. */
export function bubble(count: number) {
  const w = 2.3;
  const h = 1.4;
  const r = 0.32;
  const parts: Part[] = [
    // Rounded outline: straight edges plus quarter circles at the corners.
    { weight: 6, sample: line([-w / 2 + r, h / 2, 0], [w / 2 - r, h / 2, 0]) },
    { weight: 6, sample: line([-w / 2 + r, -h / 2, 0], [w / 2 - r, -h / 2, 0]) },
    { weight: 3, sample: line([-w / 2, -h / 2 + r, 0], [-w / 2, h / 2 - r, 0]) },
    { weight: 3, sample: line([w / 2, -h / 2 + r, 0], [w / 2, h / 2 - r, 0]) },
    // The tail, bottom left.
    { weight: 2, sample: line([-0.55, -h / 2, 0], [-0.85, -h / 2 - 0.42, 0]) },
    { weight: 2, sample: line([-0.85, -h / 2 - 0.42, 0], [-0.25, -h / 2, 0]) },
  ];
  [
    [w / 2 - r, h / 2 - r, 0],
    [-w / 2 + r, h / 2 - r, Math.PI / 2],
    [-w / 2 + r, -h / 2 + r, Math.PI],
    [w / 2 - r, -h / 2 + r, (3 * Math.PI) / 2],
  ].forEach(([cx, cy, start]) =>
    parts.push({
      weight: 1.6,
      sample: (rand) => {
        const a = start + rand() * (Math.PI / 2);
        return [cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0];
      },
    }),
  );
  // The agent speaks (waveform, left) and the job is done (a check, right).
  const bars = 11;
  for (let i = 0; i < bars; i++) {
    const x = -0.92 + (i / (bars - 1)) * 1.05;
    const height = 0.12 + 0.72 * Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.37));
    parts.push({ weight: 1.4, sample: line([x, -height / 2, 0.02], [x, height / 2, 0.02], 0.03) });
  }
  const cx = 0.6;
  const cr = 0.36;
  parts.push({
    weight: 7,
    sample: (rand) => {
      const a = rand() * Math.PI * 2;
      return [cx + Math.cos(a) * cr, Math.sin(a) * cr, 0.03];
    },
  });
  parts.push({ weight: 3, sample: line([cx - 0.17, 0.0, 0.04], [cx - 0.04, -0.14, 0.04], 0.025) });
  parts.push({ weight: 5, sample: line([cx - 0.04, -0.14, 0.04], [cx + 0.2, 0.15, 0.04], 0.025) });
  return build(count, parts, 53);
}

/** Data rain: a wide, deep field of specks that falls over the hero. */
export function rain(count: number, seed = 71) {
  const rand = random(seed);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    out[i * 3] = (rand() - 0.5) * 6.6;
    out[i * 3 + 1] = (rand() - 0.5) * 4;
    out[i * 3 + 2] = -1.6 + rand() * 2;
  }
  return out;
}

/** Agents: an agent core orchestrating the tools and systems around it. */
export function agentHub(count: number) {
  const parts: Part[] = [];
  // The agent: a dense core inside an orbit ring.
  parts.push({ weight: 16, sample: sphereAt([0, 0, 0], 0.36) });
  parts.push({
    weight: 7,
    sample: (rand) => {
      const a = rand() * Math.PI * 2;
      return [Math.cos(a) * 0.62, Math.sin(a) * 0.62 * 0.35, Math.sin(a) * 0.62 * 0.94];
    },
  });
  // Six systems it works across (telephony, CRM, calendar, payments, knowledge,
  // messaging), each a small block on a tilted ring, wired back to the core.
  const n = 6;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.3;
    const p: V = [Math.cos(a) * 1.45, Math.sin(a) * 0.95, Math.sin(a + 1.2) * 0.45];
    parts.push({ weight: 5, sample: box(p, [0.26, 0.26, 0.26]) });
    parts.push({ weight: 2.6, sample: line([0, 0, 0], p, 0.02) });
  }
  // A faint outer ring tying the systems together.
  parts.push({
    weight: 4,
    sample: (rand) => {
      const a = rand() * Math.PI * 2;
      return [Math.cos(a) * 1.45, Math.sin(a) * 0.95, Math.sin(a + 1.2) * 0.45];
    },
  });
  return build(count, parts, 61);
}
