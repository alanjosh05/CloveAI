"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HF } from "@/lib/catalog";
import type { SpecimenKey } from "@/lib/specimens";
import { LazySpecimen } from "./lazy-canvas";
import { Reveal } from "./reveal";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [scatter] = useState(() => ({ current: 0 }));
  const [specimen, setSpecimen] = useState<SpecimenKey>("clover");

  // The mark opens into the model it stands for.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setSpecimen("embed"), reduced ? 0 : 2200);
    return () => clearTimeout(t);
  }, []);

  // Scrolling away lets the clover go to seed.
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
    <section ref={root} id="top" className="relative mx-auto w-full max-w-[1440px] px-6 lg:px-10">
      <div className="grid grid-cols-1 lg:min-h-[calc(100svh-65px)] lg:grid-cols-12 lg:gap-8">
        <Reveal className="z-10 flex flex-col justify-center pt-12 pb-4 lg:col-span-5 lg:pt-0 lg:pb-16">
          <p className="meta text-muted-foreground">Text embedding, 34M parameters, MIT</p>
          <h1 className="display mt-4 text-[44px] leading-[1.04] tracking-[-0.03em] break-words text-foreground md:text-[64px] xl:text-[76px]">
            clov-embed-v2
          </h1>
          <p className="display mt-3 max-w-[20ch] text-[28px] leading-[1.15] text-foreground md:text-[36px]">
            A sentence embedding model trained from scratch
          </p>
          <p className="mt-6 max-w-[34rem] text-[18px] leading-[28px] text-muted-foreground">
            A 6-layer Transformer with RoPE that turns text into 256-dimensional vectors at ~247 sentences/sec on a CPU.
            Trained and published by Alan Joshua.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="xl">
              <a href="#docs">
                Get the code
                <ArrowRight data-icon="inline-end" strokeWidth={1.5} />
              </a>
            </Button>
            <Button asChild size="xl" variant="outline" className="bg-transparent">
              <a href={`${HF}/CloveAI/clov-embed-v2`} target="_blank" rel="noopener noreferrer">
                Model card
                <ArrowUpRight data-icon="inline-end" strokeWidth={1.5} />
              </a>
            </Button>
          </div>
        </Reveal>

        <div className="relative min-h-[480px] overflow-hidden border-b border-border lg:col-span-7 lg:min-h-0">
          <div className="absolute inset-0 lg:right-[10%] lg:bottom-[6%]">
            <LazySpecimen
              specimen={specimen}
              label="Illustration of clov-embed-v2: sentences as ink dots clustered on a sphere. Drag to turn it."
              scatter={scatter}
            />
          </div>
          <Image
            src="/hero1.png"
            alt="Alan Joshua"
            width={650}
            height={782}
            priority
            sizes="(min-width: 1024px) 340px, 200px"
            className="pointer-events-none absolute right-0 bottom-0 h-auto w-[176px] grayscale-[0.9] contrast-[1.04] md:w-[240px] xl:w-[300px]"
          />
          <p className="meta absolute bottom-4 left-0 max-w-[50%] text-muted-foreground">Fig. 1, illustration of vectors on a sphere. Drag to turn</p>
        </div>
      </div>
    </section>
  );
}
