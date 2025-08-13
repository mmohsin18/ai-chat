import Image from "next/image";
import React from "react";

type WaitlistStatProps = {
  count?: number; // make it optional
  /** Optional custom avatar URLs (first 3 used). */
  avatars?: string[];
  className?: string;
};

/** Format 12000 -> 12k, 1_254_000 -> 1.25M */
function formatCount(n: number) {
  if (n < 1_000) return `${n}`;
  if (n < 1_000_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}k`;
  return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2)}M`;
}

/** Three fallback SVG avatars as data URIs (no external files needed). */
const FALLBACKS = [
  "data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>\
<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>\
<stop stop-color='%230099ff'/><stop offset='1' stop-color='%2366e1ff'/>\
</linearGradient></defs><rect width='64' height='64' rx='32' fill='url(%23g)'/>\
</svg>",
  "data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>\
<defs><linearGradient id='g' x1='0' y1='1' x2='1' y2='0'>\
<stop stop-color='%23ffffff' stop-opacity='0.9'/>\
<stop offset='1' stop-color='%23888888' stop-opacity='0.6'/>\
</linearGradient></defs><rect width='64' height='64' rx='32' fill='url(%23g)'/>\
</svg>",
  "data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>\
<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>\
<stop stop-color='%2300ffaa'/>\
<stop offset='1' stop-color='%23006644'/>\
</linearGradient></defs><rect width='64' height='64' rx='32' fill='url(%23g)'/>\
</svg>",
];

export default function WaitlistStat({
  count,
  avatars,
  className = "",
}: WaitlistStatProps) {
  const imgs = avatars?.length ? avatars.slice(0, 3) : FALLBACKS;

  // Props are read-only — compute a local safe value and clamp at 0
  const safeCount = Math.max(0, count ?? 200);

  return (
    <div className="w-full items-center flex justify-center">
      <div
        className={
          "inline-flex justify-center  items-center gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md " +
          className
        }
        aria-live="polite"
      >
        {/* Overlapping avatars */}
        <div className="flex -space-x-2">
          {imgs.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`Waitlist avatar ${i + 1}`}
              className="h-4 w-4 rounded-full object-cover ring-1 ring-white/20"
              loading="lazy"
            />
          ))}
        </div>

        {/* Count text */}
        <span className="text-xs font-medium tracking-[-0.02em] text-white/90">
          {formatCount(safeCount)}{" "}
          <span className="text-white/70">people have joined the waitlist</span>
        </span>
      </div>
    </div>
  );
}
