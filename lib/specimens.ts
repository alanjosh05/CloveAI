// Point clouds for the 3D plates. Every specimen has the same point count so any
// one can morph into any other, and each shape shows what that piece of work actually does.

export type SpecimenKey =
  | "clover"
  | "vision"
  | "bio"
  | "web"
  | "classifier"
  | "spam"
  | "invoice"
  | "containers"
  | "voice"
  | "phone";

export type Note = { at: [number, number, number]; text: string };

export type Cloud = { position: Float32Array; tone: Float32Array; notes: Note[] };

type Put = (x: number, y: number, z: number, tone?: number) => void;

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: () => number) {
  return Math.sqrt(-2 * Math.log(r() + 1e-6)) * Math.cos(2 * Math.PI * r());
}

function onSphere(r: () => number): [number, number, number] {
  const z = 2 * r() - 1;
  const t = 2 * Math.PI * r();
  const s = Math.sqrt(1 - z * z);
  return [s * Math.cos(t), s * Math.sin(t), z];
}

/** Sphere stippled like an engraving: dots gather on the side away from the light. */
function shadedSphere(put: Put, r: () => number, count: number, c: number[], rad: number, tone: number) {
  const light = [-0.5, 0.65, 0.57];
  let placed = 0;
  let guard = 0;
  while (placed < count && guard++ < count * 30) {
    const n = onSphere(r);
    const lit = n[0] * light[0] + n[1] * light[1] + n[2] * light[2];
    if (r() > 0.28 + 0.72 * (1 - (lit + 1) / 2)) continue;
    put(c[0] + n[0] * rad, c[1] + n[1] * rad, c[2] + n[2] * rad, tone);
    placed++;
  }
}

function clover(put: Put, n: number, r: () => number): Note[] {
  const dirs: [number, number][] = [
    [Math.SQRT1_2, -Math.SQRT1_2],
    [-Math.SQRT1_2, -Math.SQRT1_2],
    [-Math.SQRT1_2, Math.SQRT1_2],
  ];
  const L = 1.72;
  const inner = 0.1;
  const hw = 0.5;
  const leafN = Math.floor((n * 0.78) / 3);

  dirs.forEach(([dx, dy]) => {
    const lat = [-dy, dx];
    for (let i = 0; i < leafN; i++) {
      const pick = r();
      let u: number;
      let v: number;
      if (pick < 0.46) {
        u = Math.acos(1 - 2 * r()) / Math.PI;
        v = (r() * 2 - 1) * 0.98;
      } else if (pick < 0.68) {
        u = r();
        v = (r() < 0.5 ? -1 : 1) * (0.97 + r() * 0.03);
      } else if (pick < 0.82) {
        u = r();
        v = gauss(r) * 0.012;
      } else {
        // side veins sweep forward from the midrib to the rim
        const k = 1 + Math.floor(r() * 5);
        const t = r();
        const side = r() < 0.5 ? -1 : 1;
        u = Math.min(1, k / 7.5 + t * 0.14);
        v = side * t * 0.95;
      }
      const w = hw * Math.pow(Math.sin(Math.PI * u), 0.82);
      const along = inner + u * (L - inner);
      const across = v * w;
      const cup = 0.34 * Math.sin(Math.PI * u) - 0.5 * (v * w) * (v * w) * 2.2 - 0.28 * u * u;
      put(dx * along + lat[0] * across, dy * along + lat[1] * across, cup + gauss(r) * 0.006, 0);
    }
  });

  const placed = leafN * 3;
  shadedSphere(put, r, n - placed, [0.72, 0.72, 0.12], 0.44, 1);
  return [
    { at: [1.02, 1.02, 0.3], text: "Fourth sepal, a data point" },
    { at: [-0.7, 0.7, 0.3], text: "Drag to turn" },
  ];
}

