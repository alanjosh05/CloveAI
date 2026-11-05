"use client";

import { useState } from "react";
import { EDUCATION, SKILLS } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { Press } from "./press";
import { Reveal } from "./reveal";

// Each sheet's name in the press, top sheet first, in the same order as SKILLS.
const SHEETS = ["genai", "evals", "ml", "cloud", "web"];

export function Skills() {
  const [read, setRead] = useState("rest");
  const active = SHEETS.indexOf(read.split(" ")[0]);

  return (
    <section id="skills" className="w-full scroll-mt-16 px-6 pt-24 lg:px-10 min-[1920px]:px-16 lg:pt-32">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <h2 className="display text-[40px] leading-[1.08] md:text-[56px]">Skills</h2>
          <p className="mt-4 max-w-[28rem] text-[18px] leading-[28px] text-muted-foreground">
            Five groups, kept in a plant press. Point at a sheet to pull it out.
          </p>
        </Reveal>
        <Press onRead={setRead} className="mx-auto w-full max-w-[420px] min-[1920px]:max-w-[600px] lg:col-span-5 lg:col-start-8" />
      </div>
      <dl className="mt-8 border-b border-border">
        {SKILLS.map(([group, items], i) => (
          <Reveal key={group} className="grid grid-cols-1 gap-2 border-t border-border py-5 lg:grid-cols-12 lg:gap-8">
            <dt className={cn("transition-colors duration-150 lg:col-span-3", i === active ? "text-accent-600" : "text-muted-foreground")}>{group}</dt>
            <dd
              className={cn(
                "display text-[22px] leading-[1.3] tracking-[-0.01em] transition-colors duration-150 md:text-[26px] lg:col-span-9",
                active >= 0 && i !== active && "text-muted-foreground",
              )}
            >
              {items.join(", ")}
            </dd>
          </Reveal>
        ))}
      </dl>

    </section>
  );
}

export function Education() {
  return (
    <section id="education" className="w-full scroll-mt-16 px-6 pt-24 lg:px-10 min-[1920px]:px-16 lg:pt-32">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <h2 className="display text-[32px] leading-[1.1] md:text-[40px]">Education</h2>
        </Reveal>
        <div className="flex flex-col gap-8 lg:col-span-9">
          {EDUCATION.map((e) => (
            <Reveal key={e.degree} className="flex flex-col justify-between gap-x-8 gap-y-2 border-t border-border pt-5 md:flex-row">
              <div>
                <h3 className="display text-[22px] leading-[1.3] tracking-[-0.01em] md:text-[26px]">{e.degree}</h3>
                <p className="mt-1 text-muted-foreground">{e.school}</p>
              </div>
              <p className="meta shrink-0 pt-1 text-muted-foreground md:text-right">
                {e.when}
                {e.note && (
                  <>
                    <br />
                    {e.note}
                  </>
                )}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
