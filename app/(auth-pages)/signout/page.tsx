// app/components/signout-button.tsx
"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const { signOut } = useAuthActions();
  const router = useRouter();

  const onClick = async () => {
    try {
      await signOut();
      router.replace("/auth"); // send user back to login
      router.refresh();        // ensure auth state updates
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Button variant="ghost" onClick={onClick}>
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </Button>
  );
}
