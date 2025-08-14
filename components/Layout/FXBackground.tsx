"use client";

import React from "react";


export default function FXBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 isolate"
      data-framer-name="Background"
    >
      {/* Base */}
      <div
        className="absolute inset-0 bg-[rgb(10,10,10)]"
        data-framer-name="Base"
      />

      {/* FX group */}
      <div className="absolute inset-0" data-framer-name="FX">
        {/* Gradient (canvas) */}
        <div
          className="absolute inset-0"
          data-framer-name="Gradient"
          style={{ opacity: 1, transform: "perspective(1200px)" }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-none bg-[rgb(10,10,10)]">
            <div id="Gradients" className="absolute inset-0">
              <GradientCanvas />
            </div>
          </div>
        </div>

        {/* Optional extra blur sheen layer (very subtle) */}
        <div className="absolute inset-0" data-framer-name="Blur" />

        {/* Particles (canvas) */}
        <div
          className="absolute inset-0"
          data-framer-name="Particles"
          style={{ opacity: 1, transform: "perspective(1200px)" }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-none bg-transparent">
            <div id="Desktop" className="absolute inset-0">
              <ParticlesCanvas />
            </div>
          </div>
        </div>

        {/* Linear wash (top) */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(255,255,255,0)_30%)]"
          data-framer-name="Linear"
        />
      </div>

      {/* Radial lift (center) */}
      <div
        className="absolute inset-0"
        data-framer-name="Radial"
        style={{ opacity: 1, transform: "perspective(1200px)" }}
      >
        <div
          className="absolute left-1/2 top-[46%] h-[48vmax] w-[48vmax] -translate-x-1/2 -translate-y-1/2 rounded-full
                        bg-[radial-gradient(closest-side,rgba(255,255,255,0.06),rgba(255,255,255,0)_75%)]"
        />
      </div>

      {/* Blurred ellipse lift (adds depth) */}
      <div
        className="absolute left-1/2 top-[48%] h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-[50%]
                      blur-3xl opacity-70 mix-blend-screen
                      bg-[radial-gradient(closest-side,rgba(255,255,255,0.06),rgba(255,255,255,0)_75%)]"
        data-framer-name="Elipse"
      />

      {/* Fades */}
      <div className="absolute inset-0" data-framer-name="Fade">
        <div
          className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[rgb(10,10,10)] to-transparent"
          data-framer-name="Left"
        />
        <div
          className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[rgb(10,10,10)] to-transparent"
          data-framer-name="Right"
        />
      </div>
    </div>
  );
}

/* ---------- Gradient canvas (cyan TL + white BR) ---------- */
function GradientCanvas() {
  const ref = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let ro: ResizeObserver | null = null;

    const sizeToParent = () => {
      const parent = canvas.parentElement!;
      const w = parent.clientWidth;
      const h = parent.clientHeight;

      canvas.width = Math.max(1, Math.floor(w * DPR));
      canvas.height = Math.max(1, Math.floor(h * DPR));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      // draw in CSS pixels
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR, DPR);

      draw(w, h);
    };

    const draw = (W: number, H: number) => {
      ctx.clearRect(0, 0, W, H);

      // Cyan glow — top-left
      const g1 = ctx.createRadialGradient(
        W * 0.25, H * 0.22, 0,
        W * 0.25, H * 0.22, Math.max(W, H) * 0.75
      );
      g1.addColorStop(0, "rgba(0,153,255,0.18)");
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);

      // White bloom — bottom-right
      const g2 = ctx.createRadialGradient(
        W * 0.78, H * 0.68, 0,
        W * 0.78, H * 0.68, Math.max(W, H) * 0.6
      );
      g2.addColorStop(0, "rgba(255,255,255,0.08)");
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);
    };

    sizeToParent();
    ro = new ResizeObserver(sizeToParent);
    ro.observe(canvas.parentElement!);

    return () => {
      ro?.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      aria-hidden
    />
  );
}

/* ---------- Particles canvas (soft stars) ---------- */
function ParticlesCanvas() {
  const ref = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let ro: ResizeObserver | null = null;
    let raf: number | null = null;

    let W = 0, H = 0;
    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number };
    let particles: P[] = [];

    const sizeToParent = () => {
      const parent = canvas.parentElement!;
      W = parent.clientWidth;
      H = parent.clientHeight;

      canvas.width = Math.max(1, Math.floor(W * DPR));
      canvas.height = Math.max(1, Math.floor(H * DPR));
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR, DPR);

      // density scales with area; fewer if reduced motion
      const density = prefersReduced ? 0.0008 : 0.0016;
      const count = Math.max(20, Math.floor(W * H * density));
      particles = Array.from({ length: count }).map(() => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.6 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * (prefersReduced ? 0.05 : 0.25),
        vy: (Math.random() - 0.5) * (prefersReduced ? 0.05 : 0.25),
        a: 0.05 + Math.random() * 0.12,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -5) p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
        if (p.y < -5) p.y = H + 5;
        if (p.y > H + 5) p.y = -5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (prefersReduced) {
        draw(); // one static frame
        return;
      }
      if (raf == null) raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (raf != null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") stop();
      else start();
    };

    sizeToParent();
    ro = new ResizeObserver(sizeToParent);
    ro.observe(canvas.parentElement!);

    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      aria-hidden
    />
  );
}