function vision(put: Put, n: number, r: () => number): Note[] {
  const heights = [
    [0.55, 0.95, 0.7, 1.25, 0.6],
    [0.8, 1.45, 2.3, 1.1, 0.75],
    [0.4, 0.7, 1.05, 0.85, 0.5],
  ];
  const size = 0.3;
  const gap = 0.56;
  const floorN = Math.floor(n * 0.14);
  const bars: { x: number; z: number; h: number; hit: boolean }[] = [];
  heights.forEach((row, j) =>
    row.forEach((h, i) => bars.push({ x: (i - 2) * gap, z: (j - 1) * gap, h, hit: i === 2 && j === 1 })),
  );
  const base = -1.1;
  for (let i = 0; i < floorN; i++) {
    const across = r() < 0.5;
    const line = (Math.floor(r() * 7) - 3) * gap * 0.8;
    const along = (r() * 2 - 1) * 1.45;
    put(across ? along : line, base, across ? line : along, 0);
  }
  const total = bars.reduce((s, b) => s + b.h, 0);
  let left = n - floorN;
  bars.forEach((b, idx) => {
    const c = idx === bars.length - 1 ? left : Math.floor(((n - floorN) * b.h) / total);
    left -= c;
    for (let i = 0; i < c; i++) {
      const pick = r();
      const y = base + r() * b.h;
      if (pick < 0.18) {
        const sx = r() < 0.5 ? -1 : 1;
        const sz = r() < 0.5 ? -1 : 1;
        put(b.x + sx * size * 0.5, y, b.z + sz * size * 0.5, b.hit ? 1 : 0);
      } else if (pick < 0.3) {
        put(b.x + (r() - 0.5) * size, base + b.h, b.z + (r() - 0.5) * size, b.hit ? 1 : 0);
      } else {
        const face = Math.floor(r() * 4);
        const t = (r() - 0.5) * size;
        const off = size * 0.5 * (face < 2 ? -1 : 1);
        if (face % 2 === 0) put(b.x + off, y, b.z + t, b.hit ? 1 : 0);
        else put(b.x + t, y, b.z + off, b.hit ? 1 : 0);
      }
    }
  });
  return [
    { at: [0, base + 2.3, 0], text: "The answer to a chart question" },
    { at: [-1.1, base + 0.5, 0.56], text: "2,000 chart QA pairs" },
  ];
}

function bio(put: Put, n: number, r: () => number): Note[] {
  const H = 3.2;
  const R = 0.72;
  const turns = 2.2;
  const strandN = Math.floor(n * 0.6);
  for (let i = 0; i < strandN; i++) {
    const t = r();
    const a = t * turns * 2 * Math.PI + (i % 2 ? Math.PI : 0);
    const n1 = onSphere(r);
    const k = 0.07;
    put(R * Math.cos(a) + n1[0] * k, (t - 0.5) * H + n1[1] * k, R * Math.sin(a) + n1[2] * k, 0);
  }
  const rungs = 26;
  const hit = 13;
  const left = n - strandN;
  for (let i = 0; i < left; i++) {
    const k = i % rungs;
    const t = (k + 0.5) / rungs;
    const a = t * turns * 2 * Math.PI;
    const s = r() * 2 - 1;
    put(
      s * R * Math.cos(a) + gauss(r) * 0.012,
      (t - 0.5) * H + gauss(r) * 0.012,
      s * R * Math.sin(a) + gauss(r) * 0.012,
      Math.abs(k - hit) <= 1 ? 1 : 0,
    );
  }
  return [
    { at: [0, 0.06, 0.1], text: "Biomedical instruction tuning" },
    { at: [0.7, 1.32, 0], text: "BioGPT base model" },
  ];
}

