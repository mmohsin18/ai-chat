"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { variants } from "@/styles/textanimation";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConvexAuth } from "convex/react";

export default function LoginForm() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");

  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      // let Convex set the cookie/session first
      await signIn("password", formData);
      if (step === "signIn") {
        toast.success("Logged in successfully!");
      } else {
        toast.success("Account created successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to log in.");
    }
  }

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // ensure the new session is visible to this route tree
      router.replace("/profile");
      router.refresh();
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="relative pb-6 pr-6 sm:pb-10">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="show"
        custom={0}
        variants={variants}
        className="relative"
      >
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          Welcome to Darviz AI
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tighter sm:text-4xl">
          {step === "signIn" ? "Welcome back!" : "Get started!"}
        </h1>
        <p className="mt-2 max-w-prose text-sm text-white/70">
          Your AI companion for planning, organizing, and getting things done.
        </p>
      </motion.div>

      <Separator className="my-3 bg-white/10" />

      {/* Card */}
      <motion.div
        initial="hidden"
        animate="show"
        custom={1}
        variants={variants}
        className="relative mt-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur"
      >
        {/* decorative gradient ring */}
        <div
          className="pointer-events-none absolute -inset-24 -z-10 rounded-[3rem] opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(80% 60% at 30% 20%, rgba(0,129,255,.18), transparent 70%), radial-gradient(70% 50% at 80% 0%, rgba(99,102,241,.14), transparent 70%)",
          }}
        />

        <form onSubmit={onSubmit} className="grid gap-5">
          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-white/80">
              Email address
            </Label>
            <div className="group relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="pl-9 h-11 border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-white/30"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-white/80">
              Password
            </Label>
            <div className="group relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                name="password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                className="pl-9 pr-10 h-11 border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-white/30"
                required
                autoComplete="current-password"
              />
              <input name="flow" type="hidden" value={step} />
              <Button
                type="button"
                aria-label={showPw ? "Hide password" : "Show password"}
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md text-white/70 hover:bg-white/10"
              >
                {showPw ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between text-xs">
              <Label className="inline-flex cursor-pointer items-center gap-2 text-white/70">
                <Checkbox className="h-3.5 w-3.5 rounded border-white/20 bg-white/10 accent-white/90" />
                Remember me
              </Label>
              <Link
                href="/forgot-password"
                className="text-white/80 underline-offset-2 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-2 grid gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="h-11 bg-white text-black hover:bg-white/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing you in…
                </>
              ) : step === "signIn" ? (
                "Login to your Account"
              ) : (
                "Create an Account"
              )}
            </Button>
          </div>

          {/* Footer */}
          <p className=" text-center text-sm text-white/70">
            {step === "signIn"
              ? "Don't have an account?"
              : "Login to your account?"}{" "}
            <span
              onClick={() => {
                setStep(step === "signIn" ? "signUp" : "signIn");
              }}
              className="font-semibold text-white cursor-pointer"
            >
              {step === "signIn" ? "Sign up instead" : "Sign in instead"}
            </span>
          </p>
        </form>
      </motion.div>

      {/* Tiny helper / disclaimer */}
      <motion.p
        initial="hidden"
        animate="show"
        custom={2}
        variants={variants}
        className="mt-4 hidden max-w-prose text-xs text-white/50"
      >
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </motion.p>
    </div>
  );
}
