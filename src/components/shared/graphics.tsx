import type { ReactNode } from "react";
import styles from "./graphics.module.css";

/*
 * Illustrations drawn in code, so they stay sharp at any size and carry no
 * third-party artwork. Everything here is decorative unless a label is passed.
 */

const U = 40;
const COS = 0.866;

/** Isometric projection of a point on the floor grid (z is height). */
function iso(x: number, y: number, z = 0): [number, number] {
  return [(x - y) * COS * U, (x + y) * 0.5 * U - z * U];
}

function points(list: [number, number, number][]) {
  return list.map(([x, y, z]) => iso(x, y, z).map((n) => n.toFixed(1)).join(",")).join(" ");
}

type Tone = "floor" | "light" | "mid" | "dark" | "accent" | "carton";

type BoxSpec = { x: number; y: number; z?: number; w: number; d: number; h: number; tone?: Tone };

const tones: Record<Tone, [string, string, string]> = {
  // top, left (facing the viewer's left), right
  floor: ["#f1ecff", "#d9cdfb", "#c8b8f7"],
  light: ["#ffffff", "#ebe5fb", "#ddd3f8"],
  mid: ["#e4dafc", "#cbbaf7", "#b7a2f2"],
  dark: ["#3a3055", "#2a2240", "#1f1932"],
  accent: ["#9b7af7", "#7d52f4", "#6a40e0"],
  carton: ["#f3e3c8", "#e2caa2", "#d3b88b"],
};

