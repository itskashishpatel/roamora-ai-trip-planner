
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const chatMessage = v.object({
  role: v.union(v.literal("user"), v.literal("assistant")),
  content: v.string(),
});

export const upsertTripDraft = mutation({
  args: {
    tripId: v.string(),
    tripName: v.string(),
    tripDescription: v.any(),
    answers: v.any(),
    messages: v.array(chatMessage),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be signed in to save a trip.");
    }

    const now = Date.now();

    const existingTrip = await ctx.db
      .query("tripDetails")
      .withIndex("by_tripId", (q) => q.eq("tripId", args.tripId))
      .unique();

    if (existingTrip) {
      if (existingTrip.ownerId !== identity.subject) {
        throw new Error("You do not have permission to update this trip.");
      }

      if (existingTrip.status === "completed") {
        throw new Error("A completed trip cannot be changed into a draft.");
      }

      await ctx.db.patch(existingTrip._id, {
        tripName: args.tripName,
        tripDescription: args.tripDescription,
        answers: args.answers,
        messages: args.messages,
        status: existingTrip.status ?? "draft",
        updatedAt: now,
      });

      return existingTrip._id;
    }

    return await ctx.db.insert("tripDetails", {
      tripId: args.tripId,
      ownerId: identity.subject,
      tripName: args.tripName,
      tripDescription: args.tripDescription,
      answers: args.answers,
      messages: args.messages,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const addTripDetail = mutation({
  args: {
    tripId: v.string(),
    tripName: v.string(),
    tripDescription: v.any(),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be signed in to save a trip.");
    }

    const now = Date.now();

    const existingTrip = await ctx.db
      .query("tripDetails")
      .withIndex("by_tripId", (q) => q.eq("tripId", args.tripId))
      .unique();

    if (existingTrip) {
      if (existingTrip.ownerId !== identity.subject) {
        throw new Error("You do not have permission to update this trip.");
      }

      await ctx.db.patch(existingTrip._id, {
        tripName: args.tripName,
        tripDescription: args.tripDescription,
        status: "planned",
        updatedAt: now,
      });

      return existingTrip._id;
    }

    return await ctx.db.insert("tripDetails", {
      tripId: args.tripId,
      ownerId: identity.subject,
      tripName: args.tripName,
      tripDescription: args.tripDescription,
      status: "planned",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getTripById = query({
  args: {
    tripId: v.string(),
  },

  handler: async (ctx, { tripId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const trip = await ctx.db
      .query("tripDetails")
      .withIndex("by_tripId", (q) => q.eq("tripId", tripId))
      .unique();

    if (
      !trip ||
      trip.ownerId !== identity.subject ||
      trip.deletedAt !== undefined
    ) {
      return null;
    }

    return trip;
  },
});

export const getMyTrips = query({
  args: {},

  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return [];

    const trips = await ctx.db
      .query("tripDetails")
      .withIndex("by_owner_created", (q) =>
        q.eq("ownerId", identity.subject)
      )
      .order("desc")
      .collect();

    return trips.filter((trip) => trip.deletedAt === undefined);
  },
});

export const markTripCompleted = mutation({
  args: {
    tripId: v.string(),
  },

  handler: async (ctx, { tripId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be signed in.");
    }

    const trip = await ctx.db
      .query("tripDetails")
      .withIndex("by_tripId", (q) => q.eq("tripId", tripId))
      .unique();

    if (!trip || trip.ownerId !== identity.subject) {
      throw new Error("Trip not found.");
    }

    if (trip.deletedAt !== undefined) {
      throw new Error("This trip has been deleted.");
    }

    await ctx.db.patch(trip._id, {
      status: "completed",
      completedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const deleteTrip = mutation({
  args: {
    tripId: v.string(),
  },

  handler: async (ctx, { tripId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be signed in.");
    }

    const trip = await ctx.db
      .query("tripDetails")
      .withIndex("by_tripId", (q) => q.eq("tripId", tripId))
      .unique();

    if (!trip || trip.ownerId !== identity.subject) {
      throw new Error("Trip not found.");
    }

    await ctx.db.patch(trip._id, {
      deletedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
