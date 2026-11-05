import { ArrowUpRight } from "lucide-react";
import type { Link } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/** The site's signature: every piece of work carries a typed herbarium label. */
export function SpecimenLabel({
  rows,
  tags,
  links = [],
  className,
}: {
  rows: [string, string][];
  tags: string[];
  links?: Link[];
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-border bg-card", className)}>
      <dl className="meta grid grid-cols-[112px_1fr] gap-x-4 gap-y-2 p-4">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border px-4 py-3">
        <p className="meta text-muted-foreground">{tags.join(" · ")}</p>
        {links.length > 0 && (
          <div className="flex gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-sm text-sm font-medium whitespace-nowrap text-accent-600 outline-none transition-colors hover:text-accent-800 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {l.label}
                <ArrowUpRight className="size-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
