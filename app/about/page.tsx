"use client";

import React, { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { Footer } from "@/components/Layout/Footer";
import Logo from "@/components/Logo";
import Link from "next/link";

const appear: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 30, delay: 0.08 * i },
  }),
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[rgb(10,10,10)] text-white">
      <FXBackground />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 md:px-10">
        {/* Hero */}
        <section className="z-10 pt-24 md:pt-32">
          <motion.div
            custom={1}
            variants={appear}
            initial="hidden"
            animate="show"
            className="mx-auto mb-6 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-md"
          >
            <span className="text-sm font-medium text-neutral-100">Darviz</span>
            <Logo/>
            <span className="text-sm font-medium text-neutral-100/90">About</span>
          </motion.div>

          <motion.h1
            custom={2}
            variants={appear}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-4xl text-center text-[42px] leading-[1.1] tracking-[-0.05em] text-neutral-100 md:text-[60px]"
          >
            <span className="inline-block">Why</span>{" "}
            <span className="inline-block">we’re</span>{" "}
            <span className="inline-block">building</span>{" "}
            <span className="font-serif italic">Darviz</span>
          </motion.h1>

          <motion.p
            custom={3}
            variants={appear}
            initial="hidden"
            animate="show"
            className="mx-auto mt-4 max-w-3xl text-center text-base leading-relaxed tracking-[-0.04em] text-white/60"
          >
            Darviz helps you{" "}
            <span className="text-white">generate leads, build excitement,</span> and{" "}
            <span className="text-white">grow your audience</span> before launch day—with delightful UX, subtle motion, and a creator-first toolkit.
          </motion.p>
        </section>

        {/* Content */}
        <section className="z-10 mx-auto mt-14 grid w-full max-w-5xl grid-cols-1 gap-8 md:mt-20 md:grid-cols-12">
          {/* Mission */}
          <motion.div
            custom={4}
            variants={appear}
            initial="hidden"
            animate="show"
            className="md:col-span-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur"
          >
            <h2 className="mb-2 text-xl font-medium tracking-[-0.03em]">Our Mission</h2>
            <p className="text-white/70 leading-relaxed">
              Make pre-launch growth <span className="text-white">effortless</span> and{" "}
              <span className="text-white">beautiful</span>. From first impression to inbox opt-in,
              Darviz turns passive visitors into excited early users.
            </p>
          </motion.div>

          {/* What we value */}
          <motion.div
            custom={5}
            variants={appear}
            initial="hidden"
            animate="show"
            className="md:col-span-7 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur"
          >
            <h2 className="mb-2 text-xl font-medium tracking-[-0.03em]">What We Value</h2>
            <ul className="mt-3 space-y-3 text-white/70">
              <li>
                <span className="text-white">Clarity:</span> crisp copy, purposeful motion, zero clutter.
              </li>
              <li>
                <span className="text-white">Speed:</span> snappy setup, instant feedback, fast load.
              </li>
              <li>
                <span className="text-white">Taste:</span> dark, cinematic visuals with a soft glow—just enough drama.
              </li>
              <li>
                <span className="text-white">Trust:</span> transparent data handling and opt-in UX.
              </li>
            </ul>
          </motion.div>

          {/* Features */}
          <motion.div
            custom={6}
            variants={appear}
            initial="hidden"
            animate="show"
            className="md:col-span-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur"
          >
            <h2 className="mb-4 text-xl font-medium tracking-[-0.03em]">What’s inside</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                ["Frosted UI", "Blurred surfaces, micro-shadows, and glassy pills."],
                ["Motion System", "Springy entrances with subtle delays and hierarchy."],
                ["Email Capture", "Clean form UX ready to connect to your provider."],
                ["Theming", "Dark palette with soft gradients and particle glow."],
                ["Performance", "Lean Tailwind styles and minimal client JS."],
                ["Extensible", "Drop-in sections for launches, waitlists, and more."],
              ].map(([title, desc], i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition"
                >
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="mt-1 text-sm text-white/70">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            custom={7}
            variants={appear}
            initial="hidden"
            animate="show"
            className="md:col-span-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur"
          >
            <h2 className="mb-4 text-xl font-medium tracking-[-0.03em]">Roadmap</h2>
            <ol className="relative ml-4 space-y-6 border-l border-white/10 pl-6 text-white/70">
              {[
                ["Now", "Public landing + waitlist capture."],
                ["Next", "Integrations (Resend, Supabase, Mailchimp, ConvertKit)."],
                ["Soon", "Prebuilt sections for launches, changelogs, and blog teasers."],
                ["Later", "A/B experiments, analytics, and gated drops for early users."],
              ].map(([phase, text], i) => (
                <li key={i}>
                  <span className="absolute -left-[9px] mt-1 inline-block h-2.5 w-2.5 rounded-full bg-white" />
                  <p className="text-white">{phase}</p>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Team / CTA */}
          <motion.div
            custom={8}
            variants={appear}
            initial="hidden"
            animate="show"
            className="md:col-span-12 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-8 text-center backdrop-blur"
          >
            <h3 className="text-lg font-medium tracking-[-0.02em]">Built by Gatekeepr</h3>
            <p className="max-w-2xl text-white/70">
              We obsess over the little things—kernels of motion, letter-spacing, the exact opacity of a glow.
              If you care about first impressions, you’ll feel at home with Darviz.
            </p>
            <Link
              href="https://gatekeepr.live"
              className="mt-1 inline-flex items-center rounded-md border border-white/10 bg-white text-black px-4 py-2 text-sm font-medium transition active:translate-y-px"
            >
              Go to Home
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}

/** Background FX: gradients + soft particles canvas (same style as home) */
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
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_10%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(255,255,255,0)_30%)]" />
      </div>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[rgb(10,10,10)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[rgb(10,10,10)] to-transparent" />
    </>
  );
}
