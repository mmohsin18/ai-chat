import { Variants } from "framer-motion";


export const appear: Variants = {
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
export const variants: Variants = {
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