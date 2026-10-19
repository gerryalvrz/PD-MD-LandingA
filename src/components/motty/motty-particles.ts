/** Canvas particle explode / reform for Motty still frame. */

export type MottyParticle = {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  g: number;
  b: number;
  a: number;
  size: number;
};

export type MottyParticlePhase = "idle" | "anticipate" | "explode" | "reform";

const STILL_SRC = "/motty/motty-still.png";
const SAMPLE_GAP = 3;

let cachedImage: HTMLImageElement | null = null;
let cachedLoad: Promise<HTMLImageElement> | null = null;

function loadStill(): Promise<HTMLImageElement> {
  if (cachedImage?.complete) return Promise.resolve(cachedImage);
  if (cachedLoad) return cachedLoad;
  cachedLoad = new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      cachedImage = img;
      resolve(img);
    };
    img.onerror = () => reject(new Error("Failed to load Motty still"));
    img.src = STILL_SRC;
  });
  return cachedLoad;
}

export async function sampleMottyParticles(
  displaySize: number,
): Promise<MottyParticle[]> {
  const img = await loadStill();
  const source = document.createElement("canvas");
  source.width = img.naturalWidth || img.width;
  source.height = img.naturalHeight || img.height;
  const ctx = source.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  ctx.drawImage(img, 0, 0);
  const { data, width, height } = ctx.getImageData(0, 0, source.width, source.height);
  const scale = displaySize / width;
  const particles: MottyParticle[] = [];

  for (let y = 0; y < height; y += SAMPLE_GAP) {
    for (let x = 0; x < width; x += SAMPLE_GAP) {
      const i = (y * width + x) * 4;
      const alpha = data[i + 3];
      if (alpha < 40) continue;
      // Skip near-pure black backdrop samples
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r + g + b < 24 && alpha > 200) continue;

      const homeX = (x + 0.5) * scale;
      const homeY = (y + 0.5) * scale;
      particles.push({
        homeX,
        homeY,
        x: homeX,
        y: homeY,
        vx: 0,
        vy: 0,
        r,
        g,
        b,
        a: alpha / 255,
        size: Math.max(1.1, SAMPLE_GAP * scale * 0.72),
      });
    }
  }
  return particles;
}

export function kickExplode(particles: MottyParticle[], strength = 520) {
  const cx =
    particles.reduce((sum, p) => sum + p.homeX, 0) / Math.max(1, particles.length);
  const cy =
    particles.reduce((sum, p) => sum + p.homeY, 0) / Math.max(1, particles.length);

  for (const p of particles) {
    const dx = p.homeX - cx + (Math.random() - 0.5) * 8;
    const dy = p.homeY - cy + (Math.random() - 0.5) * 8;
    const dist = Math.hypot(dx, dy) || 1;
    const force = strength * (0.55 + Math.random() * 0.7);
    p.x = p.homeX;
    p.y = p.homeY;
    p.vx = (dx / dist) * force * 0.016;
    p.vy = (dy / dist) * force * 0.016 - Math.random() * 1.2;
  }
}

export function stepParticles(
  particles: MottyParticle[],
  phase: MottyParticlePhase,
  dt: number,
) {
  if (phase === "explode") {
    for (const p of particles) {
      p.vy += 28 * dt;
      p.vx *= 0.992;
      p.vy *= 0.992;
      p.x += p.vx;
      p.y += p.vy;
    }
    return;
  }

  if (phase === "reform") {
    const stiffness = 14;
    const damping = 0.78;
    for (const p of particles) {
      const ax = (p.homeX - p.x) * stiffness;
      const ay = (p.homeY - p.y) * stiffness;
      p.vx = (p.vx + ax * dt) * damping;
      p.vy = (p.vy + ay * dt) * damping;
      p.x += p.vx;
      p.y += p.vy;
    }
  }
}

export function particlesSettled(particles: MottyParticle[], epsilon = 0.55) {
  return particles.every(
    (p) =>
      Math.abs(p.x - p.homeX) < epsilon &&
      Math.abs(p.y - p.homeY) < epsilon &&
      Math.abs(p.vx) < 0.08 &&
      Math.abs(p.vy) < 0.08,
  );
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: MottyParticle[],
  offsetX: number,
  offsetY: number,
) {
  for (const p of particles) {
    ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.a})`;
    ctx.beginPath();
    ctx.arc(p.x + offsetX, p.y + offsetY, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
