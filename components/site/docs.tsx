"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HF, HF_ORG } from "@/lib/catalog";
import { Reveal } from "./reveal";

const CODE = `import onnxruntime as ort
import numpy as np
from transformers import AutoTokenizer
from huggingface_hub import hf_hub_download

tokenizer = AutoTokenizer.from_pretrained(
    "CloveAI/clov-embed-v2",
    subfolder="tokenizer"
)
onnx_path = hf_hub_download(
    "CloveAI/clov-embed-v2",
    "onnx/biencoder_rope.onnx"
)
session = ort.InferenceSession(
    onnx_path,
    providers=["CPUExecutionProvider"]
)

def encode(texts):
    if isinstance(texts, str): texts = [texts]
    enc = tokenizer(
        texts, padding=True,
        truncation=True, max_length=256,
        return_tensors="np"
    )
    return session.run(
        ["embeddings"],
        {"input_ids": enc["input_ids"],
         "attention_mask": enc["attention_mask"]}
    )[0]

emb = encode("Hello world!")
print(emb.shape)  # (1, 256)`;

const TOKEN = /(#.*$)|("[^"]*")|\b(import|from|as|def|return|if|for|in|True|False|None)\b/gm;

function highlight(src: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of src.matchAll(TOKEN)) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const cls = m[1] ? "tok-c" : m[2] ? "tok-s" : "tok-k";
    out.push(
      <span key={m.index} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  out.push(src.slice(last));
  return out;
}

const FACTS: { value: number; prefix?: string; suffix?: string; decimals?: number; label: string }[] = [
  { value: 247, prefix: "~", label: "sentences/sec on CPU" },
  { value: 256, label: "dimension output" },
  { value: 34.6, decimals: 1, suffix: " MB", label: "INT8 ONNX, recommended for CPU" },
];

const SPECS = [
  ["Parameters", "34M"],
  ["Encoder", "6-layer Transformer"],
  ["Positions", "RoPE"],
  ["Pooling", "Mean, L2 normalized"],
  ["Tokenizer", "bert-base-uncased"],
  ["License", "MIT"],
];

const CURRICULUM = [
  ["1", "all-nli", "MNRLoss"],
  ["2", "squad", "MNRLoss"],
  ["3", "msmarco-bm25", "HardNegativeLoss"],
  ["4", "natural-questions", "MNRLoss"],
];

const FILES = [
  ["tokenizer/", "bert-base-uncased tokenizer"],
  ["pytorch/checkpoint_phase4_nq.pt", "PyTorch weights"],
  ["onnx/biencoder_rope.onnx", "ONNX FP32, 134.3 MB"],
  ["onnx/biencoder_rope_int8.onnx", "ONNX INT8, 34.6 MB"],
];

function Fact({ fact }: { fact: (typeof FACTS)[number] }) {
  const el = useRef<HTMLSpanElement>(null);
  const fmt = (v: number) => `${fact.prefix ?? ""}${v.toFixed(fact.decimals ?? 0)}${fact.suffix ?? ""}`;

  useEffect(() => {
    const node = el.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const counter = { v: 0 };
        animate(counter, {
          v: fact.value,
          duration: 900,
          ease: "out(3)",
          onUpdate: () => {
            node.textContent = fmt(counter.v);
          },
        });
      },
      { threshold: 0.6 },
    );
    io.observe(node);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-white/10 py-3">
      <span ref={el} className="display text-[32px] leading-none tabular-nums">
        {fmt(fact.value)}
      </span>
      <span className="text-right text-[#a9b4aa]">{fact.label}</span>
    </div>
  );
}

const panelTrigger =
  "h-8 flex-none rounded-md border-0 px-3 font-mono text-xs text-[#a9b4aa] hover:text-[#f5f1e8] data-[state=active]:bg-white/10 data-[state=active]:text-[#f5f1e8] data-[state=active]:shadow-none";

