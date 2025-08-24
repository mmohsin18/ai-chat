"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Menu, Search, ChevronRight } from "lucide-react";
// shadcn/ui
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatCard } from "@/components/custom/whywebuild/ChatBox";
import FXBackground from "@/components/Layout/FXBackground";

/**
 * NOTE ABOUT FONTS & THE PREVIOUS ERROR
 * -------------------------------------
 * The canvas preview threw: `TypeError: (void 0) is not a function`.
 * That typically happens when calling a missing function (e.g. next/font loaders
 * like `Inter()` / `Instrument_Serif()` are undefined in non‑Next sandboxes).
 *
 * To make this file portable, we REMOVED direct calls to next/font and instead
 * reference CSS variables if they exist (set them in your layout.tsx), with safe
 * fallbacks. In a real Next.js app, keep your next/font calls in `app/layout.tsx`.
 */

// --- Palette (from spec) ---
const COLORS = {
  background: "#0A0A0A",
  surface: "rgba(255,255,255,0.06)",
  surfaceStrong: "rgba(255,255,255,0.10)",
  textPrimary: "#F0F0F0",
  textSecondary: "rgba(255,255,255,0.56)",
  textTertiary: "rgba(255,255,255,0.40)",
  accent: "#0099FF",
  border: "rgba(255,255,255,0.10)",
  glow1: "rgba(0,153,255,0.12)",
  glow2: "rgba(255,255,255,0.06)",
};



export default function Page() {

  return (
    <div
      className="min-h-screen w-full"
      style={{
        // Use CSS vars if present; fall back to system stacks to avoid runtime font loader calls
        background: COLORS.background,
        fontFamily: `var(--font-inter, ui-sans-serif), system-ui, -apple-system, Segoe UI, Roboto`,
      }}
    >
      {/* Background FX */}
      <FXBackground />

      {/* Header */}
      <header className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 pt-7">
          <div className="flex items-center justify-between">
            <Badge />
            <SideTab />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-16">
          <Hero />

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[1fr]">
            <ChatCard />
          </div>
        </div>
      </main>

      {/* Footer (fixed invalid `border-white/10/0` -> `border-white/10`) */}
      <footer className="relative z-10 mt-6 border-t border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-sm text-white/60">
          <span>About Darviz</span>
          <span>
            © {new Date().getFullYear()} — Proudly Built By Gatekeepr
          </span>
        </div>
      </footer>

      {/* Dev-only sanity checks (non-blocking) */}
      <DevTests />
    </div>
  );
}

/* ----------------------------- Components ----------------------------- */

function Badge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 [background:rgba(255,255,255,0.08)] px-4 py-2 backdrop-blur-md text-white">
      {/* Dot (square rounded-2) */}
      <span className="inline-block h-2.5 w-2.5 rounded-[4px] bg-white" />
      <span className="font-medium tracking-tight">Darviz</span>
      <span className="text-white/30">•</span>
      <span className="font-medium tracking-tight">About</span>
    </div>
  );
}

function SideTab() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 rounded-full border border-white/10 bg-white/5 px-3 text-white hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open chats</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-80 border-white/10 bg-[#0b0b0b] p-0 text-white"
      >
        <SheetHeader className="border-b border-white/10 px-4 py-4">
          <SheetTitle className="text-white">Previous Chats</SheetTitle>
        </SheetHeader>
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              placeholder="Search conversations"
              className="border-white/10 bg-black/40 pl-9 text-white placeholder:text-white/40"
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100%-7.25rem)] px-2 pb-3">
          <nav className="space-y-1">
            {MOCK_THREADS.map((t) => (
              <button
                key={t.id}
                className="group flex w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-3 text-left hover:bg-white/10"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm text-white/90">
                    {t.title}
                  </div>
                  <div className="truncate text-xs text-white/50">
                    {t.preview}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-white/30 group-hover:text-white/60" />
              </button>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function Hero() {
  return (
    <div className="text-center">
      <motion.h1
        className="mx-auto max-w-3xl font-semibold tracking-tight text-white"
        style={{
          letterSpacing: "-0.05em",
          lineHeight: 1.1,
          fontSize: "clamp(42px, 6vw, 60px)",
        }}
        initial="hidden"
        animate="show"
        custom={0}
        variants={variants}
      >
        <span>Why</span> <span>we’re</span> <span>building</span>{" "}
        {/* Accent serif via CSS var fallback (no runtime font function) */}
        <span
          className="italic"
          style={{ fontFamily: `var(--font-instrument, Georgia, serif)` }}
        >
          Darviz
        </span>
      </motion.h1>
      <motion.p
        className="mx-auto mt-4 max-w-2xl text-base text-white/60"
        style={{ letterSpacing: "-0.04em", lineHeight: 1.5 }}
        initial="hidden"
        animate="show"
        custom={1}
        variants={variants}
      >
        Darviz helps you generate leads, build excitement, and grow your
        audience before launch day— with tasteful motion and a creator-first
        toolkit.
      </motion.p>
    </div>
  );
}

// --- Motion variants (from spec) ---
const delayStep = 0.08;
const computeStagger = (i: number) => i * delayStep; // tiny helper we can test
const variants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 30,
      delay: computeStagger(i),
    },
  }),
};


