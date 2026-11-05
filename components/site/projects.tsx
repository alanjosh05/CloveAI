"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PROJECTS } from "@/lib/catalog";
import { LazySpecimen } from "./lazy-canvas";
import { Reveal } from "./reveal";
import { SpecimenLabel } from "./specimen-label";

export function Projects() {
  const [open, setOpen] = useState(PROJECTS[0].name);
  const project = PROJECTS.find((p) => p.name === open) ?? PROJECTS[0];

  return (
    <section id="projects" className="w-full scroll-mt-16 px-6 pt-24 lg:px-10 min-[1920px]:px-16 lg:pt-32">
      <Reveal className="max-w-[44rem]">
        <h2 className="display text-[40px] leading-[1.08] md:text-[56px]">More models I&apos;ve trained</h2>
        <p className="mt-4 max-w-[34rem] text-[18px] leading-[28px] text-muted-foreground">
          I publish these under the name CloveAI on Hugging Face. Open one, and the plate redraws to show what it does.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="sticky top-16 z-20 -mx-6 h-[36svh] border-b border-border bg-background px-6 lg:top-24 lg:col-span-7 lg:mx-0 lg:h-[600px] min-[1920px]:h-[800px] lg:self-start lg:border-0 lg:px-0">
          <div className="relative size-full">
            <LazySpecimen specimen={project.specimen} label={`Plate for ${project.name}. Drag to turn it.`} />
          </div>
        </div>

        <Accordion
          type="single"
          value={open}
          onValueChange={(v) => v && setOpen(v)}
          className="min-w-0 border-t border-border lg:col-span-5"
        >
          {PROJECTS.map((p) => (
            <AccordionItem key={p.name} value={p.name}>
              <AccordionTrigger className="py-4 hover:no-underline">
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="meta font-normal text-muted-foreground">{p.family}</span>
                  <span className="display text-[24px] leading-[1.2] break-words">{p.name}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="max-w-[34rem] text-[15px] text-muted-foreground">{p.description}</p>
                <SpecimenLabel className="mt-4" rows={p.rows} tags={p.tags} links={p.links} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
