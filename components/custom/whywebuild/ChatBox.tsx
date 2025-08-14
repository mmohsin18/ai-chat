import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, Variants } from "framer-motion";
import { Composer } from "./Composer";

const MOCK_MESSAGES = [
  {
    id: "m1",
    role: "assistant" as const,
    text: "Welcome to Darviz. Ready to craft some buzz?",
  },
  {
    id: "m2",
    role: "user" as const,
    text: "Plan me a day in Puran Dhaka under 3000 BDT",
  },
  // {
  //   id: "m3",
  //   role: "assistant" as const,
  //   text: "Sure! Here’s a plan for a day in Puran Dhaka under 3000 BDT",
  // },
  // {
  //   id: "m4",
  //   role: "user" as const,
  //   text: "Great—give me three alternates with a playful tone.",
  // },
];

function Bubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  const user = role === "user";
  return (
    <div
      className={
        "max-w-[85%] rounded-[1.25rem] border backdrop-blur-md px-4 py-3 text-sm " +
        (user
          ? "bg-[rgba(255,255,255,0.10)] border-white/15 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]"
          : "bg-[rgba(255,255,255,0.06)] border-white/10 text-white/90")
      }
    >
      {children}
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

export function ChatCard() {
  return (
    <section
      className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-md"
      aria-label="Chat"
    >
      {/* subtle inner border via gradient */}
      <div className="pointer-events-none absolute inset-px rounded-[0.7rem] bg-gradient-to-b from-white/10 to-white/0" />

      <div className="relative z-10 grid h-fit grid-rows-[1fr_auto]">
        <ScrollArea className="pr-1">
          <div className="space-y-4 px-3 py-5">
            {MOCK_MESSAGES.map((m, i) => (
              <motion.div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                initial="hidden"
                animate="show"
                custom={i}
                variants={variants}
              >
                <Bubble role={m.role}>{m.text}</Bubble>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        <Composer />
      </div>
    </section>
  );
}