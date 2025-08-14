import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { redirect } from "next/navigation";
import { FormEvent } from "react";

export function Composer() {
  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    redirect("#waitlist");
  }

  return (
    <div className="border-t border-white/10 p-2">
      <form
        className="relative flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 p-2"
        onSubmit={(e) => handleSubmit(e)}
      >
        <Input
          placeholder="Write a message…"
          className="h-12 flex-1 border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          type="submit"
          className="h-10 rounded-md bg-white text-black hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}