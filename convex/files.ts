// convex/files.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const urlById = query({
  args: { id: v.id("_storage") },
  handler: async (ctx, { id }) => {
    const url = await ctx.storage.getUrl(id); // signed, short-lived
    return url; // null if not found
  },
});