export function Docs() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section id="clov-embed-v2" className="scroll-mt-16 bg-code text-[#f5f1e8]">
      <div className="w-full px-6 py-24 lg:px-10 min-[1920px]:px-16 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <p className="meta text-[#a9b4aa]">Featured project</p>
            <h2 className="display mt-4 text-[40px] leading-[1.08] break-words md:text-[56px]">clov-embed-v2</h2>
            <p className="display mt-2 text-[24px] leading-[1.2] md:text-[28px]">My own embedding model, trained from scratch</p>
            <p className="mt-4 max-w-[30rem] text-[18px] leading-[28px] text-[#c8cfc7]">
              I built the 6-layer RoPE encoder in PyTorch and benchmarked its FP32 and INT8 ONNX exports, taking it from
              134.3 MB to 34.6 MB. It runs for retrieval and RAG with a tokenizer, one ONNX file and no GPU.
            </p>
            <div className="mt-8 max-w-[30rem] border-b border-white/10">
              {FACTS.map((f) => (
                <Fact key={f.label} fact={f} />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="xl" className="bg-[#f5f1e8] text-[#17211b] hover:bg-[#e3dccd]">
                <a href={`${HF}/CloveAI/clov-embed-v2`} target="_blank" rel="noopener noreferrer">
                  Model card
                  <ArrowUpRight data-icon="inline-end" strokeWidth={1.5} />
                </a>
              </Button>
              <Button asChild size="xl" variant="ghost" className="text-[#f5f1e8] hover:bg-white/10 hover:text-[#f5f1e8]">
                <a href={HF_ORG} target="_blank" rel="noopener noreferrer">
                  All models
                  <ArrowUpRight data-icon="inline-end" strokeWidth={1.5} />
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal className="min-w-0 lg:col-span-7" delay={0.06}>
            <Tabs defaultValue="usage" className="gap-0 overflow-hidden rounded-2xl border border-white/10 bg-[#1e2a23]">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 p-2">
                <TabsList className="h-auto gap-1 bg-transparent p-0">
                  <TabsTrigger value="usage" className={panelTrigger}>
                    clov_embed_usage.py
                  </TabsTrigger>
                  <TabsTrigger value="files" className={panelTrigger}>
                    Files
                  </TabsTrigger>
                </TabsList>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copy}
                      aria-label="Copy code"
                      className="text-[#a9b4aa] hover:bg-white/10 hover:text-[#f5f1e8]"
                    >
                      {copied ? <Check strokeWidth={1.5} /> : <Copy strokeWidth={1.5} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{copied ? "Copied" : "Copy code"}</TooltipContent>
                </Tooltip>
              </div>
              <TabsContent value="usage" className="min-h-[640px] overflow-x-auto p-5 md:p-6">
                <pre className="font-mono text-[13px] leading-[20px]">
                  <code>{highlight(CODE)}</code>
                </pre>
              </TabsContent>
              <TabsContent value="files" className="min-h-[640px] p-5 md:p-6">
                <ul className="font-mono text-[13px]">
                  {FILES.map(([f, d]) => (
                    <li key={f} className="flex flex-col gap-1 border-b border-white/10 py-3 first:pt-0 sm:flex-row sm:justify-between sm:gap-4">
                      <span className="break-all">{f}</span>
                      <span className="whitespace-nowrap text-[#a9b4aa]">{d}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </Reveal>
        </div>

        <Reveal className="mt-16 grid grid-cols-1 gap-12 border-t border-white/10 pt-12 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h3 className="display text-[28px] leading-[1.15]">How it is built</h3>
            <dl className="meta mt-6 grid max-w-[30rem] grid-cols-[112px_1fr] gap-x-4 gap-y-2">
              {SPECS.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-[#a9b4aa]">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="min-w-0 lg:col-span-7">
            <h3 className="display text-[28px] leading-[1.15]">Trained from scratch in four phases</h3>
            <ol className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
              {CURRICULUM.map(([p, d, l]) => (
                <li key={p} className="flex flex-col gap-6 bg-code p-4">
                  <span className="meta text-[#a9b4aa]">Phase {p}</span>
                  <span className="meta">
                    {d}
                    <br />
                    <span className="text-[#a9b4aa]">{l}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
