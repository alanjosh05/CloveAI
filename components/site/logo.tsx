"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, svg } from "animejs";
import { cn } from "@/lib/utils";

const LEAVES = [
  "M137.19 137.19A59.25 59.25 0 0 1 214.27 214.27A59.25 59.25 0 0 1 137.19 137.19Z",
  "M118.81 137.19A59.25 59.25 0 0 1 41.73 214.27A59.25 59.25 0 0 1 118.81 137.19Z",
  "M118.81 118.81A59.25 59.25 0 0 1 41.73 41.73A59.25 59.25 0 0 1 118.81 118.81Z",
];

/** The mark: three leaves of a clove's calyx, the fourth sepal turned into a data point. */
export function LogoMark({ className, draw = false }: { className?: string; draw?: boolean }) {
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!draw || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const leaves = el.querySelectorAll<SVGPathElement>("path");
    const node = el.querySelector("circle");
    const drawn = svg.createDrawable(leaves);
    const anims = [
      animate(drawn, { draw: ["0 0", "0 1"], duration: 800, delay: stagger(110), ease: "inOut(3)" }),
      animate(leaves, { fillOpacity: [0, 1], duration: 420, delay: stagger(110, { start: 520 }), ease: "out(3)" }),
      animate(node!, { r: [0, 33], duration: 460, delay: 860, ease: "out(4)" }),
    ];
    return () => anims.forEach((a) => a.revert());
  }, [draw]);

  return (
    <svg ref={root} viewBox="0 0 256 256" aria-hidden className={cn("size-6 shrink-0", className)}>
      {LEAVES.map((d) => (
        <path key={d} d={d} className="fill-leaf stroke-leaf" strokeWidth={draw ? 6 : 0} strokeLinejoin="round" />
      ))}
      <circle cx="183.15" cy="72.85" r="33" className="fill-accent-500" />
    </svg>
  );
}

export function Logo({ draw = false }: { draw?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark draw={draw} />
      <span className="display text-[21px] leading-none tracking-[-0.01em] text-foreground" style={{ fontWeight: 500 }}>
        Alan Joshua
      </span>
    </span>
  );
}
