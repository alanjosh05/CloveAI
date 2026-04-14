import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CloveAI",
  description: "Open-source AI models including text embeddings, vision-language models, biomedical LLMs, and high-quality datasets. MIT licensed and ready for production.",
  keywords: "AI, machine learning, text embedding, vision language model, biomedical LLM, open source, Hugging Face, ONNX, sentence-transformers",
  authors: [{ name: "Alan Joshua", url: "https://huggingface.co/CloveAI" }],
  creator: "Alan Joshua",
  publisher: "CloveAI",
  category: "technology",
  icons: {
    icon: '/logo.png', // points to public/custom-icon.png
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}