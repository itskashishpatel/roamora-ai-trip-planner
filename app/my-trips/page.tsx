
"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Compass,
  MapPin,
  Plus,
  Plane,
  Trash2,
} from "lucide-react";

type SavedTrip = {
  _id: string;
  tripId: string;
  tripName: string;
  tripDescription: unknown;
  status?: "draft" | "planned" | "completed";
  createdAt: number;
  updatedAt: number;
};

function readText(value: unknown): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : "";
}

export default function MyTripsPage() {
  const { isLoaded, isSignedIn } = useAuth();

  const trips = useQuery(
    api.tripDetail.getMyTrips,
    isSignedIn ? {} : "skip"
  ) as SavedTrip[] | undefined;

  const deleteTrip = useMutation(api.tripDetail.deleteTrip);
  const markTripCompleted = useMutation(api.tripDetail.markTripCompleted);

  const [busyTripId, setBusyTripId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  async function handleDelete(tripId: string) {
    if (!window.confirm("Delete this trip? This action cannot be undone from My Trips.")) {
      return;
    }

    setBusyTripId(tripId);
    setActionError("");

    try {
      await deleteTrip({ tripId });
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not delete this trip."
      );
    } finally {
      setBusyTripId(null);
    }
  }

  async function handleComplete(tripId: string) {
    setBusyTripId(tripId);
    setActionError("");

    try {
      await markTripCompleted({ tripId });
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not update this trip."
      );
    } finally {
      setBusyTripId(null);
    }
  }

  if (!isLoaded) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-52 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e9efe6] text-[#245542]">
          <Compass className="h-8 w-8" />
        </div>

        <h1 className="mt-5 text-2xl font-semibold text-[#173d30]">
          Sign in to view your trips
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Your saved journeys will be available here whenever you return.
        </p>

        <Link
          href="/sign-in?redirect_url=%2Fmy-trips"
          className="mt-6 rounded-full bg-[#194b39] px-6 py-3 text-sm font-semibold text-white"
        >
          Sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[#f7f8f3]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6a4b]">
              Your travel collection
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#173d30] sm:text-4xl">
              My Trips
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#64746b]">
              Your saved journeys, drafts, and completed adventures in one place.
            </p>
          </div>

          <Link
            href="/create-new-trip"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#194b39] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#123b2d]"
          >
            <Plus className="h-4 w-4" />
            Plan a new trip
          </Link>
        </div>

        {actionError && (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {actionError}
          </p>
        )}

        {trips === undefined ? (
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-56 animate-pulse rounded-2xl bg-white" />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <section className="mt-10 rounded-3xl border border-dashed border-[#cbd8ce] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf3ed] text-[#245542]">
              <Plane className="h-8 w-8" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-[#173d30]">
              Your next journey starts here
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718077]">
              Start planning a trip and your progress will be saved here automatically.
            </p>

            <Link
              href="/create-new-trip"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#194b39] px-6 py-3 text-sm font-semibold text-white"
            >
              Create your first trip
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        ) : (
          <section className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => {
              const description =
                trip.tripDescription &&
                typeof trip.tripDescription === "object"
                  ? (trip.tripDescription as Record<string, unknown>)
                  : {};

              const destination = readText(description.destination);
              const summary =
                readText(description.summary) ||
                (trip.status === "draft"
                  ? "Your trip planning is in progress."
                  : "Your personalized Roamora itinerary.");

              const days = Array.isArray(description.days)
                ? description.days.length
                : typeof description.duration === "number"
                  ? description.duration
                  : 0;

              const status = trip.status ?? "planned";
              const isBusy = busyTripId === trip.tripId;

              return (
                <article
                  key={trip._id}
                  className="flex min-h-64 flex-col rounded-2xl border border-[#dce5dc] bg-white p-5 shadow-[0_8px_30px_rgba(25,75,57,0.04)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf3ed] text-[#245542]">
                      <MapPin className="h-5 w-5" />
                    </div>

                    <span className="rounded-full bg-[#edf3ed] px-3 py-1 text-xs font-semibold capitalize text-[#245542]">
                      {status}
                    </span>
                  </div>

                  <h2 className="mt-5 text-xl font-semibold text-[#173d30]">
                    {trip.tripName}
                  </h2>

                  {destination && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-[#64746b]">
                      <MapPin className="h-3.5 w-3.5" />
                      {destination}
                    </p>
                  )}

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#718077]">
                    {summary}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#edf1ec] pt-4">
                    <span className="flex items-center gap-1.5 text-xs text-[#64746b]">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {days > 0 ? `${days} days` : "Planning"}
                    </span>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void handleDelete(trip.tripId)}
                      aria-label={`Delete ${trip.tripName}`}
                      className="rounded-lg p-2 text-[#9a7770] transition hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {status === "draft" ? (
                      <Link
                        href={`/create-new-trip?tripId=${encodeURIComponent(trip.tripId)}`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#194b39] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#123b2d]"
                      >
                        Resume planning
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <>
                        <Link
                          href={`/trips/${encodeURIComponent(trip.tripId)}`}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#194b39] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#123b2d]"
                        >
                          View trip
                          <ArrowRight className="h-4 w-4" />
                        </Link>

                        {status !== "completed" && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => void handleComplete(trip.tripId)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dce5dc] px-3 py-2.5 text-sm font-medium text-[#315441] hover:bg-[#f4f7f2] disabled:opacity-40"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Complete
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
