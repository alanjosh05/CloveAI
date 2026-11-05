import { EXPERIENCE } from "@/lib/catalog";
import { LazySpecimen } from "./lazy-canvas";
import { Reveal } from "./reveal";
import { SpecimenLabel } from "./specimen-label";

export function Experience() {
  return (
    <section id="experience" className="mx-auto w-full max-w-[1440px] scroll-mt-16 px-6 pt-24 lg:px-10 lg:pt-32">
      <Reveal>
        <h2 className="display text-[40px] leading-[1.08] md:text-[56px]">Experience</h2>
      </Reveal>
      {EXPERIENCE.map((job) => (
        <div key={job.no} className="mt-8 grid grid-cols-1 items-center gap-8 border-t border-border pt-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="meta text-muted-foreground">{job.org}</p>
            <h3 className="display mt-2 text-[32px] leading-[1.1] md:text-[40px]">{job.title}</h3>
            <p className="mt-4 max-w-[34rem] text-muted-foreground">{job.body}</p>
            <SpecimenLabel className="mt-6 max-w-[28rem]" rows={job.rows} tags={job.tags} />
          </Reveal>
          <div className="relative h-[360px] lg:col-span-7 lg:h-[520px]">
            <LazySpecimen specimen={job.specimen} label={`Plate: ${job.title}. Drag to turn it.`} />
          </div>
        </div>
      ))}
    </section>
  );
}
