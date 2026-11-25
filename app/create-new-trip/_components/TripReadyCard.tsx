"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Compass,
  Loader2,
  MapPin,
} from "lucide-react";

type TripReadyCardProps = {
  status: "saving" | "ready" | "error";
  tripId?: string;
  tripName?: string;
  description?: string;
  error?: string;
  onRetry?: () => void;
};

export default function TripReadyCard({
  status,
  tripId,
  tripName = "Your trip is ready",
  description = "Your itinerary has been prepared.",
  error,
  onRetry,
}: TripReadyCardProps) {
  if (status === "saving") {
    return (
      <div className="mt-4 w-full max-w-2xl rounded-2xl border bg-card p-5">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />

          <div>
            <h3 className="font-semibold">
              Saving your trip...
            </h3>

            <p className="text-sm text-muted-foreground">
              Roamora is safely storing your itinerary.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mt-4 w-full max-w-2xl rounded-2xl border border-destructive/30 bg-card p-5">
        <h3 className="font-semibold">
          Your itinerary is generated
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          {error || "We couldn't save your trip. Please try again."}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Save trip again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 w-full max-w-2xl overflow-hidden rounded-2xl border bg-card">
      <div className="bg-emerald-500/10 p-5">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-5 w-5" />

          <span className="text-sm font-semibold">
            Trip successfully saved
          </span>
        </div>

        <h3 className="mt-3 text-xl font-semibold">
          {tripName}
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          Your itinerary is saved to your trips.
        </div>

        {tripId && (
          <Link
            href={`/trips/${encodeURIComponent(tripId)}`}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Explore my trip
            <Compass className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}