"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BUILDING, type Job } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { LazySpecimen } from "./lazy-canvas";
import { Reveal } from "./reveal";
import { SpecimenLabel } from "./specimen-label";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

function Entry({ job, active, register }: { job: Job; active: boolean; register: (el: HTMLElement | null) => void }) {
  return (
    <article
      ref={register}
      className="flex min-h-[60svh] scroll-mt-[46svh] flex-col justify-center border-t border-border py-12 lg:min-h-[72svh] lg:scroll-mt-24"
    >
      <div className={cn("transition-opacity duration-300", active ? "opacity-100" : "lg:opacity-40")}>
        <p className="meta text-muted-foreground">{job.org}</p>
        <h3 className="display mt-2 text-[32px] leading-[1.1] md:text-[40px]">{job.title}</h3>
        <p className="mt-4 max-w-[34rem] text-muted-foreground">{job.body}</p>
        <SpecimenLabel className="mt-6 max-w-[28rem]" rows={job.rows} tags={job.tags} />
      </div>
    </article>
  );
}

export function Building() {
  const root = useRef<HTMLElement>(null);
  const entries = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const job = BUILDING[active];

  useGSAP(
    () => {
      entries.current.forEach((el, i) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" className="w-full scroll-mt-16 px-6 pt-24 pb-24 lg:px-10 min-[1920px]:px-16 lg:pt-32 lg:pb-32">
      <Reveal className="max-w-[44rem]">
        <h2 className="display text-[40px] leading-[1.08] md:text-[56px]">What I&apos;m building now</h2>
        <p className="mt-4 max-w-[34rem] text-[18px] leading-[28px] text-muted-foreground">
          Two freelance clients and one app shared between them. Scroll, and the plate redraws itself for each one.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 lg:mt-16 lg:grid-cols-12 lg:gap-8">
        <div className="sticky top-16 z-20 -mx-6 h-[42svh] border-b border-border bg-background px-6 lg:top-20 lg:order-2 lg:col-span-7 lg:mx-0 lg:h-[calc(100svh-96px)] lg:border-0 lg:px-0">
          <div className="relative size-full">
            <LazySpecimen specimen={job.specimen} label={`Plate ${job.no}: ${job.title}. Drag to turn it.`} />
            <div className="pointer-events-none absolute inset-x-0 top-3 flex items-start justify-between gap-4">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={job.no}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease }}
                  className="meta min-w-0 truncate pt-2 text-muted-foreground"
                >
                  Plate {job.no}, {job.org}
                </motion.p>
              </AnimatePresence>
              <div className="pointer-events-auto flex" role="group" aria-label="Choose a piece of work">
                {BUILDING.map((j, i) => (
                  <Tooltip key={j.no}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label={j.title}
                        aria-current={i === active}
                        onClick={() => entries.current[i]?.scrollIntoView({ block: "start" })}
                        className={cn(
                          "meta relative flex size-8 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                          i === active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {i === active && (
                          <motion.span
                            layoutId="plate-rail"
                            className="absolute inset-x-1.5 bottom-0.5 h-0.5 bg-accent-500"
                            transition={{ duration: 0.3, ease }}
                          />
                        )}
                        {j.no}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{j.title}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:order-1 lg:col-span-5">
          {BUILDING.map((j, i) => (
            <Entry
              key={j.no}
              job={j}
              active={i === active}
              register={(el) => {
                entries.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