function web(put: Put, n: number, r: () => number): Note[] {
  const spokes = 17;
  const rings = 15;
  const dish = (x: number, y: number) => -0.2 * (x * x + y * y) + 0.3;
  const spokeR = (i: number) => 1.42 + 0.26 * Math.sin(i * 2.7) + 0.12 * Math.cos(i * 5.1);
  const spokeN = Math.floor(n * 0.3);
  for (let i = 0; i < spokeN; i++) {
    const k = i % spokes;
    const a = (k / spokes) * 2 * Math.PI + 0.1 * Math.sin(k * 3.1);
    const t = Math.sqrt(r()) * spokeR(k);
    const x = t * Math.cos(a) + gauss(r) * 0.005;
    const y = t * Math.sin(a) + gauss(r) * 0.005;
    put(x, y, dish(x, y), 0);
  }
  const node = Math.floor(n * 0.08);
  const spiral = n - spokeN - node;
  for (let i = 0; i < spiral; i++) {
    const ring = 1 + Math.floor(r() * rings);
    const k = Math.floor(r() * spokes);
    const a0 = (k / spokes) * 2 * Math.PI + 0.1 * Math.sin(k * 3.1);
    const a1 = (((k + 1) % spokes) / spokes) * 2 * Math.PI + 0.1 * Math.sin(((k + 1) % spokes) * 3.1) + (k === spokes - 1 ? 2 * Math.PI : 0);
    const t = r();
    const sag = 1 - 0.1 * Math.sin(Math.PI * t);
    const rad = (ring / (rings + 0.6)) * (spokeR(k) * (1 - t) + spokeR((k + 1) % spokes) * t) * sag;
    const a = a0 + (a1 - a0) * t;
    const x = rad * Math.cos(a) + gauss(r) * 0.004;
    const y = rad * Math.sin(a) + gauss(r) * 0.004;
    put(x, y, dish(x, y), 0);
  }
  const c = [0.46, 0.34, dish(0.46, 0.34) + 0.04];
  shadedSphere(put, r, node, c, 0.14, 1);
  return [
    { at: [c[0], c[1], c[2]], text: "Fine-tuned on web data" },
    { at: [-1.1, -0.72, dish(-1.1, -0.72)], text: "1,500 synthetic pairs" },
  ];
}

function classifier(put: Put, n: number, r: () => number): Note[] {
  const sheet = Math.floor(n * 0.14);
  const planeX = (y: number, z: number) => 0.22 * Math.sin(y * 1.5) * Math.cos(z * 1.2);
  const reach = 1.25;
  for (let i = 0; i < sheet; i++) {
    const onY = r() < 0.5;
    const y = onY ? (Math.floor(r() * 11) - 5) * 0.25 : (r() * 2 - 1) * reach;
    const z = onY ? (r() * 2 - 1) * reach : (Math.floor(r() * 11) - 5) * 0.25;
    put(planeX(y, z), y, z, 0);
  }
  const each = Math.floor((n - sheet) / 2);
  shadedSphere(put, r, each, [-0.86, 0.02, 0], 0.72, 0);
  shadedSphere(put, r, n - sheet - each, [0.86, 0.02, 0], 0.72, 1);
  return [
    { at: [0.92, 0.5, 0.5], text: "Likely AI-written" },
    { at: [-0.92, -0.5, 0.5], text: "Likely human-written" },
  ];
}

function spam(put: Put, n: number, r: () => number): Note[] {
  // Ten messages, three of them pulled aside: the dataset is 29.7% spam.
  const flagged = new Set([2, 5, 8]);
  const count = 10;
  const w = 1.25;
  const h = 0.125;
  const rad = 0.04;
  const per = Math.floor(n / count);
  for (let b = 0; b < count; b++) {
    const y = (4.5 - b) * 0.33;
    const hit = flagged.has(b);
    const ox = hit ? 0.92 : -0.26;
    const oz = hit ? 0.42 : 0;
    const tilt = hit ? -0.16 : 0;
    const c = b === count - 1 ? n - per * (count - 1) : per;
    for (let i = 0; i < c; i++) {
      const pick = r();
      let x: number;
      let yy: number;
      if (pick < 0.5) {
        // rounded outline
        const t = r() * (2 * (2 * w + 2 * h));
        const edge = t < 2 * w ? 0 : t < 2 * w + 2 * h ? 1 : t < 4 * w + 2 * h ? 2 : 3;
        x = edge === 1 ? w : edge === 3 ? -w : (r() * 2 - 1) * (w - rad);
        yy = edge === 0 ? h : edge === 2 ? -h : (r() * 2 - 1) * (h - rad);
      } else if (pick < 0.86) {
        // lines of text
        const line = Math.floor(r() * 2);
        x = -w * 0.84 + r() * (line ? 1.2 : 1.9);
        yy = line ? -0.045 : 0.045;
        yy += gauss(r) * 0.012;
      } else {
        x = (r() * 2 - 1) * w;
        yy = (r() * 2 - 1) * h;
      }
      const sx = 0.62;
      const px = x * sx;
      put(px * Math.cos(tilt) - yy * Math.sin(tilt) + ox, y + px * Math.sin(tilt) + yy * Math.cos(tilt), oz + gauss(r) * 0.006, hit ? 1 : 0);
    }
  }
  return [
    { at: [0.92 + 0.74, (4.5 - 5) * 0.33, 0.42], text: "Spam, pulled from the stack" },
    { at: [-0.26 - 0.74, (4.5 - 3) * 0.33, 0], text: "Ham stays in place" },
  ];
}

