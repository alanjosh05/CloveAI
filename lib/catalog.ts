import type { SpecimenKey } from "@/lib/specimens";

export const HF = "https://huggingface.co";
export const HF_ORG = `${HF}/CloveAI`;
export const LINKEDIN = "https://www.linkedin.com/in/alanjoshua2005/";
export const GITHUB = "https://github.com/alanjosh05";
export const EMAIL = "a.alanjoshua2005@gmail.com";

export type Link = { href: string; label: string };

// Experience, skills and education come from Alan's resume.
export type Job = {
  no: string;
  specimen: SpecimenKey;
  org: string;
  title: string;
  body: string;
  rows: [string, string][];
  tags: string[];
};

export const EXPERIENCE: Job[] = [
  {
    no: "01",
    specimen: "invoice",
    org: "Nunnari Labs Pvt. Ltd.",
    title: "GenAI Intern at Nunnari Labs",
    body: "I built an AI document extraction pipeline that reads invoices and automates the end-to-end invoice flow for the company's AI services. I also designed and maintain the CI/CD pipelines on GCP that build, test and deploy those services, which cut deploy time from 20 minutes to 5.",
    rows: [
      ["Role", "GenAI Intern"],
      ["When", "Sep 2025 to present"],
    ],
    tags: ["document-extraction", "GCP", "CI/CD"],
  },
  {
    no: "02",
    specimen: "containers",
    org: "Freelance, shipping client",
    title: "An ERP for a shipping company",
    body: "I'm building the complete ERP system on AWS, with CI/CD deployment and AI automation for logistics workflows.",
    rows: [
      ["Role", "Freelance Software Engineer"],
      ["Status", "Active client"],
    ],
    tags: ["ERP", "AWS", "CI/CD", "AI-automation"],
  },
  {
    no: "03",
    specimen: "voice",
    org: "Freelance, CRM client",
    title: "A CRM with an AI voice agent",
    body: "I'm building a CRM on GCP. An AI voice agent calls customers for service intimation, WhatsApp handles messaging, and document extraction stores key-value fields in structured records.",
    rows: [
      ["Role", "Freelance Software Engineer"],
      ["Status", "Active client"],
    ],
    tags: ["CRM", "GCP", "voice-agent", "WhatsApp"],
  },
  {
    no: "04",
    specimen: "phone",
    org: "Freelance, both clients",
    title: "One Flutter app for both systems",
    body: "I built the internal mobile app used across the ERP and the CRM. It is company-internal and not publicly released.",
    rows: [
      ["Role", "Freelance Software Engineer"],
      ["Availability", "Internal only"],
    ],
    tags: ["Flutter", "mobile"],
  },
];

export type Project = {
  specimen: SpecimenKey;
  name: string;
  family: string;
  description: string;
  rows: [string, string][];
  tags: string[];
  links: Link[];
};

// Facts come from the resume and each model's card on Hugging Face.
export const PROJECTS: Project[] = [
  {
    specimen: "web",
    name: "Website generator",
    family: "clov-web-1b-instruct",
    description: "I fine-tuned Llama 3.2-1B Instruct to generate HTML and Tailwind websites from text prompts.",
    rows: [
      ["Base", "Llama 3.2-1B Instruct"],
      ["Method", "LoRA with Unsloth"],
      ["Training data", "1,500 synthetic examples"],
    ],
    tags: ["llama", "lora", "unsloth"],
    links: [
      { href: `${HF}/CloveAI/clov-web-1b-instruct`, label: "Model" },
      { href: `${HF}/datasets/CloveAI/clov-web-synthetic`, label: "Dataset" },
    ],
  },
  {
    specimen: "spam",
    name: "GPT-2 style spam classifier",
    family: "India-specific SMS",
    description: "I implemented a GPT-2 style transformer from scratch in TensorFlow to classify spam SMS.",
    rows: [
      ["Architecture", "GPT-2 style transformer"],
      ["Framework", "TensorFlow"],
      ["Training data", "20,010 SMS messages"],
    ],
    tags: ["from-scratch", "tensorflow", "india"],
    links: [{ href: `${HF}/datasets/CloveAI/india-spam-sms`, label: "Dataset" }],
  },
  {
    specimen: "vision",
    name: "clov-vl-2b",
    family: "Vision language model",
    description: "Qwen2-VL 2B Instruct, fine-tuned with LoRA to answer natural language questions about charts and graphs.",
    rows: [
      ["Base", "Qwen2-VL 2B Instruct"],
      ["Method", "LoRA, r=8, with Unsloth"],
      ["Training data", "2,000 chart QA pairs"],
    ],
    tags: ["image-text-to-text", "chart-qa", "lora"],
    links: [{ href: `${HF}/CloveAI/clov-vl-2b`, label: "Model" }],
  },
  {
    specimen: "bio",
    name: "clov-bio-0.3b-instruct",
    family: "Biomedical LLM",
    description: "BioGPT, fine-tuned with LoRA for instruction-style questions and answers in the biomedical and healthcare domain.",
    rows: [
      ["Base", "microsoft/biogpt"],
      ["Method", "LoRA with PEFT"],
      ["Training data", "2,000 instruction pairs"],
    ],
    tags: ["biogpt", "biomedical", "PEFT"],
    links: [{ href: `${HF}/CloveAI/clov-bio-0.3b-instruct`, label: "Model" }],
  },
  {
    specimen: "classifier",
    name: "AI-text-classifier",
    family: "AI content detection",
    description: "A RoBERTa classifier that estimates how likely a text is AI-generated. An ONNX build handles lightweight CPU inference.",
    rows: [
      ["Architecture", "RoBERTa, fine-tuned"],
      ["Output", "Probability of AI text"],
      ["Format", "PyTorch, ONNX"],
    ],
    tags: ["classification", "ONNX", "ai-detection"],
    links: [{ href: `${HF}/CloveAI/AI-text-classifier`, label: "Model" }],
  },
];

