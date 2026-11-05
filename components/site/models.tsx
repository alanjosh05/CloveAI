"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HF, MODELS, type Model } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { LazySpecimen } from "./lazy-canvas";
import { Reveal } from "./reveal";
import { SpecimenLabel } from "./specimen-label";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

function Entry({ model, active, register }: { model: Model; active: boolean; register: (el: HTMLElement | null) => void }) {
  return (
    <article
      ref={register}
      data-model
      className="flex min-h-[64svh] scroll-mt-[46svh] flex-col justify-center border-t border-border py-12 lg:min-h-[78svh] lg:scroll-mt-24"
    >
      <div className={cn("transition-opacity duration-300", active ? "opacity-100" : "lg:opacity-40")}>
        <p className="meta text-muted-foreground">
          No. {model.no}, {model.family}
        </p>
        <h3 className="display mt-2 text-[32px] leading-[1.1] break-words md:text-[40px]">{model.name}</h3>
        <p className="mt-4 max-w-[34rem] text-muted-foreground">{model.description}</p>
        <SpecimenLabel
          className="mt-6 max-w-[28rem]"
          href={`${HF}/CloveAI/${model.name}`}
          linkLabel="Model card"
          rows={[["Parameters", model.params], ...model.fields, ["License", "MIT"], ["Updated", model.updated]]}
          tags={model.tags}
        />
      </div>
    </article>
  );
}

// clov-embed-v2 has the hero and its own section, so the plates start at No. 02.
const REST = MODELS.slice(1);

export function Models() {
  const root = useRef<HTMLElement>(null);
  const entries = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const model = REST[active];

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
    <section ref={root} id="models" className="mx-auto w-full max-w-[1440px] scroll-mt-16 px-6 pt-24 lg:px-10 lg:pt-32">
      <Reveal className="max-w-[44rem]">
        <h2 className="display text-[40px] leading-[1.08] md:text-[56px]">Five more from the collection</h2>
        <p className="mt-4 max-w-[34rem] text-[18px] leading-[28px] text-muted-foreground">
          Vision-language models, a biomedical LLM and classifiers, each one MIT licensed. Scroll, and the plate redraws
          itself to show what the model does.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 lg:mt-16 lg:grid-cols-12 lg:gap-8">
        <div className="sticky top-16 z-20 -mx-6 h-[42svh] border-b border-border bg-background px-6 lg:order-2 lg:col-span-7 lg:mx-0 lg:h-[calc(100svh-96px)] lg:border-0 lg:px-0 lg:top-20">
          <div className="relative size-full">
            <LazySpecimen specimen={model.specimen} label={`Plate ${model.no}, ${model.family}: ${model.name}. Drag to turn it.`} />
            <div className="pointer-events-none absolute inset-x-0 top-3 flex items-start justify-between gap-4">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={model.no}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease }}
                  className="meta min-w-0 truncate pt-2 text-muted-foreground"
                >
                  Plate {model.no}, {model.name}
                </motion.p>
              </AnimatePresence>
              <div className="pointer-events-auto flex" role="group" aria-label="Choose a model">
                {REST.map((m, i) => (
                  <Tooltip key={m.no}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label={m.name}
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
                        {m.no}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{m.name}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:order-1 lg:col-span-5">
          {REST.map((m, i) => (
            <Entry
              key={m.no}
              model={m}
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

