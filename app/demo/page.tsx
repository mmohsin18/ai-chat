"use client";

import React, { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import Logo from "@/components/Logo";
import { Footer } from "@/components/Layout/Footer";

const appear: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 30, delay: 0.1 * i },
  }),
};

export default function Page() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[rgb(10,10,10)] text-white">
      {/* FX layers */}
      <FXBackground />

      {/* Content container */}
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 md:px-10">
        {/* Hero */}
        <section className="z-10 flex flex-1 items-center pt-16 pb-16 md:pt-20">
          <div className="w-full">
            {/* Frosted pill */}
            <motion.div
              custom={1}
              variants={appear}
              initial="hidden"
              animate="show"
              className="mx-auto mb-6 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-md"
            >
              <span className="text-sm font-medium text-neutral-100">Darviz</span>
              <Logo/>
              <span className="text-sm font-medium text-neutral-100/90">by Gatekeepr</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              custom={2}
              variants={appear}
              initial="hidden"
              animate="show"
              className="mx-auto max-w-3xl text-center text-[42px] leading-[1.1] tracking-[-0.05em] text-neutral-100 md:text-[60px]"
            >
              <span className="inline-block">Good</span>{" "}
              <span className="inline-block">things</span>{" "}
              <span className="inline-block">come</span>{" "}
              <span className="inline-block">to</span>{" "}
              <span className="inline-block">those</span>{" "}
              <span className="font-serif italic">who wait.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              custom={3}
              variants={appear}
              initial="hidden"
              animate="show"
              className="mx-auto mt-4 max-w-3xl text-center text-base leading-relaxed tracking-[-0.04em] text-white/60"
            >
              Generate leads, build excitement, and grow your email list ahead of launch day.
            </motion.p>

            {/* Email form */}
            <motion.div
              custom={4}
              variants={appear}
              initial="hidden"
              animate="show"
              className="mx-auto mt-8 max-w-xl"
            >
              <EmailCapture />
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}

function EmailCapture() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: wire up your submit handler
      }}
      className="relative flex items-stretch"
    >
      <input
        type="email"
        required
        placeholder="Your Email Address"
        className="peer h-12 w-full rounded-md border border-white/10 bg-[rgba(10,10,10,0.56)] px-4 pr-32 text-sm text-white placeholder-white/40 outline-none ring-0 transition focus:border-white/20"
      />
      <button
        type="submit"
        className="absolute right-1 top-1 h-10 rounded bg-neutral-100 px-4 text-sm font-medium text-black transition active:translate-y-px"
      >
        Get Notified
      </button>
    </form>
  );
}

/** Background FX: gradients + soft particles canvas */
function FXBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * DPR);
      canvas.height = Math.floor(window.innerHeight * DPR);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.6 + Math.random() * 1.8,
      vx: -0.2 + Math.random() * 0.4,
      vy: -0.2 + Math.random() * 0.4,
      a: 0.05 + Math.random() * 0.15,
    }));

    const tick = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // soft glow
      const g1 = ctx.createRadialGradient(
        canvas.width * 0.25,
        canvas.height * 0.25,
        0,
        canvas.width * 0.25,
        canvas.height * 0.25,
        canvas.width * 0.7
      );
      g1.addColorStop(0, "rgba(0,153,255,0.12)");
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const g2 = ctx.createRadialGradient(
        canvas.width * 0.75,
        canvas.height * 0.65,
        0,
        canvas.width * 0.75,
        canvas.height * 0.65,
        canvas.width * 0.6
      );
      g2.addColorStop(0, "rgba(255,255,255,0.06)");
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * DPR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      {/* subtle radial */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_10%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(255,255,255,0)_30%)]" />
      </div>

      {/* particles */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />

      {/* left/right fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[rgb(10,10,10)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[rgb(10,10,10)] to-transparent" />
    </>
  );
}
