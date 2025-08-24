// app/profile/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Pencil,
  Save,
  X,
  Sparkles,
  Mail,
  ArrowRight,
  Check,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { appear } from "@/styles/textanimation";
import { sendEmail } from "@/hooks/sendEmail";
import { inter, SerifAccent } from "@/styles/accentSerif";

// Palette (matches your Darviz spec)
const PALETTE = {
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
const DELAY_STEP = 0.08;

// Background FX: radial glows, particle field, side fades
function FXBackground() {
  const particles = Array.from({ length: 60 });
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {/* Radial glows */}
      <div
        className="absolute inset-0 blur-3xl opacity-80"
        style={{
          background: `
            radial-gradient(70vw 70vw at 25% 25%, ${PALETTE.glow1}, transparent 70%),
            radial-gradient(60vw 60vw at 75% 65%, ${PALETTE.glow2}, transparent 60%)
          `,
        }}
      />
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((_, i) => {
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const size = 0.6 + Math.random() * (2.4 - 0.6);
          const delay = Math.random() * 5;
          const duration = 8 + Math.random() * 10;
          const opacity = 0.05 + Math.random() * (0.2 - 0.05);
          return (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
                background: "white",
                opacity,
                animation: `float ${duration}s ease-in-out ${delay}s infinite alternate`,
                boxShadow: `0 0 10px ${PALETTE.glow1}`,
                filter: "blur(0.3px)",
              }}
            />
          );
        })}
      </div>
      {/* Side fades */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0A0A0A] to-transparent" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0A0A0A] to-transparent" />
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(0.6rem, -0.8rem, 0);
          }
        }
      `}</style>
    </div>
  );
}

// Motion section
function MSection({
  children,
  index = 0,
  className = "",
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={
        reduce
          ? { duration: 0.01 }
          : {
              type: "spring",
              stiffness: 200,
              damping: 30,
              delay: index * DELAY_STEP,
            }
      }
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();

  // Gate by auth
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/auth");
  }, [isAuthenticated, isLoading, router]);

  // Ensure a baseline profile exists
  const upsertMe = useMutation(api.users.upsertMe);
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      void upsertMe().catch(() => {});
    }
  }, [isLoading, isAuthenticated, upsertMe]);

  // Fetch profile
  const profile = useQuery(api.users.myProfile);
  const url = useQuery(api.files.urlById, {
    id: (profile?.imageUrl as any) || "kg22w3yqa85rwtpks950rfc3597p96bh",
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    imageUrl: "",
    plan: "Free",
  });
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        username: profile.username ?? "",
        email: profile.email ?? "",
        imageUrl: profile.imageUrl ?? "",
        plan: profile.plan ?? "Free",
      });
    }
  }, [profile]);

  const initials = useMemo(() => {
    const label = (profile?.name || profile?.email || "D").trim();
    const parts = label.split(" ");
    return ((parts[0]?.[0] ?? "D") + (parts[1]?.[0] ?? "")).toUpperCase();
  }, [profile]);

  const updateProfile = useMutation(api.users.updateProfile);

  async function onSave() {
    try {
      await updateProfile({
        name: form.name || undefined,
        username: form.username || undefined,
        email: form.email || undefined,
        imageUrl: form.imageUrl || undefined,
        plan: form.plan || "Free",
      });
      toast.success("Profile updated");
      setEditing(false);
      router.refresh();
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to update profile";
      toast.error(message);
    }
  }

  async function onChoosePlan(nextPlan: "Free" | "Pro" | "Enterprise") {
    try {
      await updateProfile({ plan: nextPlan });
      toast.success(`Switched to ${nextPlan}`);
      setForm((s) => ({ ...s, plan: nextPlan }));
      router.refresh();
    } catch {
      toast.error("Could not change plan");
    }
  }

  if (isLoading || profile === undefined) {
    return (
      <main
        className={`${inter.className} relative min-h-[100dvh]`}
        style={{ background: PALETTE.background, color: PALETTE.textPrimary }}
      >
        <FXBackground />
        <div className="mx-auto max-w-[72rem] px-6 md:px-10 pt-28 pb-16">
          <Card className="border border-white/10 bg-white/[0.05] backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading profile…
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-6 w-40 rounded bg-white/10 mb-3" />
              <div className="h-28 w-full rounded bg-white/10" />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) return null;

  async function sendInvite(email: any) {
    sendEmail(email);
    toast.success("Invite sent!");
    setInviteEmail("");
  }

  return (
    <main
      className={`${inter.className} relative min-h-[100dvh] text-white selection:bg-[#0099FF]/20 selection:text-black`}
      style={{ background: PALETTE.background, color: PALETTE.textPrimary }}
    >
      <FXBackground />

      <div className="mx-auto max-w-[72rem] px-6 md:px-10 pt-28 pb-16">
        <motion.div
          custom={1}
          variants={appear}
          initial="hidden"
          animate="show"
          className="mx-auto mb-6 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-1 backdrop-blur-md"
        >
          <span className="text-sm font-medium text-neutral-100">Darviz</span>
          <Logo />
          <span className="text-sm font-medium text-neutral-100/90">
            Profile
          </span>
        </motion.div>

        {/* Header row */}
        <MSection
          index={0}
          className="mb-3 lg:mb-8 py-6 rounded-2xl relative lg:sticky backdrop-blur top-1 z-10"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 ring-1 ring-white/20">
                <AvatarImage src={url || ""} alt={form.name || "Avatar"} />
                <AvatarFallback className="bg-white/10 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-semibold tracking-[-0.02em]">
                  {profile?.name ?? "Your profile"}
                </h1>
                <p className="text-sm" style={{ color: PALETTE.textSecondary }}>
                  Manage your account, billing, and{" "}
                  <SerifAccent>AI credits</SerifAccent>.
                </p>
              </div>
            </div>
            <Badge className="bg-white/10 text-white">
              {form.plan || "Free"}
            </Badge>
          </div>
        </MSection>

        {/* Tabs (Profile, Settings, Pricing, AI Credits) */}
        <MSection index={1}>
          <Tabs defaultValue="profile" className="w-full ">
            <div className=" relative lg:sticky top-0 lg:top-28 z-10 -mx-2 mb-6 overflow-x-auto pb-2">
              <TabsList
                className="mx-2 flex  w-max gap-2 rounded-full border backdrop-blur px-2 py-1"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderColor: PALETTE.border,
                }}
              >
                <TabsTrigger
                  value="profile"
                  className="rounded-full text-white data-[state=active]:bg-white/15"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="rounded-full text-white data-[state=active]:bg-white/15"
                >
                  Settings
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="rounded-full text-white data-[state=active]:bg-white/15"
                >
                  Pricing
                </TabsTrigger>
                <TabsTrigger
                  value="credits"
                  className="rounded-full text-white data-[state=active]:bg-white/15"
                >
                  AI Credits
                </TabsTrigger>
              </TabsList>
            </div>

            {/* PROFILE TAB */}
            <TabsContent value="profile" className="mt-0">
              <Card
                className="border backdrop-blur text-white rounded-2xl"
                style={{
                  borderColor: PALETTE.border,
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.03))",
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <CardTitle className="text-xl">Profile</CardTitle>
                  {!editing ? (
                    <Button
                      variant="secondary"
                      onClick={() => setEditing(true)}
                      className="gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={onSave} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setEditing(false)}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardHeader>

                <Separator className="bg-white/10" />

                <CardContent className="grid gap-6 pt-6">
                  {/* Editable form */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-white/80">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, name: e.target.value }))
                        }
                        placeholder="Your name"
                        disabled={!editing}
                        className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-[#0099FF]"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="username" className="text-white/80">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={form.username}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, username: e.target.value }))
                        }
                        placeholder="username"
                        disabled={!editing}
                        className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-[#0099FF]"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-white/80">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, email: e.target.value }))
                        }
                        placeholder="email@example.com"
                        disabled={!editing}
                        className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-[#0099FF]"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="avatar" className="text-white/80">
                        Avatar URL
                      </Label>
                      <Input
                        id="avatar"
                        value={form.imageUrl}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, imageUrl: e.target.value }))
                        }
                        placeholder="https://…"
                        disabled={!editing}
                        className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-[#0099FF]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SETTINGS TAB */}
            <TabsContent value="settings" className="mt-0">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Account & privacy */}
                <Card
                  className="rounded-2xl text-white border backdrop-blur"
                  style={{
                    borderColor: PALETTE.border,
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg ">
                      Account & Privacy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid text-white gap-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">
                          Public profile
                        </div>
                        <p
                          className="text-xs"
                          style={{ color: PALETTE.textSecondary }}
                        >
                          Let others discover your profile page.
                        </p>
                      </div>
                      <Switch onCheckedChange={() => toast.message("Saved")} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Show email</div>
                        <p
                          className="text-xs"
                          style={{ color: PALETTE.textSecondary }}
                        >
                          Display your email on public profile.
                        </p>
                      </div>
                      <Switch onCheckedChange={() => toast.message("Saved")} />
                    </div>

                    <Button
                      variant="secondary"
                      className="justify-start gap-2"
                      onClick={() => router.push("/auth/security")}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Security settings
                    </Button>
                  </CardContent>
                </Card>

                {/* Notifications */}
                <Card
                  className="rounded-2xl border text-white backdrop-blur"
                  style={{
                    borderColor: PALETTE.border,
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">
                          Product updates
                        </div>
                        <p
                          className="text-xs"
                          style={{ color: PALETTE.textSecondary }}
                        >
                          Emails about new features and tips.
                        </p>
                      </div>
                      <Switch onCheckedChange={() => toast.message("Saved")} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">
                          Weekly summary
                        </div>
                        <p
                          className="text-xs"
                          style={{ color: PALETTE.textSecondary }}
                        >
                          Digest of activity and insights.
                        </p>
                      </div>
                      <Switch onCheckedChange={() => toast.message("Saved")} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">
                          Marketing emails
                        </div>
                        <p
                          className="text-xs"
                          style={{ color: PALETTE.textSecondary }}
                        >
                          Occasional offers from Darviz.
                        </p>
                      </div>
                      <Switch onCheckedChange={() => toast.message("Saved")} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* PRICING TAB */}
            <TabsContent value="pricing" className="mt-0 text-white">
              <div className="grid gap-4 text-white md:grid-cols-3">
                {[
                  {
                    name: "Free",
                    price: "$0",
                    features: [
                      "Basic profile",
                      "Email capture",
                      "Community support",
                    ],
                    cta: "Use Free",
                    action: () => onChoosePlan("Free"),
                  },
                  {
                    name: "Pro",
                    price: "$12",
                    features: [
                      "Custom domains",
                      "Advanced analytics",
                      "3K AI credits / mo",
                    ],
                    cta: "Upgrade to Pro",
                    action: () => onChoosePlan("Pro"),
                  },
                  {
                    name: "Enterprise",
                    price: "Contact",
                    features: [
                      "SAML SSO",
                      "Security review",
                      "Priority support",
                    ],
                    cta: "Contact Sales",
                    action: () => router.push("/contact"),
                  },
                ].map((tier) => (
                  <Card
                    key={tier.name}
                    className="rounded-2xl text-white border p-6 hover:bg-white/[0.04] transition-colors backdrop-blur"
                    style={{
                      borderColor: PALETTE.border,
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold">{tier.name}</div>
                      {tier.name === form.plan && (
                        <Badge className="bg-white/10 text-white">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 text-3xl font-semibold tracking-tight">
                      {tier.price}
                      {tier.price === "$0" ? "" : "/mo"}
                    </div>
                    <ul
                      className="mt-4 grid gap-2 text-sm"
                      style={{ color: PALETTE.textSecondary }}
                    >
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button onClick={tier.action} className="mt-5 w-full gap-2">
                      {tier.name === "Pro" ? <Zap className="h-4 w-4" /> : null}
                      {tier.cta}
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* AI CREDITS TAB */}
            <TabsContent value="credits" className="mt-0">
              <div className="grid gap-4 md:grid-cols-2">
                <Card
                  className="rounded-2xl text-white border backdrop-blur"
                  style={{
                    borderColor: PALETTE.border,
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">Usage</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div>
                      <div className="text-sm mb-1">Credits remaining</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-semibold">
                          {typeof (profile as any)?.credit === "number"
                            ? (profile as any).credit
                            : 0}
                        </span>
                        <span
                          className="text-sm"
                          style={{ color: PALETTE.textSecondary }}
                        >
                          credits
                        </span>
                      </div>
                      <Progress
                        value={Math.min(
                          100,
                          Math.max(
                            0,
                            typeof (profile as any)?.credits === "number"
                              ? ((profile as any).credits / 3000) * 100
                              : 0
                          )
                        )}
                        className="mt-3"
                      />
                      <p
                        className="mt-2 text-xs"
                        style={{ color: PALETTE.textTertiary }}
                      >
                        Resets monthly on your billing date.
                      </p>
                    </div>

                    <div
                      className="rounded-lg border p-3"
                      style={{
                        borderColor: PALETTE.border,
                        background: "rgba(255,255,255,0.03)",
                      }}
                    >
                      <div className="text-sm font-medium mb-1">
                        Last 7 days
                      </div>
                      <p
                        className="text-xs"
                        style={{ color: PALETTE.textSecondary }}
                      >
                        Generation count: {(profile as any)?.gen7d ?? 0} • Avg.
                        per day: {(profile as any)?.avg7d ?? 0}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => router.push("/billing")}
                        className="gap-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        Get more credits
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => router.push("/billing/history")}
                      >
                        View billing history
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="rounded-2xl border text-white backdrop-blur"
                  style={{
                    borderColor: PALETTE.border,
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">Invite & Perks</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div
                      className="rounded-lg border p-3"
                      style={{
                        borderColor: PALETTE.border,
                        background: "rgba(255,255,255,0.03)",
                      }}
                    >
                      <div className="text-sm font-medium">Refer friends</div>
                      <p
                        className="text-xs"
                        style={{ color: PALETTE.textSecondary }}
                      >
                        Earn bonus credits when a friend upgrades to Pro.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="friend@domain.com"
                        name="friendEmail"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="bg-black/60 border-white/10 text-white"
                      />
                      <Button
                        className="gap-2"
                        onClick={() => sendInvite(inviteEmail)}
                      >
                        <Mail className="h-4 w-4" />
                        Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </MSection>
      </div>

      {/* Floating help */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099FF]"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: `1px solid ${PALETTE.border}`,
        }}
        onClick={() => toast.info("Need help? Ping us at support@darviz.co")}
      >
        <Sparkles className="h-4 w-4" />
        Help
        <ArrowRight className="h-4 w-4" />
      </motion.button>
    </main>
  );
}
