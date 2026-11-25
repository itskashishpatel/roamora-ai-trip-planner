
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const chatMessage = v.object({
  role: v.union(v.literal("user"), v.literal("assistant")),
  content: v.string(),
});

export default defineSchema({
  users: defineTable({
    clerkId: v.optional(v.string()),
    name: v.string(),
    imageUrl: v.string(),
    subscription: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  tripDetails: defineTable({
    tripId: v.string(),
    ownerId: v.string(),
    tripName: v.string(),
    tripDescription: v.any(),

    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("planned"),
        v.literal("completed"),
      ),
    ),

    answers: v.optional(v.any()),
    messages: v.optional(v.array(chatMessage)),
    completedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tripId", ["tripId"])
    .index("by_owner_created", ["ownerId", "createdAt"]),
});