export const SKILLS: [string, string[]][] = [
  ["GenAI", ["LLM fine-tuning (LoRA, Unsloth)", "RAG", "LangChain", "FAISS", "MCP", "Voice agents", "WhatsApp automation", "Document extraction"]],
  ["Evaluation", ["LLM benchmarking", "Embedding-model evaluation", "Test automation in CI/CD"]],
  ["Machine learning", ["PyTorch", "TensorFlow", "ONNX", "YOLOv11", "Scikit-learn", "Pandas", "NumPy"]],
  ["Cloud and delivery", ["AWS", "GCP", "CI/CD", "PostgreSQL", "SQLite", "Supabase"]],
  ["Languages and web", ["Python", "SQL", "JavaScript", "HTML/CSS", "Flutter", "Next.js", "Tailwind CSS", "FastAPI", "Flask"]],
];

export const EDUCATION = [
  {
    degree: "B.Tech, Computer Science and Business Systems",
    school: "Dr. N.G.P. Institute of Technology",
    when: "2023 to 2027",
    note: "CGPA 8.4/10, currently in 7th semester",
  },
  {
    degree: "B.S., Data Science and Applications",
    school: "Indian Institute of Technology, Madras",
    when: "Foundation level completed",
    note: "",
  },
];

export type IndexRow = {
  id: string;
  task: string;
  format: string;
  license: string;
  updated: string;
};

// All 17 public models under CloveAI, from the Hugging Face API.
export const ALL_MODELS: IndexRow[] = [
  { id: "clov-embed-v2", task: "Text embedding", format: "PyTorch, ONNX", license: "MIT", updated: "2026-04-13" },
  { id: "clov-bio-0.3b-instruct", task: "Biomedical LLM", format: "LoRA", license: "MIT", updated: "2026-04-13" },
  { id: "clov-vl-2b", task: "Vision language", format: "LoRA", license: "MIT", updated: "2026-03-06" },
  { id: "AI-text-classifier", task: "AI text detection", format: "PyTorch", license: "MIT", updated: "2025-12-20" },
  { id: "clov-text-classifier-onnx", task: "AI text detection", format: "ONNX", license: "MIT", updated: "2025-12-20" },
  { id: "clov-web-1b-instruct", task: "Text generation", format: "PyTorch", license: "MIT", updated: "2025-11-10" },
  { id: "LlamaWeb", task: "Text generation", format: "PyTorch", license: "Not set", updated: "2025-11-07" },
  { id: "web", task: "Text generation", format: "PyTorch", license: "Not set", updated: "2025-11-07" },
  { id: "spam-sms-india-onnx", task: "SMS spam", format: "ONNX", license: "MIT", updated: "2025-10-01" },
  { id: "spam-sms-india", task: "SMS spam", format: "PyTorch", license: "MIT", updated: "2025-09-29" },
  { id: "Bert-sms-spam-detector", task: "SMS spam", format: "PyTorch", license: "MIT", updated: "2025-09-29" },
  { id: "Bert-sms-spam-detector-onnx", task: "SMS spam", format: "ONNX", license: "MIT", updated: "2025-09-29" },
  { id: "alan-spam", task: "SMS spam", format: "PyTorch", license: "MIT", updated: "2025-09-29" },
  { id: "mini-project-onnx", task: "SMS spam", format: "ONNX", license: "MIT", updated: "2025-09-29" },
  { id: "bert-sms-detector-onnx", task: "SMS spam", format: "ONNX", license: "MIT", updated: "2025-09-28" },
  { id: "bert-sms-detector", task: "SMS spam", format: "PyTorch", license: "MIT", updated: "2025-09-27" },
  { id: "clov-medchat", task: "Medical chat", format: "PyTorch", license: "Not set", updated: "2025-09-26" },
];

export type Dataset = {
  id: string;
  rows: number;
  license: string;
  description: string;
  tags: string[];
};

export const DATASETS: Dataset[] = [
  {
    id: "india-spam-sms",
    rows: 20010,
    license: "MIT",
    description:
      "India-specific SMS messages labeled spam or ham. Covers OTPs, bank alerts, promotional scams, delivery notifications and personal messages.",
    tags: ["spam-detection", "NLP", "india", "classification"],
  },
  {
    id: "clov-web-synthetic",
    rows: 1500,
    license: "MIT",
    description:
      "Synthetic instruction-response pairs for web-domain fine-tuning, structured for LLaMA-style training.",
    tags: ["synthetic", "instruction-tuning", "web"],
  },
];
