import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const instrument = Instrument_Sans({ variable: "--font-instrument", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  axes: ["opsz"],
});

const description =
  "clov-embed-v2 is a 34M parameter sentence embedding model trained from scratch by Alan Joshua. CloveAI also publishes a chart-reading vision model, a biomedical LLM, classifiers and open datasets on Hugging Face.";

export const metadata: Metadata = {
  metadataBase: new URL("https://clove-ai-sooty.vercel.app"),
  title: "CloveAI, home of clov-embed-v2 by Alan Joshua",
  description,
  keywords:
    "AI, machine learning, text embedding, vision language model, biomedical LLM, open source, Hugging Face, ONNX, sentence-transformers",
  authors: [{ name: "Alan Joshua", url: "https://huggingface.co/CloveAI" }],
  creator: "Alan Joshua",
  publisher: "CloveAI",
  category: "technology",
  openGraph: {
    title: "CloveAI, home of clov-embed-v2 by Alan Joshua",
    description,
    images: [{ url: "/brand/icon-512.png", width: 512, height: 512, alt: "CloveAI" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${jetbrains.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <TooltipProvider delayDuration={120}>{children}</TooltipProvider>
        <Analytics />
      </body>
    </html>
  );
}
