import { EXPERIENCE } from "@/lib/catalog";
import { Reveal } from "./reveal";

export function Experience() {
  return (
    <section id="experience" className="mx-auto w-full max-w-[1440px] scroll-mt-16 px-6 pt-24 lg:px-10 lg:pt-32">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <h2 className="display text-[32px] leading-[1.1] md:text-[40px]">Experience</h2>
        </Reveal>
        <div className="flex flex-col gap-8 lg:col-span-9">
          {EXPERIENCE.map((e) => (
            <Reveal key={e.company} className="flex flex-col justify-between gap-x-8 gap-y-2 border-t border-border pt-5 md:flex-row">
              <div>
                <h3 className="display text-[22px] leading-[1.3] tracking-[-0.01em] md:text-[26px]">{e.role}</h3>
                <p className="mt-1 text-muted-foreground">{e.company}</p>
              </div>
              <p className="meta shrink-0 pt-1 text-muted-foreground md:text-right">{e.when}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