/** A point on the outline of a rounded rectangle centered on the origin. */
function onRoundRect(r: () => number, w: number, h: number, rad: number): [number, number] {
  const sx = 2 * (w - rad);
  const sy = 2 * (h - rad);
  const arc = (Math.PI / 2) * rad;
  let t = r() * (2 * sx + 2 * sy + 4 * arc);
  if (t < sx) return [-w + rad + t, h];
  t -= sx;
  if (t < sx) return [-w + rad + t, -h];
  t -= sx;
  if (t < sy) return [-w, -h + rad + t];
  t -= sy;
  if (t < sy) return [w, -h + rad + t];
  t -= sy;
  const corner = Math.floor(t / arc);
  const a = ((t - corner * arc) / arc) * (Math.PI / 2) + (corner * Math.PI) / 2;
  const cx = corner === 0 || corner === 3 ? w - rad : -w + rad;
  const cy = corner < 2 ? h - rad : -h + rad;
  return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
}

function invoice(put: Put, n: number, r: () => number): Note[] {
  // A page of text with three of its fields lifted off toward the reader.
  const W = 1.02;
  const H = 1.46;
  const rows = 13;
  const rowY = (i: number) => 1.16 - i * 0.2;
  const fields = new Map([
    [1, 0.5],
    [6, 0.95],
    [11, 0.62],
  ]);
  const outlineN = Math.floor(n * 0.16);
  for (let i = 0; i < outlineN; i++) {
    const [x, y] = onRoundRect(r, W, H, 0.05);
    put(x - 0.42, y, gauss(r) * 0.004, 0);
  }
  const fieldN = Math.floor(n * 0.22);
  const lineN = n - outlineN - fieldN;
  for (let i = 0; i < lineN; i++) {
    const row = Math.floor(r() * rows);
    const len = 0.45 + 0.5 * Math.abs(Math.sin(row * 2.3));
    put(-0.42 - W * 0.82 + r() * W * 1.64 * len, rowY(row) + gauss(r) * 0.016, gauss(r) * 0.004, 0);
  }
  const lifted = [...fields.entries()];
  for (let i = 0; i < fieldN; i++) {
    const [row, z] = lifted[i % lifted.length];
    const y = rowY(row);
    if (r() < 0.1) {
      // The thread each field was pulled along.
      const t = r();
      put(-0.42 + t * 1.1, y, t * z, 1);
    } else if (r() < 0.55) {
      const [x, yy] = onRoundRect(r, 0.56, 0.085, 0.03);
      put(x + 1.24, y + yy, z, 1);
    } else {
      put(0.84 + r() * (0.4 + 0.3 * Math.abs(Math.sin(row))), y + gauss(r) * 0.014, z, 1);
    }
  }
  return [
    { at: [1.8, rowY(6), 0.95], text: "Key fields read from the page" },
    { at: [-1.44, -0.96, 0], text: "Invoice flow, end to end" },
  ];
}

