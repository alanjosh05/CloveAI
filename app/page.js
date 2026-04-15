// app/page.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Database,
  MessageSquare,
  FileText,
  Menu,
  X,
  Brain,
  Globe,
  Zap,
  Shield,
  Eye,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navCanvasRef = useRef(null);
  const footerCanvasRef = useRef(null);

  const drawCloverOnCanvas = (canvas, size, isNav = false) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    const centerX = size / 2, centerY = size / 2;
    const baseR = size * 0.42;
    const leafR = baseR * 0.5;
    const offsets = [
      [0, -leafR * 0.85],
      [leafR * 0.85, 0],
      [0, leafR * 0.85],
      [-leafR * 0.85, 0],
    ];

    if (!isNav) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
    }

    offsets.forEach(([dx, dy]) => {
      const x = centerX + dx, y = centerY + dy;
      const grad = ctx.createRadialGradient(x - leafR * 0.2, y - leafR * 0.2, leafR * 0.1, x, y, leafR);
      grad.addColorStop(0, "#8b5cf6");
      grad.addColorStop(1, "#6d28d9");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, leafR, 0, Math.PI * 2);
      ctx.fill();
    });

    const centerGrd = ctx.createRadialGradient(centerX - 2, centerY - 2, 2, centerX, centerY, leafR * 0.5);
    centerGrd.addColorStop(0, "#a78bfa");
    centerGrd.addColorStop(1, "#7c3aed");
    ctx.fillStyle = centerGrd;
    ctx.beginPath();
    ctx.arc(centerX, centerY, leafR * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY + baseR * 0.8);
    ctx.strokeStyle = "rgba(110, 60, 210, 0.3)";
    ctx.lineWidth = Math.max(1.2, size / 45);
    ctx.stroke();

    const suits = ["♠", "♥", "♦", "♣"];
    ctx.font = `500 ${Math.max(9, size / 12)}px "Segoe UI", system-ui`;
    ctx.fillStyle = "rgba(80, 50, 150, 0.5)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    offsets.forEach(([dx, dy], i) => {
      ctx.fillText(suits[i], centerX + dx, centerY + dy);
    });
    ctx.textAlign = "left";
  };

  useEffect(() => {
    if (navCanvasRef.current) drawCloverOnCanvas(navCanvasRef.current, 40, true);
    if (footerCanvasRef.current) drawCloverOnCanvas(footerCanvasRef.current, 32, true);
  }, []);

  const models = [
    {
      icon: <FileText className="w-5 h-5 text-indigo-600" />,
      title: "clov-embed-v2",
      subtitle: "Text Embedding",
      description:
        "34M parameter sentence embedding model trained from scratch. 6-layer Transformer with RoPE positional embeddings, 256-dim output, ONNX-optimized. ~247 sentences/sec on CPU.",
      tags: ["sentence-transformers", "ONNX", "semantic-search", "retrieval"],
      license: "MIT",
      params: "34M",
      color: "indigo",
      href: "https://huggingface.co/CloveAI/text-embed-v1",
      badge: "Updated 28d ago",
    },
    {
      icon: <Eye className="w-5 h-5 text-purple-600" />,
      title: "clov-vl-2b",
      subtitle: "Vision Language Model",
      description:
        "Qwen2-VL 2B Instruct fine-tuned on ChartQA via LoRA (r=8). Trained on 2,000 chart QA pairs to answer natural language questions about charts and graphs.",
      tags: ["image-text-to-text", "qwen2-vl", "chart-qa", "lora", "unsloth"],
      license: "MIT",
      params: "2B",
      color: "purple",
      href: "https://huggingface.co/CloveAI/alan-vlm",
      badge: "Updated Mar 6",
    },
    {
      icon: <Brain className="w-5 h-5 text-emerald-600" />,
      title: "clov-bio-0.3b-instruct",
      subtitle: "Biomedical LLM",
      description:
        "LoRA fine-tuned BioGPT specialized for instruction-style Q&A in the biomedical & healthcare domain. Trained on 2,000 medical instruction-response pairs.",
      tags: ["biogpt", "biomedical", "instruction-tuned", "PEFT"],
      license: "MIT",
      params: "0.3B",
      color: "emerald",
      href: "https://huggingface.co/CloveAI/biogpt-instruct",
      badge: "12 downloads",
    },
    {
      icon: <Globe className="w-5 h-5 text-blue-600" />,
      title: "clov-web-1b-instruct",
      subtitle: "Web Text Generation",
      description:
        "1B parameter LLaMA-based model fine-tuned on web data. Instruction-following with BF16 precision and full chat template support.",
      tags: ["llama", "text-generation", "chat-template", "BF16"],
      license: "MIT",
      params: "1B",
      color: "blue",
      href: "https://huggingface.co/CloveAI/LlamaWeb-instruct",
      badge: "Updated Nov 10",
    },
    {
      icon: <Shield className="w-5 h-5 text-rose-600" />,
      title: "AI-text-classifier",
      subtitle: "AI Content Detection",
      description:
        "0.1B classifier to distinguish AI-generated vs human-written text. Also available in ONNX format for fast, lightweight CPU inference.",
      tags: ["classification", "ONNX", "ai-detection"],
      license: "MIT",
      params: "0.1B",
      color: "rose",
      href: "https://huggingface.co/CloveAI/AI-text-classifier",
      badge: "Updated Dec 20",
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-600" />,
      title: "spam-sms-india",
      subtitle: "SMS Spam Classifier",
      description:
        "0.1B spam detection model trained on India-specific SMS data. Also available in ONNX for efficient deployment. Powers the india-spam-sms dataset.",
      tags: ["classification", "spam-detection", "ONNX", "india"],
      license: "MIT",
      params: "0.1B",
      color: "yellow",
      href: "https://huggingface.co/CloveAI/spam-sms-india",
      badge: "1 download",
    },
  ];

  const datasets = [
    {
      icon: <Database className="w-5 h-5 text-indigo-600" />,
      title: "LlamaWeb_synthetic_data",
      description:
        "1.5k synthetic instruction-response pairs generated for web-domain fine-tuning and alignment. Diverse domains, structured for LLaMA-style training.",
      tags: ["synthetic", "instruction-tuning", "web"],
      rows: "1.5k rows",
      license: "Open",
      href: "https://huggingface.co/datasets/CloveAI/LlamaWeb_synthetic_data",
      downloads: "4 downloads",
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-rose-600" />,
      title: "india-spam-sms",
      description:
        "20,000 India-specific SMS messages labeled as spam (1) or ham (0). Covers OTPs, bank alerts, promotional scams, delivery notifications, and personal messages.",
      tags: ["spam-detection", "NLP", "india", "classification"],
      rows: "20k rows",
      license: "MIT",
      href: "https://huggingface.co/datasets/CloveAI/india-spam-sms",
      downloads: "12 downloads",
    },
  ];

  const colorMap = {
    indigo: { bg: "bg-indigo-50", border: "border-indigo-100", badge: "bg-indigo-100 text-indigo-700" },
    purple: { bg: "bg-purple-50", border: "border-purple-100", badge: "bg-purple-100 text-purple-700" },
    emerald: { bg: "bg-emerald-50", border: "border-emerald-100", badge: "bg-emerald-100 text-emerald-700" },
    blue: { bg: "bg-blue-50", border: "border-blue-100", badge: "bg-blue-100 text-blue-700" },
    rose: { bg: "bg-rose-50", border: "border-rose-100", badge: "bg-rose-100 text-rose-700" },
    yellow: { bg: "bg-yellow-50", border: "border-yellow-100", badge: "bg-yellow-100 text-yellow-700" },
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <canvas ref={navCanvasRef} width="40" height="40" className="w-10 h-10 rounded-lg" />
              <span className="text-2xl font-serif font-semibold tracking-tight text-gray-900">CloveAI</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#models" className="text-gray-600 hover:text-indigo-600 transition">Models</a>
              <a href="#datasets" className="text-gray-600 hover:text-indigo-600 transition">Datasets</a>
              <a href="#docs" className="text-gray-600 hover:text-indigo-600 transition">Documentation</a>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://huggingface.co/CloveAI"
                target="blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition shadow-sm"
              >
                <span>Hugging Face</span>
                <span>🤗</span>
              </a>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-700">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
              <a href="#models" className="text-gray-600 hover:text-indigo-600 py-2">Models</a>
              <a href="#datasets" className="text-gray-600 hover:text-indigo-600 py-2">Datasets</a>
              <a href="#docs" className="text-gray-600 hover:text-indigo-600 py-2">Documentation</a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section — 100vh */}
      <section className="relative flex items-center overflow-hidden">

        <div className="relative z-10 mt-20 max-w-7xl mx-auto px-6 sm:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-10 items-center mb-24">
            <div className="space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-indigo-50 rounded-full px-4 py-1.5 text-sm font-medium text-indigo-700">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                AI research lab
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-gray-900 leading-tight">
                Build the future of{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Generative AI
                </span>{" "}
                with ClovAI.
              </h1>
              <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                Cutting‑edge text embedding models, chatbot architectures, and
                high‑fidelity synthetic datasets — open‑sourced on Hugging Face.
                
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#models"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition shadow-md flex items-center gap-2"
                >
                  Explore models <ArrowRight size={18} />
                </a>
                <a
                  href="https://huggingface.co/CloveAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border text-black border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 px-6 py-3 rounded-xl font-medium transition flex items-center gap-2"
                >
                  🤗 Hugging Face
                </a>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
              <Image
                src={"/hero1.png"}
                width={460}
                height={100}
                alt="asd"
              />

            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Models Section */}
        <section id="models" className="scroll-mt-15 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase bg-indigo-50 px-3 py-1 rounded-full">
              Model Hub
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mt-4 text-gray-900">
              State-of-the-art open models
            </h2>
            <p className="text-gray-500 mt-3">
              From sentence embeddings to vision-language models and biomedical LLMs — all MIT licensed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model, idx) => {
              const c = colorMap[model.color];
              return (
                <a
                  key={idx}
                  href={model.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
                >
                  <div className={`px-6 pt-6 pb-4 ${c.bg} border-b ${c.border}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">{model.icon}</div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{model.title}</div>
                          <div className="text-xs text-gray-500">{model.subtitle}</div>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>
                        {model.params}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-gray-600 text-sm leading-relaxed flex-1">{model.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {model.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-indigo-600 text-sm font-medium group-hover:underline">
                        View on HF →
                      </span>
                      <div className="flex items-center gap-2">
                        
                        <span className="text-xs text-gray-400">{model.license}</span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://huggingface.co/CloveAI/models"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:underline"
            >
              View all models on Hugging Face <ArrowRight size={16} />
            </a>
          </div>
        </section>


        {/* Datasets Section */}
        <section id="datasets" className="scroll-mt-20 pb-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full">
              Datasets
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mt-4 text-gray-900">
              High-quality open datasets
            </h2>
            <p className="text-gray-500 mt-3">
              Curated datasets for fine-tuning, alignment, and classification tasks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {datasets.map((ds, idx) => (
              <a
                key={idx}
                href={ds.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 p-8 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">{ds.icon}</div>
                  <div>
                    <div className="font-bold text-gray-900">{ds.title}</div>
                    <div className="text-xs text-gray-500">{ds.rows} · {ds.license}</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">{ds.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {ds.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-5 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-indigo-600 text-sm font-medium group-hover:underline">
                    Explore dataset →
                  </span>
                  
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Documentation Section */}
        <section id="docs" className="scroll-mt-20 mb-24 bg-gray-50 rounded-3xl p-6 md:p-10 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="lg:w-2/5">
              
              <h2 className="text-3xl font-serif font-bold mt-4 text-gray-900">
                Get started in minutes
              </h2>
              <p className="text-gray-600 mt-3 leading-relaxed">
                Use the ONNX-optimized embedding model for lightning-fast retrieval and RAG pipelines.
                Drop-in replacement with the sentence-transformers interface.
              </p>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  95 - 97% Confidence score
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  ~247 sentences/sec on CPU
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  256-dim output · bert-base-uncased tokenizer
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="https://huggingface.co/CloveAI/text-embed-v1" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-medium flex items-center gap-1 text-sm">
                  Model card <ArrowRight size={16} />
                </a>
                <a href="https://huggingface.co/CloveAI" target="_blank" rel="noopener noreferrer" className="text-gray-500 font-medium flex items-center gap-1 text-sm">
                  All models <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="lg:w-3/5 bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <div className="bg-gray-50 px-4 py-2 flex gap-2 items-center border-b border-gray-200">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-gray-600 text-xs ml-2 font-mono">clov_embed_usage.py</span>
              </div>
              <div className="p-5 font-mono text-sm text-gray-800 bg-white overflow-x-auto">
                <pre className="text-gray-800 text-xs leading-relaxed whitespace-pre-wrap">{`import onnxruntime as ort
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
print(emb.shape)  # (1, 256)`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="text-center py-16 rounded-3xl bg-gradient-to-r from-indigo-50 to-purple-50 mb-16 border border-indigo-100">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex justify-center mb-4">
              <span className="text-5xl">🤗</span>
            </div>
            <h2 className="text-3xl font-serif font-semibold text-gray-900">
              All models available on Hugging Face
            </h2>
            <p className="text-gray-600 mt-3">
              17 open models, 2 datasets, full model cards, and ONNX exports.
              Join the CloveAI community and push the boundaries of open AI.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="https://huggingface.co/CloveAI"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition"
              >
                Visit CloveAI on HF
              </a>
              <a
                href="https://huggingface.co/CloveAI/models"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Browse all models
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-100 pt-10 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <canvas ref={footerCanvasRef} width="32" height="32" className="w-8 h-8 rounded-md" />
              <span className="font-serif font-medium text-gray-900">CloveAI</span>
              <span className="text-xs text-gray-400 ml-1">© 2026 · Alan Joshua</span>
            </div>
            <div className="flex gap-6">
              <a href="https://huggingface.co/CloveAI" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 text-sm">Hugging Face</a>
              <a href="https://www.linkedin.com/in/alanjoshua2005/" target="_blank" className="text-gray-500 hover:text-indigo-600 text-sm">Linkedin</a>
            </div>
          </div>
        </footer>
      </main>

      <style jsx>{`
      @import url('https://fonts.googleapis.com/css2?family=Betania+Patmos&family=Playpen+Sans+Thai:wght@100..800&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
        .font-serif {
          font-family: 'Robot';
        }
      `}</style>
    </div>
  );
}
