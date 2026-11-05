import type { SpecimenKey } from "@/lib/specimens";

export const HF = "https://huggingface.co";
export const HF_ORG = `${HF}/CloveAI`;
export const LINKEDIN = "https://www.linkedin.com/in/alanjoshua2005/";

export type Model = {
  no: string;
  specimen: SpecimenKey;
  name: string;
  family: string;
  params: string;
  description: string;
  fields: [string, string][];
  tags: string[];
  updated: string;
};

// Facts come from each model's card and the Hugging Face API, checked 5 Nov 2026.
export const MODELS: Model[] = [
  {
    no: "01",
    specimen: "embed",
    name: "clov-embed-v2",
    family: "Text embedding",
    params: "34M",
    description:
      "A sentence embedding model trained from scratch: a 6-layer Transformer with RoPE positional embeddings, mean pooling and L2 normalization.",
    fields: [
      ["Output", "256 dimensions"],
      ["Throughput", "~247 sentences/sec on CPU"],
      ["Format", "PyTorch, ONNX FP32, ONNX INT8"],
    ],
    tags: ["sentence-transformers", "ONNX", "semantic-search", "retrieval"],
    updated: "13 Apr 2026",
  },
  {
    no: "02",
    specimen: "vision",
    name: "clov-vl-2b",
    family: "Vision language model",
    params: "2B",
    description:
      "Qwen2-VL 2B Instruct, fine-tuned with LoRA to answer natural language questions about charts and graphs.",
    fields: [
      ["Base", "Qwen2-VL 2B Instruct"],
      ["Method", "LoRA, r=8, with Unsloth"],
      ["Training data", "2,000 chart QA pairs"],
    ],
    tags: ["image-text-to-text", "qwen2-vl", "chart-qa", "lora", "unsloth"],
    updated: "6 Mar 2026",
  },
  {
    no: "03",
    specimen: "bio",
    name: "clov-bio-0.3b-instruct",
    family: "Biomedical LLM",
    params: "0.3B",
    description:
      "BioGPT, fine-tuned with LoRA for instruction-style questions and answers in the biomedical and healthcare domain.",
    fields: [
      ["Base", "microsoft/biogpt"],
      ["Method", "LoRA with PEFT"],
      ["Training data", "2,000 instruction pairs"],
    ],
    tags: ["biogpt", "biomedical", "instruction-tuned", "PEFT"],
    updated: "13 Apr 2026",
  },
  {
    no: "04",
    specimen: "web",
    name: "clov-web-1b-instruct",
    family: "Web text generation",
    params: "1B",
    description:
      "A 1B parameter LLaMA-based model fine-tuned on web data. It follows instructions and ships with a full chat template.",
    fields: [
      ["Base", "LLaMA-based"],
      ["Precision", "BF16"],
      ["Training data", "clov-web-synthetic"],
    ],
    tags: ["llama", "text-generation", "chat-template", "BF16"],
    updated: "10 Nov 2025",
  },
  {
    no: "05",
    specimen: "classifier",
    name: "AI-text-classifier",
    family: "AI content detection",
    params: "0.1B",
    description:
      "A RoBERTa classifier that estimates how likely a text is AI-generated rather than human-written. An ONNX build handles lightweight CPU inference.",
    fields: [
      ["Architecture", "RoBERTa, fine-tuned"],
      ["Output", "Probability of AI text"],
      ["Format", "PyTorch, ONNX"],
    ],
    tags: ["classification", "ONNX", "ai-detection"],
    updated: "20 Dec 2025",
  },
  {
    no: "06",
    specimen: "spam",
    name: "spam-sms-india",
    family: "SMS spam classifier",
    params: "0.1B",
    description:
      "Spam detection trained on India-specific SMS data: OTPs, bank alerts, promotional scams and delivery notices.",
    fields: [
      ["Labels", "Spam, ham"],
      ["Region", "India"],
      ["Format", "PyTorch, ONNX"],
    ],
    tags: ["classification", "spam-detection", "ONNX", "india"],
    updated: "29 Sep 2025",
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
