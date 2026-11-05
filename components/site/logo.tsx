"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, svg } from "animejs";
import { cn } from "@/lib/utils";

// The AJ ligature: one stem shared by both letters, with the A's leg and the J's hook meeting at a dot.
const MASTER = {
  d: "M192 16H197V172C197 220 163 243 121 243V230C145 230 163 212 163 172V146H116.94L88.08 196H73.08L177 16H192ZM163 66.23 123.87 134H163V66.23Z",
  cx: 77.58,
  cy: 217,
  r: 19,
};
// A heavier cut for anything under about 64px, where the master's thin leg would fade.
const SMALL = {
  d: "M197 16V172C197 220 163 243 121 243V226C145 226 157 212 157 172V152H118.48L96.54 190H74.54L157 47.18L175 16H197ZM128.87 134H157V85.28L128.87 134Z",
  cx: 82.54,
  cy: 219,
  r: 24,
};

export function LogoMark({
  className,
  draw = false,
  small = false,
}: {
  className?: string;
  draw?: boolean;
  small?: boolean;
}) {
  const root = useRef<SVGSVGElement>(null);
  const cut = small ? SMALL : MASTER;

  useEffect(() => {
    const el = root.current;
    if (!draw || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = el.querySelectorAll<SVGPathElement>("path");
    const dot = el.querySelector("circle");
    const drawn = svg.createDrawable(letters);
    const anims = [
      animate(drawn, { draw: ["0 0", "0 1"], duration: 900, delay: stagger(110), ease: "inOut(3)" }),
      animate(letters, { fillOpacity: [0, 1], duration: 420, delay: 560, ease: "out(3)" }),
      animate(dot!, { r: [0, cut.r], duration: 460, delay: 860, ease: "out(4)" }),
    ];
    return () => anims.forEach((a) => a.revert());
  }, [draw, cut.r]);

  return (
    <svg ref={root} viewBox="50 8 156 240" aria-hidden className={cn("h-7 w-auto shrink-0", className)}>
      <path d={cut.d} className="fill-foreground stroke-foreground" strokeWidth={draw ? 4 : 0} strokeLinejoin="round" />
      <circle cx={cut.cx} cy={cut.cy} r={cut.r} className="fill-accent-500" />
    </svg>
  );
}

export function Logo({ draw = false }: { draw?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark draw={draw} small />
      <span className="display text-[21px] leading-none tracking-[-0.01em] text-foreground" style={{ fontWeight: 500 }}>
        Alan Joshua
      </span>
    </span>
  );
}
