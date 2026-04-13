// app/page.jsx
"use client";

import { useEffect, useRef } from "react";
import {
  ArrowRight,
  BookOpen,
  Database,
  Github,
  Heart,
  MessageSquare,
  Sparkles,
  FileText,
  Code2,
  LayoutGrid,
  Star,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroCanvasRef = useRef(null);
  const navCanvasRef = useRef(null);
  const footerCanvasRef = useRef(null);

  // Draw clover logo on canvas
  const drawCloverOnCanvas = (canvas, size, isNav = false) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    const centerX = size / 2,
      centerY = size / 2;
    const baseR = size * 0.42;
    const leafR = baseR * 0.5;
    const offsets = [
      [0, -leafR * 0.85],
      [leafR * 0.85, 0],
      [0, leafR * 0.85],
      [-leafR * 0.85, 0],
    ];

    if (!isNav) {
      const bgGrd = ctx.createLinearGradient(0, 0, size, size);
      bgGrd.addColorStop(0, "#f1ebff");
      bgGrd.addColorStop(1, "#e9e2fc");
      ctx.fillStyle = bgGrd;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
    }

    offsets.forEach(([dx, dy]) => {
      const x = centerX + dx,
        y = centerY + dy;
      const grad = ctx.createRadialGradient(
        x - leafR * 0.2,
        y - leafR * 0.2,
        leafR * 0.1,
        x,
        y,
        leafR
      );
      grad.addColorStop(0, "#b794f4");
      grad.addColorStop(1, "#7c3aed");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, leafR, 0, Math.PI * 2);
      ctx.fill();
    });

    const centerGrd = ctx.createRadialGradient(
      centerX - 2,
      centerY - 2,
      2,
      centerX,
      centerY,
      leafR * 0.5
    );
    centerGrd.addColorStop(0, "#c4b5fd");
    centerGrd.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = centerGrd;
    ctx.beginPath();
    ctx.arc(centerX, centerY, leafR * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY + baseR * 0.8);
    ctx.strokeStyle = "rgba(110, 60, 210, 0.4)";
    ctx.lineWidth = Math.max(1.2, size / 45);
    ctx.stroke();

    const suits = ["♠", "♥", "♦", "♣"];
    ctx.font = `500 ${Math.max(9, size / 12)}px "Segoe UI", system-ui`;
    ctx.fillStyle = "rgba(80, 50, 150, 0.65)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    offsets.forEach(([dx, dy], i) => {
      ctx.fillText(suits[i], centerX + dx, centerY + dy);
    });
    ctx.textAlign = "left";
  };

  useEffect(() => {
    if (heroCanvasRef.current) {
      drawCloverOnCanvas(heroCanvasRef.current, 260, false);
    }
    if (navCanvasRef.current) {
      drawCloverOnCanvas(navCanvasRef.current, 40, true);
    }
    if (footerCanvasRef.current) {
      drawCloverOnCanvas(footerCanvasRef.current, 32, true);
    }
  }, []);

  const models = [
    {
      icon: <FileText className="w-6 h-6 text-indigo-600" />,
      title: "ClovAI-embed-v1",
      description: "High‑density text embedding (768d) · MTEB top‑10 performance",
      tags: ["sentence-transformers", "multilingual"],
      license: "Apache 2.0",
      color: "indigo",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-purple-600" />,
      title: "ClovAI-Chat-7B",
      description: "Instruction‑tuned chatbot with 8k context · tool use & function calling",
      tags: ["transformers", "chat template"],
      license: "CC BY‑NC 4.0",
      color: "purple",
    },
    {
      icon: <Database className="w-6 h-6 text-emerald-600" />,
      title: "SynthClovAI‑1M",
      description: "1M synthetic instruction‑response pairs for alignment & fine‑tuning",
      tags: ["synthetic", "diverse domains"],
      license: "ODC‑BY",
      color: "emerald",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <canvas
                ref={navCanvasRef}
                width="40"
                height="40"
                className="w-10 h-10 rounded-lg shadow-sm"
              />
              <span className="text-2xl font-serif font-semibold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ClovAI
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#models" className="text-gray-600 hover:text-indigo-600 transition">
                Models
              </a>
              <a href="#docs" className="text-gray-600 hover:text-indigo-600 transition">
                Documentation
              </a>
              <a href="#synthetic" className="text-gray-600 hover:text-indigo-600 transition">
                Synthetic Data
              </a>
              <a href="#research" className="text-gray-600 hover:text-indigo-600 transition">
                Research
              </a>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://huggingface.co/ClovAI"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition shadow-sm"
              >
                <span>Hugging Face</span>
                <span>🤗</span>
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-700"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
              <a href="#models" className="text-gray-600 hover:text-indigo-600 py-2">
                Models
              </a>
              <a href="#docs" className="text-gray-600 hover:text-indigo-600 py-2">
                Documentation
              </a>
              <a href="#synthetic" className="text-gray-600 hover:text-indigo-600 py-2">
                Synthetic Data
              </a>
              <a href="#research" className="text-gray-600 hover:text-indigo-600 py-2">
                Research
              </a>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-indigo-50/70 rounded-full px-4 py-1.5 text-sm font-medium text-indigo-700 border border-indigo-100">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              AI research lab
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-gray-900 leading-tight">
              Build the future of{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                generative AI
              </span>{" "}
              with ClovAI.
            </h1>
            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              Cutting‑edge text embedding models, chatbot architectures, and
              high‑fidelity synthetic datasets — open‑sourced on Hugging Face.
              Designed for researchers, by researchers.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#models"
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition shadow-md flex items-center gap-2"
              >
                Explore models <ArrowRight size={18} />
              </a>
              <a
                href="https://huggingface.co/ClovAI"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/20 px-6 py-3 rounded-xl font-medium transition flex items-center gap-2"
              >
                🤗 Hugging Face
              </a>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-3xl bg-gradient-to-br from-indigo-100/50 to-purple-100/50 flex items-center justify-center shadow-2xl backdrop-blur-sm">
              <canvas
                ref={heroCanvasRef}
                width="260"
                height="260"
                className="w-64 h-64 lg:w-80 lg:h-80"
              />
            </div>
          </div>
        </div>

        {/* Models Section */}
        <section id="models" className="scroll-mt-20 mb-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase bg-indigo-50 px-3 py-1 rounded-full">
              Model Hub
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mt-4 text-gray-900">
              State‑of‑the‑art embedding & conversational AI
            </h2>
            <p className="text-gray-500 mt-3">
              Fine‑tuned for retrieval, RAG, and low‑latency inference.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {models.map((model, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-${model.color}-100 flex items-center justify-center mb-4`}
                >
                  {model.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{model.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{model.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {model.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-5 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <a href="#" className="text-indigo-600 text-sm font-medium hover:underline">
                    Docs →
                  </a>
                  <span className="text-xs text-gray-400">{model.license}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Documentation Section */}
        <section id="docs" className="scroll-mt-20 mb-28 bg-white/40 rounded-3xl p-6 md:p-10 border border-indigo-50 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="lg:w-2/5">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-xs font-semibold">
                <BookOpen size={14} /> DOCUMENTATION
              </div>
              <h2 className="text-3xl font-serif font-bold mt-4 text-gray-900">
                Designed for seamless integration
              </h2>
              <p className="text-gray-600 mt-3 leading-relaxed">
                Get started in minutes with Python APIs, inference snippets, and fine‑tuning
                guides. Full reference for embedding models, chatbot deployment, and synthetic
                dataset curation.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="#" className="text-indigo-700 font-medium flex items-center gap-1">
                  Quickstart guide <ArrowRight size={16} />
                </a>
                <a href="#" className="text-gray-500 font-medium flex items-center gap-1">
                  API reference <ArrowRight size={16} />
                </a>
              </div>
            </div>
            <div className="lg:w-3/5 bg-[#0c0c14] rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-[#1e1e2a] px-4 py-2 flex gap-2 items-center border-b border-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-gray-400 text-xs ml-2 font-mono">embedding_usage.py</span>
              </div>
              <div className="p-5 font-mono text-sm text-gray-200 overflow-x-auto">
                <pre className="text-gray-200">
                  {`from sentence_transformers import SentenceTransformer
model = SentenceTransformer("ClovAI/clovai-embed-v1")
embeddings = model.encode([
    "Semantic search with ClovAI",
    "Retrieval augmented generation"
])
print(embeddings.shape)  # (2, 768)`}
                </pre>
                <pre className="text-gray-200 mt-4 border-t border-gray-700 pt-4">
                  {`from transformers import AutoModelForCausalLM, AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("ClovAI/clovai-chat-7B")
model = AutoModelForCausalLM.from_pretrained("ClovAI/clovai-chat-7B")
messages = [{"role": "user", "content": "Explain RAG"}]
response = model.chat(tokenizer, messages)`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Synthetic & Research Grid */}
        <div className="grid md:grid-cols-2 gap-10 mb-28">
          <div
            id="synthetic"
            className="scroll-mt-20 bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl p-7 border border-indigo-100 shadow-sm hover:shadow-md transition"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-5">
              <Sparkles className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Synthetic data engine</h3>
            <p className="text-gray-600 mt-2">
              Generate high‑quality, controllable synthetic datasets for fine‑tuning,
              preference alignment, and low‑resource tasks. Our pipeline ensures diversity,
              factual consistency, and privacy‑safe generation.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="bg-white/70 border border-indigo-200 px-3 py-1 rounded-full text-sm">
                20+ domains
              </span>
              <span className="bg-white/70 border border-indigo-200 px-3 py-1 rounded-full text-sm">
                customizable schemas
              </span>
            </div>
            <a href="#" className="inline-block mt-6 text-indigo-600 font-medium">
              Explore synthetic datasets →
            </a>
          </div>

          <div
            id="research"
            className="scroll-mt-20 bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-5">
              <Star className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Research & benchmarks</h3>
            <p className="text-gray-600 mt-2">
              ClovAI embedding models achieve state‑of‑the‑art on BEIR and MTEB. Our chatbot
              surpasses comparable 7B models on multi‑turn reasoning. Pre‑print and evaluation
              suites available.
            </p>
            <div className="mt-4 flex items-center gap-3 text-sm">
              <span className="bg-gray-100 px-2 py-1 rounded">📈 MTEB avg 62.3</span>
              <span className="bg-gray-100 px-2 py-1 rounded">🏆 Chatbot Arena style</span>
            </div>
            <a href="#" className="inline-block mt-6 text-purple-600 font-medium">
              Read technical report →
            </a>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-12 rounded-3xl bg-gray-900 text-white mb-12">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex justify-center mb-4">
              <span className="text-5xl">🤗</span>
            </div>
            <h2 className="text-3xl font-serif font-semibold">All models available on Hugging Face</h2>
            <p className="text-gray-300 mt-3">
              Open weights, model cards, and demo spaces. Join the ClovAI community and push the
              boundaries of open AI.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <a
                href="https://huggingface.co/ClovAI"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
              >
                Visit ClovAI HF Org
              </a>
              <a
                href="#"
                className="border border-gray-500 px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition"
              >
                Request model access
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-12 pb-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <canvas ref={footerCanvasRef} width="32" height="32" className="w-8 h-8 rounded-md" />
              <span className="font-serif font-medium text-gray-800">ClovAI</span>
              <span className="text-xs text-gray-400 ml-1">© 2026 Research Lab</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">
                Citation
              </a>
              <a
                href="https://github.com/ClovAI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 text-sm flex items-center gap-1"
              >
                <Github size={14} /> GitHub
              </a>
            </div>
          </div>
        </footer>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .font-serif {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>
    </div>
  );
}