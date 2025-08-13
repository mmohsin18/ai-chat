"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useWaitlist() {
  const addToWaitlist = useMutation(api.waitlisting.addToWaitlist);

  return async (email: string, reference?: string) => {
    await addToWaitlist({ email, reference });
  };
}
