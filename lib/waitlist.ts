// lib/useWaitlist.ts
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { toast } from "sonner";

export function useWaitlist() {
  const addToWaitlist = useMutation(api.waitlisting.addToWaitlist);

  return async (email: string, reference?: string) => {
    await addToWaitlist({ email, reference });
    toast.success("You are added to the waitlist");
  };
}
