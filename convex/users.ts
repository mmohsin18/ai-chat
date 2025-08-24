// convex/users.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const myProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const upsertMe = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const identity = await ctx.auth.getUserIdentity();

    const existing = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    const now = Date.now();

    if (existing) {
      // Patch only fields that might change from identity; keep their existing plan
      await ctx.db.patch(existing._id, {
        email: identity?.email ?? existing.email,
        name: identity?.name ?? existing.name,
        imageUrl: identity?.pictureUrl ?? existing.imageUrl,
        updatedAt: now,
      });
      return existing._id;
    }

    // INSERT with all required fields present
    return await ctx.db.insert("users", {
      userId,
      email: identity?.email ?? "",   // if you kept email required
      name: identity?.name,
      username: undefined,
      imageUrl: identity?.pictureUrl,
      plan: "Free",                   // <-- default here
      role: "user",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    plan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const me = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!me) throw new Error("Profile not found (run upsertMe after login).");

    await ctx.db.patch(me._id, { ...args, updatedAt: Date.now() });
    return me._id;
  },
});
