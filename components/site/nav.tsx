"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "./logo";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#clov-embed-v2", label: "clov-embed-v2" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const hairline = useTransform(scrollY, [0, 40], [0, 1]);

  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-10">
        <a href="#top" aria-label="Alan Joshua, back to top" className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <Logo draw />
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="lg" className="hidden px-3.5 sm:inline-flex">
            <a href="#contact">Get in touch</a>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" className="md:hidden" aria-label="Open menu">
                <Menu strokeWidth={1.5} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex h-11 items-center rounded-lg px-2 text-[15px] transition-colors hover:bg-muted"
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="flex h-11 items-center rounded-lg px-2 text-[15px] transition-colors hover:bg-muted"
                >
                  Get in touch
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <motion.div style={{ opacity: hairline }} className="h-px bg-border" />
    </header>
  );
}
