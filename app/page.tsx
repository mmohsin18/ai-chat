"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import Logo from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import WaitlistStat from "@/components/custom/WaitlistStat";
import { useWaitlist } from "@/hooks/useWaitlist";
import { toast } from "sonner";
import axios from "axios";
import FXBackground from "@/components/Layout/FXBackground";
import { ChatCard } from "@/components/custom/whywebuild/ChatBox";

const appear: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 30, delay: 0.1 * i },
  }),
};

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

export default function Page() {
  const emails = useQuery(api.waitlist.get);
  const prefersReduced = useReducedMotion();

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[rgb(10,10,10)] text-white">
      {/* FX layers */}
      <FXBackground />

      {/* Content container */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 md:px-10">
        {/* Hero */}
        <section
          id="waitlist"
          className="z-10 flex flex-1 h-screen items-center pt-16 pb-16 md:pt-20"
        >
          <div className="w-full">
            {/* Frosted pill */}
            <motion.div
              custom={1}
              variants={appear}
              initial="hidden"
              animate="show"
              className="mx-auto mb-6 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-md"
            >
              <span className="text-sm font-medium text-neutral-100">
                Darviz AI
              </span>
              <Logo />
              <span className="text-sm font-medium text-neutral-100/90">
                by Gatekeepr
              </span>
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
              Explore new possibilities with your companion to experience better
              moments ahead of launch day.
            </motion.p>

            {/* Email form */}
            <motion.div
              custom={4}
              variants={appear}
              initial="hidden"
              animate="show"
              className="mx-auto mt-8 max-w-xl"
            >
              <WaitlistStat className="mb-3" count={emails?.length} />
              <EmailCapture />
            </motion.div>
          </div>
        </section>
        <div className="border-b w-full border-white/10 mb-10"></div>
        <section className="py-4">
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
                Darviz AI
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
              Darviz helps you discover exciting events near you and plan your
              day around experiences that truly matter.
            </motion.p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[1fr]">
            <ChatCard />
          </div>
        </section>
      </div>
    </main>
  );
}

async function sendEmail(email: string) {
  await axios.post("/api/send-ticket", {
    email,
  });
}

function EmailCapture() {
  const [email, setEmail] = useState("");
  const [refCode, setRefCode] = useState<string | undefined>(undefined);
  const waitlist = useWaitlist();

  // Read ?ref=... from the URL on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ref =
        new URLSearchParams(window.location.search).get("ref") || undefined;
      setRefCode(ref);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const emailValue = (form.email as HTMLInputElement).value.trim();

    setEmail(emailValue);

    // Call waitlist with or without reference based on presence
    if (refCode) {
      await waitlist(emailValue, refCode);
    } else {
      await waitlist(emailValue);
    }

    setEmail("");
    sendEmail(emailValue);
    toast.success("You are added to waitlist");
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-stretch">
      <Input
        type="email"
        required
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your Email Address"
        className="peer h-12 w-full bg-transparent rounded-md border focus:bg-transparent border-white/10 px-4 pr-32 text-sm text-white placeholder-white/40 outline-none ring-0 transition focus:border-white/20"
      />
      <Button
        type="submit"
        className="absolute right-1 top-1 h-10 rounded bg-neutral-100 px-4 text-sm font-medium text-black transition hover:text-white active:translate-y-px"
      >
        Get Notified
      </Button>
    </form>
  );
}

// function Bubble({
//   role,
//   children,
// }: {
//   role: "user" | "assistant";
//   children: React.ReactNode;
// }) {
//   const user = role === "user";
//   return (
//     <div
//       className={
//         "max-w-[85%] rounded-[1.25rem] border backdrop-blur-md px-4 py-3 text-sm " +
//         (user
//           ? "bg-[rgba(255,255,255,0.10)] border-white/15 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]"
//           : "bg-[rgba(255,255,255,0.06)] border-white/10 text-white/90")
//       }
//     >
//       {children}
//     </div>
//   );
// }
