"use client";

import React, { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
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
  const emails = useQuery(api.waitlist.get);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[rgb(10,10,10)] text-white">
      {/* FX layers */}
      <FXBackground />

      {/* Content container */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 md:px-10">
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
              <span className="text-sm font-medium text-neutral-100">
                Darviz
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
              Generate leads, build excitement, and grow your email list ahead
              of launch day.
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
