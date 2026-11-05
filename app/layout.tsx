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

const title = "Alan Joshua, builds and evaluates AI systems";
const description =
  "Alan Joshua is a computer science student in Coimbatore who builds and evaluates AI systems: document extraction at Nunnari Labs, ERP and CRM systems with AI automation, and clov-embed-v2, an embedding model trained from scratch.";

export const metadata: Metadata = {
  metadataBase: new URL("https://clove-ai-research.vercel.app"),
  title,
  description,
  keywords:
    "Alan Joshua, portfolio, GenAI engineer, document extraction, LLM fine-tuning, text embedding, ONNX, Hugging Face, Coimbatore",
  authors: [{ name: "Alan Joshua", url: "https://github.com/alanjosh05" }],
  creator: "Alan Joshua",
  category: "technology",
  openGraph: {
    title,
    description,
    images: [{ url: "/brand/icon-512.png", width: 512, height: 512, alt: "Alan Joshua's AJ logo" }],
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
