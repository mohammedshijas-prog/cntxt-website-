/**
 * Traces brightness contours of an image or video frame onto a canvas
 * (marching squares over a small, blurred luminance grid).
 */

const GRID = 170;
// Contour levels, as brightness percentiles: higher levels trace the bright structures.
const LEVELS = [0.62, 0.74, 0.83, 0.9, 0.95];

let sampler: HTMLCanvasElement | null = null;

export function drawContours(
  canvas: HTMLCanvasElement,
  source: HTMLVideoElement | HTMLImageElement,
  rgb = "255, 255, 255",
) {
  const { width, height } = canvas.getBoundingClientRect();
  if (!width || !height) return;
  const ratio = window.devicePixelRatio || 1;
  if (canvas.width !== Math.round(width * ratio)) {
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const gw = GRID;
  const gh = Math.max(2, Math.round((GRID * height) / width));
  sampler ??= document.createElement("canvas");
  sampler.width = gw;
  sampler.height = gh;
  const sctx = sampler.getContext("2d", { willReadFrequently: true });
  if (!sctx) return;

  // Draw the source with object-fit: cover so the lines line up with the video.
  const sw = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
  const sh = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
  if (!sw || !sh) return;
  const scale = Math.max(gw / sw, gh / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  sctx.drawImage(source, (gw - dw) / 2, (gh - dh) / 2, dw, dh);
  const { data } = sctx.getImageData(0, 0, gw, gh);

  let lum = new Float32Array(gw * gh);
  for (let i = 0; i < gw * gh; i++) {
    lum[i] = (data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114) / 255;
  }
  lum = blur(blur(lum, gw, gh), gw, gh);

  const sorted = Array.from(lum).sort((a, b) => a - b);
  const levels = LEVELS.map((q) => sorted[Math.floor(q * (sorted.length - 1))]);

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const cx = width / (gw - 1);
  const cy = height / (gh - 1);

  levels.forEach((level, index) => {
    const strength = (index + 1) / levels.length;
    ctx.strokeStyle = `rgba(${rgb}, ${0.25 + strength * 0.7})`;
    ctx.lineWidth = 0.8 + strength * 0.8;
    ctx.beginPath();
    for (let y = 0; y < gh - 1; y++) {
      for (let x = 0; x < gw - 1; x++) {
        const a = lum[y * gw + x];
        const b = lum[y * gw + x + 1];
        const c = lum[(y + 1) * gw + x + 1];
        const d = lum[(y + 1) * gw + x];
        const code = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
        if (code === 0 || code === 15) continue;
        // Edge crossing points, interpolated between the corner values.
        const top = [x + t(a, b, level), y] as const;
        const right = [x + 1, y + t(b, c, level)] as const;
        const bottom = [x + t(d, c, level), y + 1] as const;
        const left = [x, y + t(a, d, level)] as const;
        const seg = (p: readonly [number, number], q: readonly [number, number]) => {
          ctx.moveTo(p[0] * cx, p[1] * cy);
          ctx.lineTo(q[0] * cx, q[1] * cy);
        };
        switch (code) {
          case 1: case 14: seg(left, bottom); break;
          case 2: case 13: seg(bottom, right); break;
          case 3: case 12: seg(left, right); break;
          case 4: case 11: seg(top, right); break;
          case 6: case 9: seg(top, bottom); break;
          case 7: case 8: seg(left, top); break;
          case 5: seg(left, top); seg(bottom, right); break;
          case 10: seg(top, right); seg(left, bottom); break;
        }
      }
    }
    ctx.stroke();
  });
}

function t(a: number, b: number, level: number) {
  return a === b ? 0.5 : Math.min(1, Math.max(0, (level - a) / (b - a)));
}

function blur(src: Float32Array, w: number, h: number) {
  const out = new Float32Array(src.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          sum += src[ny * w + nx];
          count++;
        }
      }
      out[y * w + x] = sum / count;
    }
  }
  return out;
}
