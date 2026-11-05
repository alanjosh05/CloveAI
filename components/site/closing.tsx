import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HF_ORG, LINKEDIN } from "@/lib/catalog";
import { Logo, LogoMark } from "./logo";
import { Reveal } from "./reveal";

export function Closing() {
  return (
    <>
      <section className="mx-auto w-full max-w-[1440px] px-6 py-24 lg:px-10 lg:py-32">
        <Reveal className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <h2 className="display max-w-[16ch] text-[44px] leading-[1.04] tracking-[-0.03em] md:text-[72px]">
              All models available on Hugging Face
            </h2>
            <p className="mt-6 max-w-[34rem] text-[18px] leading-[28px] text-muted-foreground">
              17 open models, 2 datasets, full model cards and ONNX exports, all under the CloveAI organization.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="xl">
                <a href={HF_ORG} target="_blank" rel="noopener noreferrer">
                  Visit CloveAI on Hugging Face
                  <ArrowUpRight data-icon="inline-end" strokeWidth={1.5} />
                </a>
              </Button>
              <Button asChild size="xl" variant="outline" className="bg-transparent">
                <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                  Talk to Alan on LinkedIn
                </a>
              </Button>
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
          <div className="flex items-center gap-4">
            <Logo />
            <span className="meta text-muted-foreground">© 2026 Alan Joshua</span>
          </div>
          <div className="flex gap-6">
            <a href={HF_ORG} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
              Hugging Face
            </a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
