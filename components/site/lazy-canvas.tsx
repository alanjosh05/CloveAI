"use client";

import dynamic from "next/dynamic";

// Three.js only runs in the browser, so the canvas never renders on the server.
export const LazySpecimen = dynamic(() => import("./specimen-canvas"), { ssr: false });
