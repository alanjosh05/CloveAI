import type { Metadata, Viewport } from "next";
import { Instrument_Sans, JetBrains_Mono, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_URL } from "@/lib/catalog";
import "./globals.css";

const instrument = Instrument_Sans({ variable: "--font-instrument", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  axes: ["opsz"],
});

const title = "Alan Joshua | AI Engineer in Coimbatore, India";
const description =
  "Alan Joshua is an AI engineer in Coimbatore, India, building ERP and CRM systems with AI automation and clov-embed-v2, an embedding model trained from scratch.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: "Alan Joshua",
  alternates: { canonical: "/" },
  authors: [{ name: "Alan Joshua", url: SITE_URL }],
  creator: "Alan Joshua",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: "Alan Joshua",
    locale: "en_IN",
    title,
    description,
    firstName: "Alan",
    lastName: "Joshua",
  },
  twitter: { card: "summary_large_image", title, description },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export const viewport: Viewport = { themeColor: "#f5f1e8" };

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
