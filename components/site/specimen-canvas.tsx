"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { animate } from "animejs";
import * as THREE from "three";
import { getCloud, type Note, type SpecimenKey } from "@/lib/specimens";

const INK = new THREE.Color("#17211b");
const LEAF = new THREE.Color("#1d3a2c");
const CINNABAR = new THREE.Color("#b8431f");

const vertex = /* glsl */ `
  attribute vec3 aTo;
  attribute float aTone;
  attribute float aToneTo;
  attribute float aSeed;
  uniform float uMix;
  uniform float uScatter;
  uniform float uSize;
  uniform float uRepel;
  uniform float uAspect;
  uniform vec2 uPointer;
  varying float vTone;
  varying float vAlpha;

  void main() {
    float delay = aSeed * 0.35;
    float m = smoothstep(delay, delay + 0.65, uMix);
    vec3 p = mix(position, aTo, m);
    vec3 dir = normalize(vec3(sin(aSeed * 91.7), cos(aSeed * 47.3), sin(aSeed * 13.1 + 1.0)));
    p += dir * sin(3.14159 * m) * 0.32;
    p += dir * uScatter * (0.5 + aSeed * 1.8);
    p.y += uScatter * aSeed * 0.9;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 d = (clip.xy / clip.w - uPointer) * vec2(uAspect, 1.0);
    float dist = length(d) + 0.0001;
    mv.xy += (d / dist) * uRepel * smoothstep(0.4, 0.0, dist) * 0.3;

    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (5.6 / -mv.z) * (0.8 + aSeed * 0.5);

    float depth = clamp((-mv.z - 3.9) / 3.2, 0.0, 1.0);
    vAlpha = mix(0.96, 0.3, depth) * (1.0 - uScatter * 0.75);
    vTone = mix(aTone, aToneTo, m);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uAccent;
  varying float vTone;
  varying float vAlpha;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.36, r) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(mix(uInk, uAccent, step(0.5, vTone)), a);
  }
`;

type CloudProps = {
  specimen: SpecimenKey;
  count: number;
  size: number;
  scatter?: { current: number };
  noteEls: React.RefObject<(HTMLDivElement | null)[]>;
  drag: React.RefObject<{ x: number; y: number; active: boolean }>;
  pointer: React.RefObject<{ x: number; y: number; inside: boolean }>;
  reduced: boolean;
  onNotes: (notes: Note[]) => void;
  ink?: boolean;
};

function PointCloud({ specimen, count, size, scatter, noteEls, drag, pointer, reduced, onNotes, ink }: CloudProps) {
  const group = useRef<THREE.Group>(null);
  const { camera, size: view } = useThree();
  const current = useRef<SpecimenKey>(specimen);
  const notes = useRef<Note[]>([]);
  const rotation = useRef({ x: 0, y: 0 });
  const vec = useMemo(() => new THREE.Vector3(), []);

  const { geometry, material } = useMemo(() => {
    const first = getCloud(specimen, count);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(first.position.slice(), 3));
    g.setAttribute("aTo", new THREE.BufferAttribute(first.position.slice(), 3));
    g.setAttribute("aTone", new THREE.BufferAttribute(first.tone.slice(), 1));
    g.setAttribute("aToneTo", new THREE.BufferAttribute(first.tone.slice(), 1));
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const v = Math.sin(i * 12.9898) * 43758.5453;
      seeds[i] = v - Math.floor(v);
    }
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uMix: { value: 1 },
        uScatter: { value: 0 },
        uSize: { value: size },
        uRepel: { value: 0 },
        uAspect: { value: 1 },
        uPointer: { value: new THREE.Vector2(9, 9) },
        uInk: { value: ink ? INK : LEAF },
        uAccent: { value: CINNABAR },
      },
    });
    return { geometry: g, material: m };
    // One geometry for the life of the canvas. Specimen changes morph it below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useEffect(() => {
    onNotes(getCloud(specimen, count).notes);
    notes.current = getCloud(specimen, count).notes;
    if (current.current === specimen) return;
    current.current = specimen;

    const uMix = material.uniforms.uMix;
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    const to = geometry.getAttribute("aTo") as THREE.BufferAttribute;
    const tone = geometry.getAttribute("aTone") as THREE.BufferAttribute;
    const toneTo = geometry.getAttribute("aToneTo") as THREE.BufferAttribute;
    const seed = geometry.getAttribute("aSeed") as THREE.BufferAttribute;

    // Bake wherever the points are now, so an interrupted morph continues smoothly.
    gsap.killTweensOf(uMix);
    const mix = uMix.value;
    for (let i = 0; i < count; i++) {
      const d = seed.getX(i) * 0.35;
      const t = Math.min(1, Math.max(0, (mix - d) / 0.65));
      const m = t * t * (3 - 2 * t);
      pos.setXYZ(
        i,
        pos.getX(i) + (to.getX(i) - pos.getX(i)) * m,
        pos.getY(i) + (to.getY(i) - pos.getY(i)) * m,
        pos.getZ(i) + (to.getZ(i) - pos.getZ(i)) * m,
      );
      tone.setX(i, m > 0.5 ? toneTo.getX(i) : tone.getX(i));
    }

    const next = getCloud(specimen, count);
    to.copyArray(next.position);
    toneTo.copyArray(next.tone);
    pos.needsUpdate = to.needsUpdate = tone.needsUpdate = toneTo.needsUpdate = true;
    uMix.value = 0;
    gsap.to(uMix, { value: 1, duration: reduced ? 0 : 1.15, ease: "power2.inOut" });
  }, [specimen, count, geometry, material, onNotes, reduced]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const u = material.uniforms;
    const t = state.clock.elapsedTime;
    const idleY = reduced ? 0 : Math.sin(t * 0.22) * 0.32;
    const idleX = reduced ? 0 : Math.sin(t * 0.17) * 0.07;
    const k = 1 - Math.exp(-delta * 6);
    rotation.current.x += (drag.current.x + idleX - 0.14 - rotation.current.x) * k;
    rotation.current.y += (drag.current.y + idleY - rotation.current.y) * k;
    g.rotation.set(rotation.current.x, rotation.current.y, 0);

    const aspect = view.width / Math.max(1, view.height);
    g.scale.setScalar(Math.min(1, aspect / 1.05));
    u.uAspect.value = aspect;
    if (scatter) u.uScatter.value = scatter.current;

    const p = pointer.current;
    u.uPointer.value.set(p.x, p.y);
    const target = p.inside && !drag.current.active ? 1 : 0;
    u.uRepel.value += (target - u.uRepel.value) * (1 - Math.exp(-delta * 8));

    // Plate notes follow their anchors on the turning specimen.
    g.updateMatrixWorld();
    const hw = view.width / 2;
    const hh = view.height / 2;
    noteEls.current.forEach((el, i) => {
      const note = notes.current[i];
      if (!el || !note) return;
      vec.set(note.at[0], note.at[1], note.at[2]).applyMatrix4(g.matrixWorld).project(camera);
      const x = vec.x * hw + hw;
      const y = -vec.y * hh + hh;
      const w = el.offsetWidth;
      // Labels sit outside the specimen, and flip rather than leave the plate.
      let side = x > hw ? "right" : "left";
      if (side === "right" && x + w > view.width) side = "left";
      if (side === "left" && x - w < 0) side = "right";
      if (el.dataset.side !== side) el.dataset.side = side;
      el.style.transform = `translate3d(${side === "left" ? x - w + 2.5 : x - 2.5}px, ${y - el.offsetHeight / 2}px, 0)`;
    });
  });

  return (
    <group ref={group}>
      <points frustumCulled={false} geometry={geometry} material={material} />
    </group>
  );
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export type SpecimenCanvasProps = {
  specimen: SpecimenKey;
  label: string;
  scatter?: { current: number };
  showNotes?: boolean;
};

