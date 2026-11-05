import { ArrowUpRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { EMAIL, GITHUB, HF_ORG, LINKEDIN } from "@/lib/catalog";
import { Logo, LogoMark } from "./logo";
import { Reveal } from "./reveal";

const LINKS = [
  { href: LINKEDIN, label: "LinkedIn" },
  { href: GITHUB, label: "GitHub" },
  { href: HF_ORG, label: "Hugging Face" },
];

export function Closing() {
  return (
    <>
      <section id="contact" className="mx-auto w-full max-w-[1440px] scroll-mt-16 px-6 py-24 lg:px-10 lg:py-32">
        <Reveal className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-8">
            <h2 className="display text-[44px] leading-[1.04] tracking-[-0.03em] md:text-[72px]">Get in touch</h2>
            <a
              href={`mailto:${EMAIL}`}
              className="display mt-6 inline-block rounded-sm text-[22px] leading-[1.2] break-all text-accent-600 underline-offset-4 outline-none transition-colors hover:text-accent-800 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 md:text-[36px]"
            >
              {EMAIL}
            </a>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                  <ArrowUpRight className="size-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
          <div className="hidden justify-end lg:col-span-4 lg:flex">
            <LogoMark className="size-56" />
          </div>
        </Reveal>
      </section>
      <footer className="mx-auto w-full max-w-[1440px] px-6 pb-8 lg:px-10">
        <Separator />
        <div className="flex flex-col justify-between gap-4 pt-6 md:flex-row md:items-center">
          <Logo />
          <span className="meta text-muted-foreground">© 2026 Alan Joshua. Models published as CloveAI</span>
        </div>
      </footer>
    </>
  );
}