function Box({ x, y, z = 0, w, d, h, tone = "light" }: BoxSpec) {
  const [top, left, right] = tones[tone];
  return (
    <g>
      <polygon points={points([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={left} />
      <polygon points={points([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]])} fill={right} />
      <polygon points={points([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={top} />
    </g>
  );
}

/** A shelving rack: uprights, three shelves and cartons on each level. */
function rack(x: number, y: number, cartons: number[][]): BoxSpec[] {
  const w = 4.4;
  const d = 1;
  const boxes: BoxSpec[] = [];
  for (const ux of [x, x + w - 0.12]) {
    boxes.push({ x: ux, y, w: 0.12, d: 0.12, h: 3.5, tone: "dark" });
    boxes.push({ x: ux, y: y + d - 0.12, w: 0.12, d: 0.12, h: 3.5, tone: "dark" });
  }
  [0.25, 1.35, 2.45].forEach((level, i) => {
    boxes.push({ x, y, z: level, w, d, h: 0.1, tone: "mid" });
    cartons[i].forEach((size, j) => {
      if (!size) return;
      boxes.push({ x: x + 0.3 + j * 1.02, y: y + 0.15, z: level + 0.1, w: 0.8, d: 0.7, h: size, tone: j % 3 === 1 ? "light" : "carton" });
    });
  });
  return boxes;
}

/** A person recording their shift: body, head and a head camera with its view. */
function Worker({ x, y, look }: { x: number; y: number; look: [number, number, number] }) {
  const [hx, hy] = iso(x + 0.25, y + 0.2, 1.72);
  const [lx, ly] = iso(...look);
  const [l2x, l2y] = iso(look[0] + 0.9, look[1] - 0.5, look[2] + 0.5);
  return (
    <g>
      <polygon points={`${hx},${hy} ${lx},${ly} ${l2x},${l2y}`} fill="#7d52f4" opacity="0.2" />
      <Box x={x + 0.06} y={y + 0.06} w={0.38} d={0.28} h={0.8} tone="dark" />
      <Box x={x} y={y} z={0.8} w={0.5} d={0.4} h={0.72} tone="accent" />
      <circle cx={hx} cy={hy} r="9" fill="#f0d3bd" />
      <path d={`M${hx - 9},${hy - 2} a9,9 0 0 1 18,0`} fill="#2a2240" />
      <rect x={hx + 3} y={hy - 4} width="9" height="6" rx="1.5" fill="#1f1932" />
      <circle cx={hx + 10.5} cy={hy - 1} r="1.6" fill="#b79cff" />
    </g>
  );
}

function Chip({ x, y, children, live }: { x: number; y: number; children: string; live?: boolean }) {
  const width = children.length * 6.7 + (live ? 34 : 22);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={width} height="28" rx="14" fill="#ffffff" stroke="rgba(15,12,11,0.1)" />
      {live ? <circle cx="15" cy="14" r="4" fill="#7d52f4" className={styles.pulse} /> : null}
      <text x={live ? 26 : 11} y="18.5" className={styles.chipText}>
        {children}
      </text>
    </g>
  );
}

/**
 * Isometric view of a warehouse floor where two people record their work
 * hands-free. Stands in for "an environment we capture".
 */
export function IsoFloor({ className }: { className?: string }) {
  const boxes: BoxSpec[] = [
    ...rack(0.8, 0.6, [[0.7, 0.55, 0.8, 0.5], [0.6, 0.8, 0, 0.7], [0.75, 0, 0.6, 0.8]]),
    ...rack(6.4, 0.6, [[0.6, 0.8, 0.55, 0.7], [0.8, 0.6, 0.7, 0], [0, 0.7, 0.8, 0.6]]),
    // Pallet with stacked cartons.
    { x: 1.4, y: 5.4, w: 1.9, d: 1.5, h: 0.16, tone: "mid" },
    { x: 1.5, y: 5.5, z: 0.16, w: 0.8, d: 0.6, h: 0.6, tone: "carton" },
    { x: 2.4, y: 5.5, z: 0.16, w: 0.8, d: 0.6, h: 0.6, tone: "carton" },
    { x: 1.5, y: 6.2, z: 0.16, w: 0.8, d: 0.6, h: 0.6, tone: "light" },
    { x: 1.9, y: 5.6, z: 0.76, w: 0.8, d: 0.6, h: 0.55, tone: "carton" },
    // Conveyor with cartons moving along it.
    { x: 6.2, y: 5.2, w: 5.2, d: 1.1, h: 0.7, tone: "mid" },
    { x: 6.2, y: 5.3, z: 0.7, w: 5.2, d: 0.9, h: 0.08, tone: "dark" },
    { x: 6.8, y: 5.4, z: 0.78, w: 0.7, d: 0.6, h: 0.5, tone: "carton" },
    { x: 8.6, y: 5.4, z: 0.78, w: 0.7, d: 0.6, h: 0.42, tone: "light" },
    { x: 10.2, y: 5.4, z: 0.78, w: 0.7, d: 0.6, h: 0.5, tone: "carton" },
    // Packing bench.
    { x: 8.4, y: 7.3, w: 2.4, d: 1, h: 0.85, tone: "light" },
    { x: 8.7, y: 7.5, z: 0.85, w: 0.7, d: 0.6, h: 0.45, tone: "carton" },
  ];
  const ordered = boxes
    .map((box, index) => ({ box, index, depth: box.x + box.w / 2 + box.y + box.d / 2 + (box.z ?? 0) * 0.01 }))
    .sort((a, b) => a.depth - b.depth || a.index - b.index);

  const grid: ReactNode[] = [];
  for (let i = 1; i < 12; i++) {
    const [x1, y1] = iso(i, 0);
    const [x2, y2] = iso(i, 9);
    grid.push(<line key={`x${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />);
  }
  for (let j = 1; j < 9; j++) {
    const [x1, y1] = iso(0, j);
    const [x2, y2] = iso(12, j);
    grid.push(<line key={`y${j}`} x1={x1} y1={y1} x2={x2} y2={y2} />);
  }

  return (
    <svg className={`${styles.iso} ${className ?? ""}`} viewBox="-330 -160 760 620" role="img" aria-label="Illustration of a warehouse floor where two workers record their shift with head cameras">
      <Box x={0} y={0} z={-0.35} w={12} d={9} h={0.35} tone="floor" />
      <g className={styles.grid}>{grid}</g>
      {/* Walking route between rack and bench. */}
      <polyline
        className={styles.route}
        points={[iso(3.4, 2.2), iso(3.4, 4.3), iso(7.6, 4.3), iso(7.6, 6.9)].map((p) => p.join(",")).join(" ")}
      />
      {ordered.slice(0, ordered.findIndex(({ box }) => box.y >= 5)).map(({ box, index }) => (
        <Box key={index} {...box} />
      ))}
      <Worker x={3.2} y={2.3} look={[2.4, 1.6, 1.9]} />
      {ordered.slice(ordered.findIndex(({ box }) => box.y >= 5)).map(({ box, index }) => (
        <Box key={index} {...box} />
      ))}
      <Worker x={7.4} y={6.6} look={[8.4, 5.9, 1.2]} />
      <Chip x={-250} y={-118} live>
        Head camera recording
      </Chip>
      <Chip x={196} y={318}>
        Hour accepted after review
      </Chip>
    </svg>
  );
}

/** Line drawings of the capture kit. */
export function KitArt({ kind }: { kind: "phone" | "head" | "wrist" }) {
  return (
    <svg className={styles.kit} viewBox="0 0 320 220" aria-hidden="true">
      <rect width="320" height="220" rx="16" fill="#f5f1ff" />
      <g className={styles.kitGrid}>
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`v${i}`} x1={40 * (i + 1)} y1="0" x2={40 * (i + 1)} y2="220" />
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={44 * (i + 1)} x2="320" y2={44 * (i + 1)} />
        ))}
      </g>
      {kind === "phone" ? (
        <g className={styles.kitLine}>
          {/* Head strap with a phone mounted on the front. */}
          <ellipse cx="160" cy="118" rx="92" ry="34" />
          <path d="M68 118c0-52 41-84 92-84s92 32 92 84" />
          <rect x="128" y="96" width="64" height="112" rx="10" className={styles.kitFill} />
          <circle cx="160" cy="118" r="9" />
          <circle cx="160" cy="118" r="3" className={styles.kitDot} />
          <line x1="150" y1="196" x2="170" y2="196" />
        </g>
      ) : kind === "head" ? (
        <g className={styles.kitLine}>
          {/* Head-mounted camera and its field of view. */}
          <path d="M82 138c0-48 34-84 78-84s78 36 78 84" />
          <path d="M74 138h172" />
          <rect x="136" y="118" width="48" height="34" rx="8" className={styles.kitFill} />
          <circle cx="160" cy="135" r="9" />
          <circle cx="160" cy="135" r="3" className={styles.kitDot} />
          <path d="M160 152l-58 52M160 152l58 52" className={styles.kitDash} />
        </g>
      ) : (
        <g className={styles.kitLine}>
          {/* Two wristbands, each with a small camera. */}
          {[92, 228].map((cx) => (
            <g key={cx}>
              <rect x={cx - 34} y="58" width="68" height="104" rx="30" />
              <rect x={cx - 24} y="86" width="48" height="48" rx="12" className={styles.kitFill} />
              <circle cx={cx} cy="110" r="9" />
              <circle cx={cx} cy="110" r="3" className={styles.kitDot} />
            </g>
          ))}
          <path d="M126 110h68" className={styles.kitDash} />
        </g>
      )}
    </svg>
  );
}

const steps = [
  "Reach to the second shelf",
  "Pick the carton from the shelf",
  "Carry it to the packing bench",
  "Place the carton on the bench",
  "Scan the label",
  "Return to the rack",
];

/** A labelling screen: a first-person frame with tracked regions and the action list beside it. */
export function AnnotationMock({ className }: { className?: string }) {
  return (
    <div className={`${styles.mock} ${className ?? ""}`} aria-hidden="true">
      <div className={styles.mockBar}>
        <i />
        <i />
        <i />
        <span>Clip review · first-person video</span>
      </div>
      <div className={styles.mockBody}>
        <div className={styles.frame}>
          <img loading="lazy" decoding="async" src="/art/frame-shelf.webp" alt="" />
          <span className={styles.region} style={{ left: "37%", top: "16%", width: "40%", height: "44%" }}>
            <b>Right hand</b>
          </span>
          <span className={styles.region} style={{ left: "64%", top: "12%", width: "30%", height: "74%" }}>
            <b>Carton</b>
          </span>
          <div className={styles.timeline}>
            {[18, 22, 14, 16, 12, 18].map((width, i) => (
              <i key={i} style={{ width: `${width}%` }} data-active={i === 1} />
            ))}
          </div>
        </div>
        <ol className={styles.steps}>
          {steps.map((step, i) => (
            <li key={step} data-active={i === 1}>
              <span>{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const pipeline = [
  { title: "Record", body: "People record the work they already do, hands-free." },
  { title: "Consent", body: "Each worker agrees in their own language first." },
  { title: "Review", body: "A person checks every hour before it is accepted." },
  { title: "Label", body: "Accepted clips get action labels and annotations." },
  { title: "Deliver", body: "You receive a verified, training-ready dataset." },
];

/** The capture pipeline as a row of connected stages. */
export function PipelineDiagram({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <ol className={`${styles.pipeline} ${compact ? styles.compact : ""} ${className ?? ""}`}>
      {pipeline.map((stage, i) => (
        <li key={stage.title}>
          <span className={styles.node}>{String(i + 1).padStart(2, "0")}</span>
          <strong>{stage.title}</strong>
          {compact ? null : <p>{stage.body}</p>}
        </li>
      ))}
    </ol>
  );
}

/** An audit summary: the three things an evaluation checks, with a review trail. */
export function AuditMock() {
  const rows = [
    { label: "Bias", width: "72%" },
    { label: "Reliability", width: "88%" },
    { label: "Compliance", width: "64%" },
  ];
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.cardInner}>
        <p className={styles.cardTitle}>
          Model audit <span>In review</span>
        </p>
        {rows.map((row) => (
          <div key={row.label} className={styles.meter}>
            <span>{row.label}</span>
            <i>
              <b style={{ width: row.width }} />
            </i>
          </div>
        ))}
        <p className={styles.cardFoot}>
          <i />
          Reviewed by domain experts
        </p>
      </div>
    </div>
  );
}

/** A terminal showing the RAGMeter install command. */
export function TerminalMock() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={`${styles.cardInner} ${styles.terminal}`}>
        <p className={styles.termBar}>
          <i />
          <i />
          <i />
        </p>
        <p>
          <span>$</span> pip install rag-meter
        </p>
        <p className={styles.termMuted}>Evaluate your retrieval pipeline</p>
        <p className={styles.termCursor}>
          <span>$</span> <b />
        </p>
      </div>
    </div>
  );
}

export const iconPaths: Record<string, ReactNode> = {
  floor: <path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Zm0 4.5 9 4.5 9-4.5" />,
  camera: (
    <>
      <rect x="3" y="7" width="13" height="10" rx="2.5" />
      <path d="m16 10.5 5-2.5v8l-5-2.5" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.3 12.2 2.6 2.6 4.8-5.2" />
    </>
  ),
  consent: (
    <>
      <path d="M12 3.5 5 6.2v5.3c0 4.3 2.9 7.4 7 9 4.1-1.6 7-4.7 7-9V6.2L12 3.500Z" />
      <path d="m9 12 2.2 2.2L15 10" />
    </>
  ),
  loop: <path d="M4.500 12a7.500 7.500 0 0 1 12.800-5.300L19.500 9M19.500 4.500V9H15m4.500 3a7.500 7.500 0 0 1-12.800 5.300L4.500 15m0 4.500V15H9" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.500" />
      <path d="M3.500 12h17M12 3.500c2.500 2.300 3.800 5.100 3.800 8.500s-1.300 6.200-3.800 8.500c-2.500-2.300-3.800-5.100-3.800-8.500S9.500 5.800 12 3.500Z" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.500" width="14" height="9.500" rx="2.500" />
      <path d="M8.500 10.500V8a3.500 3.500 0 0 1 7 0v2.500" />
    </>
  ),
  wave: <path d="M3 12h1.5M6.5 8.5v7M10 5.5v13M13.5 8v8M17 10v4M20.5 12H21" />,
  text: <path d="M5 6.5h14M5 10.5h14M5 14.5h9M5 18.5h6" />,
  image: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <path d="m3.5 16 4.5-4.5 4 4 3-3 5.5 5.5" />
      <circle cx="15.5" cy="9.5" r="1.5" />
    </>
  ),
  lidar: (
    <>
      <circle cx="12" cy="12" r="2" />
      <path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14" />
    </>
  ),
  pay: (
    <>
      <circle cx="12" cy="12" r="8.500" />
      <path d="M14.500 9.300c-.5-.8-1.400-1.300-2.500-1.300-1.500 0-2.600.8-2.600 2s1 1.700 2.600 2 2.700.8 2.700 2-1.200 2-2.700 2c-1.200 0-2.200-.5-2.700-1.400M12 6.500V8m0 8v1.500" />
    </>
  ),
};

/** Small line icon in a rounded chip, used beside feature titles. */
export function IconChip({ name }: { name: keyof typeof iconPaths }) {
  return (
    <span className={styles.iconChip} aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {iconPaths[name]}
      </svg>
    </span>
  );
}

/** Centres an illustration over a panel's background image. */
export function PanelArt({ children }: { children: ReactNode }) {
  return <div className={styles.panelArt}>{children}</div>;
}
