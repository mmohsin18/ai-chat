"use client";

import { getColorQuote, Result } from "@/hooks/getColorQuote";
import { variants } from "@/styles/textanimation";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";

// --- utils: contrast-aware text color ---
function hexToRgb(hex: string) {
  const m = hex.replace("#", "");
  const v = m.length === 3
    ? m.split("").map(c => c + c).join("")
    : m;
  const int = parseInt(v, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}
function srgbToLin(c: number) {
  const cs = c / 255;
  return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
}
function relLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const R = srgbToLin(r), G = srgbToLin(g), B = srgbToLin(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
function contrastRatio(hexBg: string, hexFg: string) {
  const L1 = relLuminance(hexBg);
  const L2 = relLuminance(hexFg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}
function pickOnColor(bgHex: string) {
  const black = "#111111";
  const white = "#FFFFFF";
  const cWhite = contrastRatio(bgHex, white);
  const cBlack = contrastRatio(bgHex, black);
  return cWhite >= cBlack ? white : black;
}

function QouteLeft() {
  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await getColorQuote();
        setData(result);
      } catch (error: any) {
        setErr(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const bg = data?.color.hex ?? "oklch(48.8% 0.243 264.376)";
  const on = useMemo(() => pickOnColor(bg), [bg]);
  const onMuted = useMemo(() => (on === "#FFFFFF" ? "#FFFFFFCC" : "#111111CC"), [on]);

  return (
    <div
      className="w-[90%] h-[90%] flex flex-col justify-between rounded-xl p-10"
      style={{
        backgroundColor: bg,
        color: on, // default text color
      }}
    >
      {/* optional subtle scrim for extra readability on very light pastels */}
      <div className="absolute inset-0 pointer-events-none rounded-xl"
           style={{ background: on === "#FFFFFF" ? "transparent" : "linear-gradient(0deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02))" }} />

      <motion.div
        style={{
          letterSpacing: "-0.05em",
          lineHeight: 1.1,
          fontSize: "clamp(42px, 6vw, 60px)",
        }}
        initial="hidden"
        animate="show"
        custom={0}
        variants={variants}
        className="text-xl font-bold relative"
      >
        <h1>{loading ? "Darviz Blue" : data?.color.name}</h1>
        <p className="text-xl italic tracking-tight" style={{ color: onMuted }}>
          {loading ? "" : data?.color.hex}
        </p>
      </motion.div>

      <motion.div
        style={{ letterSpacing: "-0.05em", lineHeight: 1, fontSize: "20px" }}
        initial="hidden"
        animate="show"
        custom={0}
        variants={variants}
        className="relative"
      >
        {err ? (
          <p style={{ color: onMuted }}>Error: {err}</p>
        ) : (
          <>
            <h1 className="text-xl">{loading ? "Darviz is the best ai" : data?.quote.content}</h1>
            {!loading && <p className="py-2 italic" style={{ color: onMuted }}>— {data?.quote.author}</p>}
          </>
        )}
      </motion.div>
    </div>
  );
}

export default QouteLeft;