function containers(put: Put, n: number, r: () => number): Note[] {
  // A container stack on a quay, with one box being hoisted into place.
  const L = 0.98;
  const T = 0.46;
  const D = 0.5;
  const base = -1.25;
  const boxes: { c: number[]; hit: boolean }[] = [];
  for (let tier = 0; tier < 3; tier++) {
    for (let col = 0; col < 3; col++) {
      for (let deep = 0; deep < 2; deep++) {
        boxes.push({ c: [(col - 1) * 1.06, base + T / 2 + tier * 0.5, (deep - 0.5) * 0.56], hit: false });
      }
    }
  }
  boxes.push({ c: [-1.06, base + T / 2 + 1.5, 0.28], hit: false });
  boxes.push({ c: [-1.06, base + T / 2 + 1.5, -0.28], hit: false });
  const hoist = [0.3, base + T / 2 + 2.1, 0.28];
  boxes.push({ c: hoist, hit: true });

  const cableN = Math.floor(n * 0.015);
  for (let i = 0; i < cableN; i++) {
    put(hoist[0] + gauss(r) * 0.004, hoist[1] + T / 2 + r() * 0.5, hoist[2], 1);
  }
  const per = Math.floor((n - cableN) / boxes.length);
  boxes.forEach(({ c, hit }, b) => {
    const count = b === boxes.length - 1 ? n - cableN - per * (boxes.length - 1) : per;
    const tone = hit ? 1 : 0;
    for (let i = 0; i < count; i++) {
      const pick = r();
      let x = (r() - 0.5) * L;
      let y = (r() - 0.5) * T;
      let z = (r() - 0.5) * D;
      if (pick < 0.3) {
        // Hard edges so each box reads as a box.
        const axis = Math.floor(r() * 3);
        if (axis !== 0) x = (r() < 0.5 ? -0.5 : 0.5) * L;
        if (axis !== 1) y = (r() < 0.5 ? -0.5 : 0.5) * T;
        if (axis !== 2) z = (r() < 0.5 ? -0.5 : 0.5) * D;
      } else if (pick < 0.82) {
        // Corrugated long sides.
        z = (r() < 0.5 ? -0.5 : 0.5) * D;
        x = (Math.round((x / L) * 14) / 14) * L;
      } else if (pick < 0.92) {
        x = (r() < 0.5 ? -0.5 : 0.5) * L;
      } else {
        y = 0.5 * T;
      }
      put(c[0] + x, c[1] + y, c[2] + z, tone);
    }
  });
  return [
    { at: [hoist[0] + L / 2, hoist[1], hoist[2]], text: "AI automation for logistics" },
    { at: [-1.06 - L / 2, base + 0.4, 0.28], text: "ERP for a shipping company" },
  ];
}

function voice(put: Put, n: number, r: () => number): Note[] {
  // A spoken phrase as a waveform, bending toward the reader, with an echo behind it.
  const bars = 57;
  const X = 1.9;
  const amp = (k: number) => {
    const u = (k / (bars - 1)) * 2 - 1;
    const env = Math.exp(-u * u * 2.6);
    return 0.1 + 1.25 * env * (0.32 + 0.68 * Math.abs(Math.sin(k * 0.73) * Math.cos(k * 0.31)));
  };
  const total = Array.from({ length: bars }, (_, k) => amp(k)).reduce((a, b) => a + b, 0);
  const echoN = Math.floor(n * 0.2);
  for (let i = 0; i < echoN; i++) {
    const k = Math.floor(r() * bars);
    const x = ((k / (bars - 1)) * 2 - 1) * X;
    put(x + gauss(r) * 0.006, (r() * 2 - 1) * amp(k) * 0.42, -0.62 + 0.3 * Math.cos(x * 0.8), 0);
  }
  let left = n - echoN;
  for (let k = 0; k < bars; k++) {
    const c = k === bars - 1 ? left : Math.floor(((n - echoN) * amp(k)) / total);
    left -= c;
    const x = ((k / (bars - 1)) * 2 - 1) * X;
    const z = 0.46 * Math.cos(x * 0.8);
    const tone = Math.abs(k - 28) <= 4 ? 1 : 0;
    for (let i = 0; i < c; i++) {
      put(x + (r() - 0.5) * 0.034, (r() * 2 - 1) * amp(k), z + (r() - 0.5) * 0.034, tone);
    }
  }
  return [
    { at: [0, amp(28), 0.46], text: "AI voice agent calling customers" },
    { at: [-1.5, -0.3, 0.1], text: "WhatsApp and structured records" },
  ];
}