// /* ---------- Particles canvas (soft stars, container-aware, DPR-correct) ---------- */
// function ParticlesCanvas() {
//   const ref = React.useRef<HTMLCanvasElement | null>(null);

//   React.useEffect(() => {
//     const canvas = ref.current!;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const DPR = Math.min(window.devicePixelRatio || 1, 2);
//     let raf: number | null = null;
//     let W = 0,
//       H = 0;

//     type P = {
//       x: number;
//       y: number;
//       r: number;
//       vx: number;
//       vy: number;
//       a: number;
//     };
//     let particles: P[] = [];

//     const sizeToParent = () => {
//       const parent = canvas.parentElement!;
//       W = parent.clientWidth;
//       H = parent.clientHeight;
//       canvas.width = Math.max(1, Math.floor(W * DPR));
//       canvas.height = Math.max(1, Math.floor(H * DPR));
//       canvas.style.width = `${W}px`;
//       canvas.style.height = `${H}px`;
//       ctx.setTransform(1, 0, 0, 1, 0, 0);
//       ctx.scale(DPR, DPR);

//       const count = 60; // as per spec
//       particles = Array.from({ length: count }).map(() => ({
//         x: Math.random() * W,
//         y: Math.random() * H,
//         r: 0.6 + Math.random() * (2.4 - 0.6),
//         vx: -0.2 + Math.random() * 0.4,
//         vy: -0.2 + Math.random() * 0.4,
//         a: 0.05 + Math.random() * (0.2 - 0.05),
//       }));
//     };

//     const draw = () => {
//       ctx.clearRect(0, 0, W, H);
//       for (const p of particles) {
//         p.x += p.vx;
//         p.y += p.vy;
//         if (p.x < -5) p.x = W + 5;
//         if (p.x > W + 5) p.x = -5;
//         if (p.y < -5) p.y = H + 5;
//         if (p.y > H + 5) p.y = -5;
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(255,255,255,${p.a})`;
//         ctx.fill();
//       }
//     };

//     const loop = () => {
//       draw();
//       raf = requestAnimationFrame(loop);
//     };

//     const start = () => {
//       if (raf == null) raf = requestAnimationFrame(loop);
//     };
//     const stop = () => {
//       if (raf != null) {
//         cancelAnimationFrame(raf);
//         raf = null;
//       }
//     };

//     sizeToParent();
//     const ro = new ResizeObserver(sizeToParent);
//     ro.observe(canvas.parentElement!);
//     start();

//     return () => {
//       stop();
//       ro.disconnect();
//     };
//   }, []);

//   return (
//     <canvas
//       ref={ref}
//       className="absolute inset-0 pointer-events-none"
//       aria-hidden
//     />
//   );
// }

/* ------------------------------ Mock data ----------------------------- */
const MOCK_THREADS = [
  {
    id: "t1",
    title: "Landing microcopy brainstorm",
    preview: "Tagline + subhead variants…",
  },
  { id: "t2", title: "Email capture UX", preview: "CTA phrasing and states…" },
  { id: "t3", title: "Motion polish", preview: "Stagger + spring tweaks…" },
  { id: "t4", title: "SEO snippets", preview: "Meta + OG text…" },
];



/* ------------------------------ Dev tests ----------------------------- */
function DevTests() {
  React.useEffect(() => {
    try {
      console.assert(computeStagger(0) === 0, "stagger(0) === 0");
      console.assert(
        computeStagger(1) === delayStep,
        "stagger(1) === delayStep"
      );
      console.assert(
        computeStagger(3) === 3 * delayStep,
        "stagger(3) === 3*delayStep"
      );
      console.assert(
        computeStagger(5) > computeStagger(4),
        "stagger monotonic increasing"
      );
      const hex = COLORS.accent.startsWith("#")
        ? COLORS.accent.slice(1)
        : COLORS.accent;
      console.assert(/^([0-9A-Fa-f]{6})$/.test(hex), "accent is hex-like");
      console.assert(
        typeof COLORS.background === "string" && COLORS.background.length > 0,
        "background set"
      );
      console.assert(
        typeof COLORS.glow1 === "string" && COLORS.glow1.includes("rgba"),
        "glow1 rgba string"
      );
    } catch (e) {
      console.warn("DevTests encountered an error:", e);
    }
  }, []);
  return null;
}
