// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  waitlist: defineTable({
    email: v.string(),
    reference: v.optional(v.union(v.null(), v.string())),
    createdAt: v.optional(v.number()),
  }),

  users: defineTable({
    userId: v.optional(v.string()), // Convex auth user id
    email: v.string(), // keep required if you always have email
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    plan: v.optional(v.string()), // "Free" | "Pro" | "Enterprise"
    credit: v.optional(v.number()),
    role: v.optional(v.string()),
    createdAt: v.optional(v.number()), // Date.now()
    updatedAt: v.optional(v.number()), // Date.now()
  }).index("by_userId", ["userId"]),
});