function phone(put: Put, n: number, r: () => number): Note[] {
  // The body of a phone, a list on its screen, one row raised under a finger.
  const W = 0.86;
  const H = 1.68;
  const bodyN = Math.floor(n * 0.3);
  for (let i = 0; i < bodyN; i++) {
    const [x, y] = onRoundRect(r, W, H, 0.17);
    put(x, y, (r() < 0.5 ? -1 : 1) * 0.07 * (r() < 0.8 ? 1 : r()), 0);
  }
  const rows = 6;
  const rowY = (i: number) => 1.08 - i * 0.44;
  const hit = 2;
  const left = n - bodyN;
  for (let i = 0; i < left; i++) {
    const row = i % rows;
    const isHit = row === hit;
    const z = isHit ? 0.42 : 0.07;
    const grow = isHit ? 1.1 : 1;
    const y = rowY(row);
    const pick = r();
    if (pick < 0.42) {
      const [x, yy] = onRoundRect(r, 0.68 * grow, 0.17 * grow, 0.05);
      put(x, y + yy, z, isHit ? 1 : 0);
    } else if (pick < 0.62) {
      // Avatar in the row.
      const a = r() * 2 * Math.PI;
      const rad = 0.085 * Math.sqrt(r());
      put(-0.46 * grow + rad * Math.cos(a), y + rad * Math.sin(a), z, isHit ? 1 : 0);
    } else {
      const line = r() < 0.5 ? 1 : -1;
      put(-0.28 + r() * (line > 0 ? 0.8 : 0.5), y + line * 0.05 + gauss(r) * 0.01, z, isHit ? 1 : 0);
    }
  }
  return [
    { at: [0.75, rowY(hit), 0.42], text: "One app across the ERP and CRM" },
    { at: [-W, -1.1, 0.07], text: "Company-internal, not public" },
  ];
}

const BUILDERS: Record<SpecimenKey, (put: Put, n: number, r: () => number) => Note[]> = {
  clover,
  vision,
  bio,
  web,
  classifier,
  spam,
  invoice,
  containers,
  voice,
  phone,
};

const cache = new Map<string, Cloud>();

export function getCloud(key: SpecimenKey, n: number): Cloud {
  const id = `${key}:${n}`;
  const hit = cache.get(id);
  if (hit) return hit;
  const position = new Float32Array(n * 3);
  const tone = new Float32Array(n);
  let i = 0;
  const put: Put = (x, y, z, t = 0) => {
    if (i >= n) return;
    position[i * 3] = x;
    position[i * 3 + 1] = y;
    position[i * 3 + 2] = z;
    tone[i] = t;
    i++;
  };
  const r = rng(key.length * 7919 + key.charCodeAt(0));
  const notes = BUILDERS[key](put, n, r);
  // Shuffle so the morph flies points across the shape, not along it.
  const s = rng(42);
  for (let k = i - 1; k > 0; k--) {
    const j = Math.floor(s() * (k + 1));
    for (let a = 0; a < 3; a++) {
      const v = position[k * 3 + a];
      position[k * 3 + a] = position[j * 3 + a];
      position[j * 3 + a] = v;
    }
    const v = tone[k];
    tone[k] = tone[j];
    tone[j] = v;
  }
  // Any point a builder did not place sits on an existing one.
  for (; i < n; i++) {
    const j = Math.floor(s() * Math.max(1, i));
    position[i * 3] = position[j * 3];
    position[i * 3 + 1] = position[j * 3 + 1];
    position[i * 3 + 2] = position[j * 3 + 2];
    tone[i] = tone[j];
  }
  const cloud = { position, tone, notes };
  cache.set(id, cloud);
  return cloud;
}
