"use client";

import { useMemo, useState } from "react";
import type { SortDescriptor } from "react-aria-components";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@/components/base/table/table";
import { ALL_MODELS, HF, HF_ORG, type IndexRow } from "@/lib/catalog";
import { Reveal } from "./reveal";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

const COLUMNS: { id: keyof IndexRow; label: string; hideOnMobile?: boolean }[] = [
  { id: "id", label: "Model" },
  { id: "task", label: "Task", hideOnMobile: true },
  { id: "format", label: "Format", hideOnMobile: true },
  { id: "license", label: "License", hideOnMobile: true },
  { id: "updated", label: "Updated" },
];

export function ModelIndex() {
  const [sort, setSort] = useState<SortDescriptor>({ column: "updated", direction: "descending" });

  const rows = useMemo(() => {
    const key = sort.column as keyof IndexRow;
    const dir = sort.direction === "ascending" ? 1 : -1;
    return [...ALL_MODELS].sort((a, b) => a[key].localeCompare(b[key]) * dir);
  }, [sort]);

  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 pt-24 lg:px-10">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="display text-[32px] leading-[1.1] md:text-[40px]">The full collection, 17 models</h2>
        <a
          href={`${HF_ORG}/models`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent-600 transition-colors hover:text-accent-800"
        >
          View all models on Hugging Face
          <ArrowUpRight className="size-4" strokeWidth={1.5} />
        </a>
      </Reveal>
      <div className="mt-8">
        <Table aria-label="All CloveAI models" size="sm" sortDescriptor={sort} onSortChange={setSort}>
          <TableHeader>
            {COLUMNS.map((c, i) => (
              <TableColumn
                key={c.id}
                id={c.id}
                isRowHeader={i === 0}
                allowsSorting
                className={c.hideOnMobile ? "max-md:hidden" : undefined}
              >
                {({ sortDirection }) => (
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    {sortDirection === "ascending" && <ChevronUp className="size-3.5" strokeWidth={1.5} />}
                    {sortDirection === "descending" && <ChevronDown className="size-3.5" strokeWidth={1.5} />}
                  </span>
                )}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody items={rows}>
            {(r) => (
              <TableRow id={r.id}>
                <TableCell>
                  <a
                    href={`${HF}/CloveAI/${r.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meta text-foreground underline-offset-4 hover:underline"
                  >
                    {r.id}
                  </a>
                </TableCell>
                <TableCell className="max-md:hidden">{r.task}</TableCell>
                <TableCell className="max-md:hidden">{r.format}</TableCell>
                <TableCell className="max-md:hidden">{r.license}</TableCell>
                <TableCell className="meta whitespace-nowrap">{formatDate(r.updated)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
