// src/lib/getColorQuote.ts
import axios from "axios";

export type Result = {
  color: { hex: string; name: string };
  quote: { content: string; author: string };
};

type ColorApi = { hex: { value: string }; name: { value: string } };
type QuoteApi = { content: string; author: string };

export async function getColorQuote() {
  const [c, q] = await Promise.all([
    fetch("https://www.thecolorapi.com/random?format=json", {
      cache: "no-store",
    }),
    fetch("http://api.quotable.io/random", { cache: "no-store" }),
  ]);
  if (!c.ok) throw new Error(`Color API ${c.status}`);
  if (!q.ok) throw new Error(`Quotable API ${q.status}`);
  const color = (await c.json()) as ColorApi;
  const quote = (await q.json()) as QuoteApi;
  return {
    color: { hex: color.hex.value, name: color.name.value },
    quote: { content: quote.content, author: quote.author },
  };
}

