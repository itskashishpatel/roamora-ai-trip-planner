
import {
  CalendarDays,
  MapPin,
  Users,
  Wallet,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

type TripOverviewProps = {
  tripName: string;
  source?: string;
  destination?: string;
  duration: number;
  dates?: string;
  groupSize?: string;
  budget?: string;
  tripId?: string;
};

export default function TripOverview({
  tripName,
  source,
  destination,
  duration,
  dates,
  groupSize,
  budget,
  tripId,
}: TripOverviewProps) {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-[#dce6d9] bg-[#f0f3e8] p-5 text-[#173e2e] shadow-sm sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-[#d9e7cf]/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 -z-10 h-48 w-48 rounded-full bg-white/70 blur-3xl" />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c9d9c5] bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#35644a]">
            <Compass className="h-3.5 w-3.5" />
            Your Roamora journey
          </div>

          <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {tripName}
          </h2>

          {source && destination && (
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#56705e]">
              <span>{source}</span>
              <span aria-hidden="true">→</span>
              <span className="font-semibold text-[#174c38]">
                {destination}
              </span>
            </p>
          )}

          {!source && destination && (
            <p className="mt-2 flex items-center gap-2 text-sm text-[#56705e]">
              <MapPin className="h-4 w-4" />
              {destination}
            </p>
          )}
        </div>

        {tripId && (
          <Link
            href={`/trips/${tripId}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#174c38] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#235b43]"
          >
            View full itinerary
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-2 rounded-xl border border-[#d9e3d4] bg-white/80 px-3 py-2 text-xs font-semibold text-[#345c43]">
          <CalendarDays className="h-4 w-4" />
          {duration} {duration === 1 ? "Day" : "Days"}
        </span>

        {dates && (
          <span className="inline-flex items-center gap-2 rounded-xl border border-[#d9e3d4] bg-white/80 px-3 py-2 text-xs font-medium text-[#345c43]">
            <CalendarDays className="h-4 w-4" />
            {dates}
          </span>
        )}

        {groupSize && (
          <span className="inline-flex items-center gap-2 rounded-xl border border-[#d9e3d4] bg-white/80 px-3 py-2 text-xs font-medium text-[#345c43]">
            <Users className="h-4 w-4" />
            {groupSize}
          </span>
        )}

        {budget && (
          <span className="inline-flex items-center gap-2 rounded-xl border border-[#d9e3d4] bg-white/80 px-3 py-2 text-xs font-medium text-[#345c43]">
            <Wallet className="h-4 w-4" />
            {budget}
          </span>
        )}
      </div>

      <p className="mt-5 max-w-xl text-xs leading-5 text-[#718374]">
        Your trip, thoughtfully organised. Explore each day, discover places
        worth visiting and keep your journey moving at your own pace.
      </p>
    </section>
  );
}
