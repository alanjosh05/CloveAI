"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EMAIL } from "@/lib/catalog";
import { LazySpecimen } from "./lazy-canvas";
import { Reveal } from "./reveal";

gsap.registerPlugin(ScrollTrigger);

const NOW: [string, string][] = [
  ["Now", "Freelance engineer, 2 active clients"],
  ["Studying", "B.Tech CSBS, 2027, and B.S. Data Science, IIT Madras"],
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [scatter] = useState(() => ({ current: 0 }));

  // Scrolling away scatters the mark like seed.
  useGSAP(
    () => {
      gsap.to(scatter, {
        current: 1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 30%", scrub: 0.6 },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative w-full px-6 lg:px-10 min-[1920px]:px-16">
      <div className="grid grid-cols-1 lg:min-h-[calc(100svh-65px)] lg:grid-cols-12 lg:gap-8">
        <Reveal className="z-10 flex flex-col justify-center pt-12 pb-8 lg:col-span-6 lg:pt-0 lg:pb-16">
          <p className="meta text-muted-foreground">Coimbatore, India</p>
          <h1 className="display mt-4 text-[56px] leading-[1.02] tracking-[-0.03em] text-foreground md:text-[80px] xl:text-[104px] min-[1920px]:text-[136px]">
            Alan Joshua
          </h1>
          <p className="display mt-3 text-[28px] leading-[1.15] text-foreground md:text-[36px] min-[1920px]:text-[44px]">
            I build and evaluate AI systems
          </p>
          <p className="mt-6 max-w-[34rem] text-[18px] leading-[28px] text-muted-foreground min-[1920px]:max-w-[40rem] min-[1920px]:text-[20px] min-[1920px]:leading-[32px]">
            I build ERP and CRM systems with AI automation for freelance clients on AWS and GCP, and I trained my own
            embedding model, clov-embed-v2, from scratch.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="xl">
              <a href="#work">
                See my work
                <ArrowRight data-icon="inline-end" strokeWidth={1.5} />
              </a>
            </Button>
            <Button asChild size="xl" variant="outline" className="bg-transparent">
              <a href={`mailto:${EMAIL}`}>Email me</a>
            </Button>
          </div>
          <dl className="meta mt-10 grid max-w-[34rem] grid-cols-[72px_1fr] gap-x-4 gap-y-2 border-t border-border pt-4">
            {NOW.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="relative min-h-[480px] overflow-hidden border-b border-border lg:col-span-6 lg:min-h-0">
          <div className="absolute inset-0 lg:right-[18%] lg:bottom-[8%]">
            <LazySpecimen
              specimen="mark"
              showNotes={false}
              label="Alan's AJ logo drawn in ink dots. Drag to turn it."
              scatter={scatter}
            />
          </div>
          <Image
            src="/hero1.png"
            alt="Portrait of Alan Joshua"
            width={650}
            height={782}
            priority
            sizes="(min-width: 1920px) 620px, (min-width: 1280px) 440px, (min-width: 1024px) 320px, 260px"
            className="pointer-events-none absolute right-0 bottom-0 h-auto w-[260px] grayscale-[0.9] contrast-[1.04] md:w-[320px] xl:w-[440px] min-[1920px]:w-[620px]"
          />
          <p className="meta absolute bottom-4 left-0 hidden max-w-[28%] text-muted-foreground md:block">Drag the mark to turn it</p>
        </div>
      </div>
    </section>
  );
}