export default function SpecimenCanvas({ specimen, label, scatter, showNotes = true }: SpecimenCanvasProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const noteEls = useRef<(HTMLDivElement | null)[]>([]);
  const noteLayer = useRef<HTMLDivElement>(null);
  const drag = useRef({ x: 0, y: 0, active: false });
  const pointer = useRef({ x: 9, y: 9, inside: false });
  const [notes, setNotes] = useState<Note[]>([]);
  const [visible, setVisible] = useState(true);
  const [env] = useState(() => {
    if (typeof window === "undefined") return { webgl: true, narrow: false, reduced: false };
    return {
      webgl: hasWebGL(),
      narrow: window.innerWidth < 768,
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
  });

  const count = env.narrow ? 9000 : 18000;
  const size = env.narrow ? 2.1 : 2.4;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Notes fade in after each morph lands.
  useEffect(() => {
    const layer = noteLayer.current;
    if (!layer) return;
    const a = animate(layer, {
      opacity: [0, 1],
      duration: env.reduced ? 0 : 420,
      delay: env.reduced ? 0 : 720,
      ease: "out(3)",
    });
    return () => {
      a.cancel();
    };
  }, [notes, env.reduced]);

  if (!env.webgl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/brand/symbol.svg" alt={label} className="mx-auto size-2/3 max-h-full object-contain" />;
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    drag.current.active = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    pointer.current.inside = true;
    if (drag.current.active) {
      drag.current.y += e.movementX * 0.008;
      drag.current.x = Math.max(-0.9, Math.min(0.9, drag.current.x + e.movementY * 0.006));
    }
  };

  return (
    <div
      ref={wrap}
      role="img"
      aria-label={label}
      className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => (drag.current.active = false)}
      onPointerCancel={() => (drag.current.active = false)}
      onPointerLeave={() => (pointer.current.inside = false)}
    >
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5.6], fov: 40 }}
      >
        <PointCloud
          specimen={specimen}
          count={count}
          size={size}
          scatter={scatter}
          noteEls={noteEls}
          drag={drag}
          pointer={pointer}
          reduced={env.reduced}
          onNotes={setNotes}
        />
      </Canvas>
      {showNotes && (
        <div ref={noteLayer} className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block" aria-hidden>
          {notes.map((n, i) => (
            <div
              key={`${specimen}-${n.text}`}
              ref={(el) => {
                noteEls.current[i] = el;
              }}
              className="plate-note meta"
              data-side="left"
            >
              <i />
              <span>{n.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
