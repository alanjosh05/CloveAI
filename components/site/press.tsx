"use client";

import { useEffect, useRef } from "react";

type Figure = {
  name: string;
  means: string;
  range: [number, number, number];
  mount: (
    host: { stage: HTMLElement; svg: SVGSVGElement; read: { textContent: string } },
    value: number,
  ) => { set: (v: number) => void; destroy: () => void };
};

declare global {
  interface Window {
    hairline?: (figure: Figure) => void;
    HL?: {
      inject: (root: Document) => void;
      mk: (tag: string, attrs: Record<string, string>, parent: Element) => SVGSVGElement;
    };
  }
}

let figure: Promise<Figure> | undefined;

// The engine and the figure are plain scripts in public/hairline, loaded once and only in the browser.
function loadFigure() {
  figure ??= new Promise<Figure>((resolve) => {
    window.hairline = resolve;
    const add = (src: string, onload?: () => void) => {
      const el = document.createElement("script");
      el.src = src;
      el.onload = onload ?? null;
      document.body.appendChild(el);
    };
    add("/hairline/kernel.js", () => add("/hairline/press.js"));
  });
  return figure;
}

/** The plant press from Skills. Reports which sheet the pointer is on, or "rest". */
export function Press({ onRead, className }: { onRead: (text: string) => void; className?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const report = useRef(onRead);

  useEffect(() => {
    report.current = onRead;
  }, [onRead]);

  useEffect(() => {
    let done = false;
    let teardown = () => {};
    loadFigure().then((fig) => {
      const el = stage.current;
      if (done || !el || !window.HL) return;
      window.HL.inject(document);
      el.setAttribute("aria-label", fig.means);
      const svg = window.HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, el);
      const read = {
        set textContent(text: string) {
          report.current(text);
        },
      } as { textContent: string };
      const handle = fig.mount({ stage: el, svg, read }, fig.range[1]);
      teardown = () => {
        handle.destroy();
        svg.remove();
      };
    });
    return () => {
      done = true;
      teardown();
    };
  }, []);

  return <div ref={stage} data-hairline="press" role="img" className={className} />;
}
