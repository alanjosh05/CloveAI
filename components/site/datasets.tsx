"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DATASETS, HF } from "@/lib/catalog";
import { SPAM_LABELS_B64 } from "@/lib/spam-labels";
import { Reveal } from "./reveal";
import { SpecimenLabel } from "./specimen-label";

const PITCH = 3;
const DOT = 2;
const INK = "rgba(29,58,44,0.62)";
const CINNABAR = "#b8431f";

type Row = { i: number; text: string; label?: number } | { i: number; error: true } | null;

function decodeBits(b64: string) {
  const bin = atob(b64);
  return (i: number) => (bin.charCodeAt(i >> 3) >> (i & 7)) & 1;
}

async function fetchRow(id: string, i: number): Promise<{ text: string; label?: number }> {
  const url = `https://datasets-server.huggingface.co/rows?dataset=CloveAI/${id}&config=default&split=train&offset=${i}&length=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(String(res.status));
  const json = await res.json();
  const row = json.rows[0].row;
  return { text: row.text ?? row.instruction, label: row.label };
}

/** Every row drawn as one dot at the same scale, so the two datasets compare honestly. */
function RowField({
  id,
  rows,
  isSpam,
  fixedCols,
  onPick,
}: {
  id: string;
  rows: number;
  isSpam?: (i: number) => number;
  fixedCols?: number;
  onPick: (i: number) => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const shape = useRef({ cols: 1, rowsTall: 1 });
  const hover = useRef(-1);
  const progress = useRef(0);
  const [height, setHeight] = useState(0);

  const draw = useCallback(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = c.width / Math.max(1, c.clientWidth);
    const { cols } = shape.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
    const upto = Math.floor(rows * progress.current);
    for (const tone of [0, 1]) {
      ctx.fillStyle = tone ? CINNABAR : INK;
      for (let i = 0; i < upto; i++) {
        if ((isSpam ? isSpam(i) : 0) !== tone) continue;
        ctx.fillRect((i % cols) * PITCH, Math.floor(i / cols) * PITCH, DOT, DOT);
      }
    }
    if (hover.current >= 0) {
      const i = hover.current;
      ctx.strokeStyle = "#17211b";
      ctx.lineWidth = 1;
      ctx.strokeRect((i % cols) * PITCH - 2.5, Math.floor(i / cols) * PITCH - 2.5, DOT + 5, DOT + 5);
    }
  }, [rows, isSpam]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => {
      const cols = fixedCols ?? Math.max(1, Math.floor(el.clientWidth / PITCH));
      const tall = Math.ceil(rows / cols);
      shape.current = { cols, rowsTall: tall };
      const h = tall * PITCH;
      setHeight(h);
      const c = canvas.current!;
      const w = cols * PITCH;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      draw();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [rows, fixedCols, draw]);

  // The rows are laid down once when the plate scrolls into view.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (reduced) {
          progress.current = 1;
          draw();
          return;
        }
        animate(progress, { current: [0, 1], duration: 1400, ease: "inOut(2)", onUpdate: draw });
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [draw]);

  const indexAt = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.floor((e.clientY - r.top) / PITCH) * shape.current.cols + Math.floor((e.clientX - r.left) / PITCH);
    return i >= 0 && i < rows ? i : -1;
  };

  return (
    <div ref={wrap} style={{ minHeight: height }}>
      <canvas
        ref={canvas}
        role="img"
        aria-label={`${rows.toLocaleString("en-US")} rows of ${id}, one dot per row`}
        className="block cursor-crosshair touch-pan-y"
        onPointerMove={(e) => {
          const i = indexAt(e);
          if (i === hover.current) return;
          hover.current = i;
          draw();
          if (i >= 0) onPick(i);
        }}
        onPointerLeave={() => {
          hover.current = -1;
          draw();
        }}
        onClick={(e) => {
          const i = indexAt(e);
          if (i >= 0) onPick(i);
        }}
      />
    </div>
  );
}

function usePicker(id: string) {
  const [row, setRow] = useState<Row>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latest = useRef(-1);
  const pick = useCallback(
    (i: number) => {
      latest.current = i;
      clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        try {
          const r = await fetchRow(id, i);
          if (latest.current === i) setRow({ i, ...r });
        } catch {
          if (latest.current === i) setRow({ i, error: true });
        }
      }, 140);
    },
    [id],
  );
  return [row, pick] as const;
}

function RowReadout({ row, hint, dataset, onRandom }: { row: Row; hint: string; dataset: string; onRandom: () => void }) {
  return (
    <div className="mt-4 flex min-h-20 items-start justify-between gap-4 border-t border-border pt-3" aria-live="polite">
      <div className="min-w-0">
        {row === null && <p className="text-muted-foreground">{hint}</p>}
        {row && "error" in row && (
          <p className="text-muted-foreground">
            Row {row.i.toLocaleString("en-US")} could not be loaded from Hugging Face.
          </p>
        )}
        {row && "text" in row && (
          <>
            <p className="meta text-muted-foreground">
              {dataset}, row {row.i.toLocaleString("en-US")}
              {row.label !== undefined && (row.label ? ", spam" : ", ham")}
            </p>
            <p className="mt-1 line-clamp-2 break-words">{row.text}</p>
          </>
        )}
      </div>
      <Button variant="ghost" size="sm" className="shrink-0" onClick={onRandom} aria-label={`Read a random row from ${dataset}`}>
        <Shuffle data-icon="inline-start" strokeWidth={1.5} />
        Random row
      </Button>
    </div>
  );
}

export function Datasets() {
  const [spam, web] = DATASETS;
  const [isSpam] = useState(() => decodeBits(SPAM_LABELS_B64));
  const [spamRow, pickSpam] = usePicker(spam.id);
  const [webRow, pickWeb] = usePicker(web.id);

  return (
    <section id="datasets" className="mx-auto w-full max-w-[1440px] scroll-mt-16 px-6 pt-24 lg:px-10 lg:pt-32">
      <Reveal className="max-w-[44rem]">
        <h2 className="display text-[32px] leading-[1.1] md:text-[40px]">Datasets I published, every row on the page</h2>
        <p className="mt-4 max-w-[34rem] text-[18px] leading-[28px] text-muted-foreground">
          One dot per row, at the same scale. Point at any dot to read that row, fetched live from Hugging Face.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-8">
          <h3 className="display text-[28px] leading-[1.15]">{spam.id}</h3>
          <p className="mt-2 max-w-[34rem] text-muted-foreground">{spam.description}</p>
          <p className="meta mt-4 flex flex-wrap gap-x-4 gap-y-1 pb-3">
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-[1px] bg-leaf/60" /> 14,059 ham
            </span>
            <span className="inline-flex items-center gap-2 text-accent-600">
              <span className="size-2 rounded-[1px] bg-accent-500" /> 5,951 spam, 29.7%
            </span>
          </p>
          <RowField id={spam.id} rows={spam.rows} isSpam={isSpam} onPick={pickSpam} />
          <RowReadout
            row={spamRow}
            dataset={spam.id}
            hint="Point at a dot to read that message"
            onRandom={() => pickSpam(Math.floor(Math.random() * spam.rows))}
          />
          <SpecimenLabel
            className="mt-4"
            links={[{ href: `${HF}/datasets/CloveAI/${spam.id}`, label: "Explore dataset" }]}
            rows={[
              ["Rows", spam.rows.toLocaleString("en-US")],
              ["License", spam.license],
            ]}
            tags={spam.tags}
          />
        </div>

        <div className="min-w-0 lg:col-span-4">
          <h3 className="display text-[28px] leading-[1.15]">{web.id}</h3>
          <p className="mt-2 text-muted-foreground">{web.description}</p>
          <p className="meta mt-4 pb-3 text-muted-foreground">1,500 pairs, drawn to the same scale</p>
          <RowField id={web.id} rows={web.rows} fixedCols={40} onPick={pickWeb} />
          <RowReadout
            row={webRow}
            dataset={web.id}
            hint="Point at a dot to read that instruction"
            onRandom={() => pickWeb(Math.floor(Math.random() * web.rows))}
          />
          <SpecimenLabel
            className="mt-4"
            links={[{ href: `${HF}/datasets/CloveAI/${web.id}`, label: "Explore dataset" }]}
            rows={[
              ["Rows", web.rows.toLocaleString("en-US")],
              ["License", web.license],
            ]}
            tags={web.tags}
          />
        </div>
      </div>
    </section>
  );
}
