
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ArrowLeft,
  ArrowRight,
  Bus,
  CalendarDays,
  Clock3,
  Coffee,
  Fuel,
  Hotel,
  Lightbulb,
  MapPin,
  Navigation,
  Ticket,
  Utensils,
  Waves,
  Toilet,
} from "lucide-react";

type Activity = {
  name?: string;
  description?: string;
  time?: string;
  location?: string;
};

type ItineraryDay = {
  day?: number;
  title?: string;
  morning?: string;
  afternoon?: string;
  evening?: string;
  activities?: Activity[];
  food?: string;
  transport?: string;
  tips?: string[];
};

type TripDescription = {
  source?: string;
  destination?: string;
  duration?: number;
  summary?: string;
  travelDates?:
    | string
    | {
        startDate: string | null;
        endDate: string | null;
      };
  dates?: string;
  travelParty?: string;
  travellerCount?: number;
  travelStyle?: string;
  days?: ItineraryDay[];
};

function asText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return "";
}

function mapsSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function googleSearch(query: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

const nearbyOptions = [
  {
    label: "Restaurants",
    description: "Find places to eat nearby",
    icon: Utensils,
    query: "restaurants",
  },
  {
    label: "Hotels",
    description: "Explore nearby stays",
    icon: Hotel,
    query: "hotels",
  },
  {
    label: "Fuel stations",
    description: "Find petrol pumps",
    icon: Fuel,
    query: "fuel stations",
  },
  {
    label: "Restrooms",
    description: "Find public toilets",
    icon: Toilet,
    query: "public restrooms",
  },
  {
    label: "Attractions",
    description: "Explore nearby places",
    icon: CompassIcon,
    query: "tourist attractions",
  },
];

function CompassIcon({ className }: { className?: string }) {
  return <Navigation className={className} />;
}

export default function TripDetailsPage() {
  const params = useParams<{ tripId: string }>();

  const trip = useQuery(api.tripDetail.getTripById, {
    tripId: params.tripId,
  });

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (trip === undefined) {
    return (
      <main className="min-h-[70vh] bg-[#f7f8f3] px-4 py-16">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-8 w-52 rounded bg-[#e1e9df]" />
          <div className="mt-7 h-48 rounded-3xl bg-white" />
          <div className="mt-6 h-96 rounded-3xl bg-white" />
        </div>
      </main>
    );
  }

  if (!trip) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f7f8f3] px-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e9efe6] text-[#245542]">
          <MapPin className="h-8 w-8" />
        </div>

        <h1 className="mt-5 text-2xl font-semibold text-[#173d30]">
          We couldn&apos;t find this trip
        </h1>

        <p className="mt-2 max-w-md text-sm leading-6 text-[#64746b]">
          This trip may not exist or may not belong to your account.
        </p>

        <Link
          href="/my-trips"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#194b39] px-5 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Trips
        </Link>
      </main>
    );
  }

  const data = (trip.tripDescription ?? {}) as TripDescription;
  const days = Array.isArray(data.days) ? data.days : [];

  const destination =
    asText(data.destination) || "Your destination";

  const duration =
    typeof data.duration === "number"
      ? data.duration
      : days.length;

  const summary = asText(data.summary) || trip.tripName;
  const dates =
  typeof data.travelDates === "string"
    ? data.travelDates
    : data.travelDates
      ? data.travelDates.startDate && data.travelDates.endDate
        ? `${data.travelDates.startDate} – ${data.travelDates.endDate}`
        : "Flexible dates"
      : asText(data.dates);

  const selectedDay = days[selectedDayIndex] ?? days[0];

  // Derived directly instead of using useMemo after conditional returns.
  const dayPlaces = selectedDay
    ? (selectedDay.activities ?? [])
        .map((activity) => ({
          name: asText(activity.name),
          location: asText(activity.location),
        }))
        .filter(
          (activity) => activity.name || activity.location,
        )
    : [];

  const mapQuery = [
    destination,
    ...dayPlaces.map(
      (place) => place.location || place.name,
    ),
  ]
    .filter(Boolean)
    .join(", ");

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    mapQuery || destination,
  )}&output=embed`;

  const nearbyReference = dayPlaces
    .map((place) => place.location || place.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");

  return (
    <main className="min-h-screen bg-[#f7f8f3]">
      <div className="mx-auto max-w-360 px-3 py-5 sm:px-6 lg:px-8">
        <Link
          href="/my-trips"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#64746b] transition hover:text-[#194b39]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Trips
        </Link>

        {/* Trip overview */}
        <header className="mt-5 overflow-hidden rounded-3xl border border-[#dce5dc] bg-white p-5 shadow-sm sm:p-7 lg:p-9">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6a4b]">
                Your Roamora itinerary
              </p>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#173d30] sm:text-3xl lg:text-4xl">
                {trip.tripName}
              </h1>

              <p className="mt-3 text-sm leading-7 text-[#64746b] sm:text-base">
                {summary}
              </p>
            </div>

            <Link
              href="/create-new-trip"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#194b39] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#123b2d]"
            >
              Plan another trip
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#edf3ed] px-3 py-2 text-xs font-medium text-[#245542]">
              <MapPin className="h-3.5 w-3.5" />
              {destination}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-[#edf3ed] px-3 py-2 text-xs font-medium text-[#245542]">
              <CalendarDays className="h-3.5 w-3.5" />
              {duration} {duration === 1 ? "day" : "days"}
            </span>

            {dates && (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#edf3ed] px-3 py-2 text-xs font-medium text-[#245542]">
                <Clock3 className="h-3.5 w-3.5" />
                {dates}
              </span>
            )}

              {data.travelParty && (
                   <span className="rounded-full bg-[#edf3ed] px-3 py-2 text-xs font-medium capitalize text-[#245542]">
                {data.travelParty}
                 {data.travellerCount
                ? ` · ${data.travellerCount} ${
                 data.travellerCount === 1 ? "traveller" : "travellers"
              }`
           : ""}
  </span>
)}
          </div>
        </header>

        {days.length === 0 ? (
          <section className="mt-6 rounded-3xl border border-[#dce5dc] bg-white p-7">
            <h2 className="font-semibold text-[#173d30]">
              Daily itinerary unavailable
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#64746b]">
              This saved trip does not contain daily plans. You can return to
              My Trips or create another itinerary.
            </p>
          </section>
        ) : (
          <>
            {/* Compact day selector */}
            <section className="mt-6 rounded-3xl border border-[#dce5dc] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6a4b]">
                    Your journey
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-[#173d30]">
                    Choose a day to explore
                  </h2>
                </div>

                <span className="text-xs text-[#819087]">
                  {days.length} days planned
                </span>
              </div>

              <div className="roamora-day-scroll mt-4 flex gap-2 overflow-x-auto pb-1">
                {days.map((day, index) => {
                  const active = index === selectedDayIndex;

                  return (
                    <button
                      key={`day-${day.day ?? index + 1}`}
                      type="button"
                      onClick={() => setSelectedDayIndex(index)}
                      aria-pressed={active}
                      className={`min-w-26.25 shrink-0 rounded-2xl border px-4 py-3 text-left transition sm:min-w-[125px] ${
                        active
                          ? "border-[#194b39] bg-[#194b39] text-white shadow-sm"
                          : "border-[#dce5dc] bg-[#fbfcfa] text-[#42594b] hover:border-[#8ba995] hover:bg-[#f1f5ef]"
                      }`}
                    >
                      <span
                        className={`block text-[10px] font-semibold uppercase tracking-[0.16em] ${
                          active ? "text-white/65" : "text-[#8a978e]"
                        }`}
                      >
                        Day
                      </span>
                      <span className="mt-1 block text-xl font-semibold">
                        {day.day ?? index + 1}
                      </span>
                      <span
                        className={`mt-1 block max-w-28.75 truncate text-xs ${
                          active ? "text-white/80" : "text-[#718077]"
                        }`}
                      >
                        {asText(day.title) || "Explore"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Selected day dashboard */}
            {selectedDay && (
              <section className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
                {/* Day agenda */}
                <div className="min-w-0 rounded-3xl border border-[#dce5dc] bg-white p-5 shadow-sm sm:p-7">
                  <div className="border-b border-[#edf1ec] pb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6a4b]">
                      Selected day · Day {selectedDay.day ?? selectedDayIndex + 1}
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold text-[#173d30]">
                      {asText(selectedDay.title) ||
                        `Explore ${destination}`}
                    </h2>

                    <p className="mt-2 text-sm text-[#718077]">
                      Your plan for the day, organised by time.
                    </p>
                  </div>

                  <div className="mt-5 space-y-4">
                    {([
                      {
                        period: "Morning",
                        description: selectedDay.morning,
                        icon: Coffee,
                        time: "Start your day",
                      },
                      {
                        period: "Afternoon",
                        description: selectedDay.afternoon,
                        icon: Waves,
                        time: "Explore and experience",
                      },
                      {
                        period: "Evening",
                        description: selectedDay.evening,
                        icon: CompassIcon,
                        time: "Wind down",
                      },
                    ] as const).map((item) => {
                      const Icon = item.icon;

                      return (
                        <article
                          key={item.period}
                          className="grid gap-3 rounded-2xl bg-[#f7f9f5] p-4 sm:grid-cols-[125px_1fr] sm:p-5"
                        >
                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-[#245542]">
                              <Icon className="h-4 w-4" />
                              {item.period}
                            </div>
                            <p className="mt-1 text-xs text-[#8a978e]">
                              {item.time}
                            </p>
                          </div>

                          <p className="whitespace-pre-wrap text-sm leading-7 text-[#596b60]">
                            {asText(item.description) ||
                              "No details have been added for this period."}
                          </p>
                        </article>
                      );
                    })}
                  </div>

                  {/* Activities */}
                  {dayPlaces.length > 0 && (
                    <section className="mt-7">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6a4b]">
                            Places and experiences
                          </p>
                          <h3 className="mt-1 text-lg font-semibold text-[#173d30]">
                            Stops for today
                          </h3>
                        </div>
                        <span className="text-xs text-[#819087]">
                          {dayPlaces.length} places
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        {(selectedDay.activities ?? []).map(
                          (activity, index) => (
                            <article
                              key={`${activity.name ?? "activity"}-${index}`}
                              className="flex gap-3 rounded-2xl border border-[#e7ece5] p-4"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf3ed] text-[#245542]">
                                <MapPin className="h-4 w-4" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                  <h4 className="text-sm font-semibold text-[#263a2f]">
                                    {asText(activity.name) ||
                                      "Suggested experience"}
                                  </h4>

                                  {activity.time && (
                                    <span className="rounded-full bg-[#edf3ed] px-2.5 py-1 text-[11px] font-medium text-[#42624e]">
                                      {activity.time}
                                    </span>
                                  )}
                                </div>

                                {activity.description && (
                                  <p className="mt-1 text-sm leading-6 text-[#718077]">
                                    {activity.description}
                                  </p>
                                )}

                                {activity.location && (
                                  <p className="mt-2 flex items-center gap-1.5 text-xs text-[#819087]">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {activity.location}
                                  </p>
                                )}

                                <a
                                  href={mapsSearch(
                                    `${activity.name ?? ""} ${activity.location ?? destination}`,
                                  )}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#245542] hover:underline"
                                >
                                  View on Google Maps
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </a>
                              </div>
                            </article>
                          ),
                        )}
                      </div>
                    </section>
                  )}

                  {/* Food and transport */}
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {selectedDay.food && (
                      <article className="rounded-2xl border border-[#e7ece5] p-4">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#245542]">
                          <Utensils className="h-4 w-4" />
                          Food ideas
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[#718077]">
                          {selectedDay.food}
                        </p>
                      </article>
                    )}

                    {selectedDay.transport && (
                      <article className="rounded-2xl border border-[#e7ece5] p-4">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#245542]">
                          <Bus className="h-4 w-4" />
                          Getting around
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[#718077]">
                          {selectedDay.transport}
                        </p>
                      </article>
                    )}
                  </div>

                  {/* Tips */}
                  {Array.isArray(selectedDay.tips) &&
                    selectedDay.tips.length > 0 && (
                      <section className="mt-5 rounded-2xl border border-[#eadfc9] bg-[#fbf7ee] p-4">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#765b35]">
                          <Lightbulb className="h-4 w-4" />
                          Helpful travel notes
                        </h3>
                        <ul className="mt-2 space-y-2">
                          {selectedDay.tips.map((tip, index) => (
                            <li
                              key={index}
                              className="text-sm leading-6 text-[#786b58]"
                            >
                              • {tip}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                </div>

                {/* Map and nearby places */}
                <aside className="min-w-0 space-y-5">
                  <section className="overflow-hidden rounded-3xl border border-[#dce5dc] bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-3 p-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6a4b]">
                          Explore the area
                        </p>
                        <h2 className="mt-1 text-lg font-semibold text-[#173d30]">
                          Day {selectedDay.day ?? selectedDayIndex + 1} map
                        </h2>
                        <p className="mt-1 text-xs text-[#819087]">
                          {destination}
                        </p>
                      </div>

                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ed] text-[#245542]">
                        <Navigation className="h-5 w-5" />
                      </span>
                    </div>

                    <div className="relative aspect-4/3 w-full bg-[#e8eee6]">
                      <iframe
                        title={`Map for day ${selectedDay.day ?? selectedDayIndex + 1} in ${destination}`}
                        src={mapEmbedUrl}
                        className="absolute inset-0 h-full w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>

                    <div className="p-4">
                      <a
                        href={mapsSearch(mapQuery || destination)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#194b39] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#123b2d]"
                      >
                        Open full map
                        <ArrowRight className="h-4 w-4" />
                      </a>
                      <p className="mt-2 text-center text-[11px] leading-5 text-[#8a978e]">
                        Map results are provided by Google Maps. Check routes
                        and local conditions before travelling.
                      </p>
                    </div>
                  </section>

                  <section className="rounded-3xl border border-[#dce5dc] bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6a4b]">
                      Around your day
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-[#173d30]">
                      Nearby essentials
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-[#819087]">
                      Search around {nearbyReference || destination}.
                    </p>

                    <div className="mt-4 space-y-2">
                      {nearbyOptions.map((option) => {
                        const Icon = option.icon;
                        const searchTerm = `${option.query} near ${
                          nearbyReference || destination
                        }`;

                        return (
                          <a
                            key={option.label}
                            href={mapsSearch(searchTerm)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 rounded-xl border border-[#edf1ec] p-3 transition hover:border-[#a9c0ac] hover:bg-[#f7f9f5]"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#edf3ed] text-[#245542]">
                              <Icon className="h-4 w-4" />
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-semibold text-[#33483b]">
                                {option.label}
                              </span>
                              <span className="mt-0.5 block text-xs text-[#819087]">
                                {option.description}
                              </span>
                            </span>

                            <ArrowRight className="h-4 w-4 shrink-0 text-[#819087]" />
                          </a>
                        );
                      })}
                    </div>
                  </section>

                  <section className="rounded-3xl border border-[#dce5dc] bg-[#eaf0e7] p-5">
                    <div className="flex items-center gap-2 text-[#245542]">
                      <Ticket className="h-5 w-5" />
                      <h2 className="font-semibold">Tickets and entry</h2>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-[#64746b]">
                      Check current entry fees, ticket availability and
                      official booking information for attractions in{" "}
                      {destination}.
                    </p>

                    <a
                      href={googleSearch(
                        `official attraction tickets entry fees ${destination}`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#194b39] hover:underline"
                    >
                      Search ticket information
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </section>
                </aside>
              </section>
            )}

            {/* Day navigation */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  setSelectedDayIndex((current) =>
                    Math.max(0, current - 1),
                  )
                }
                disabled={selectedDayIndex === 0}
                className="rounded-full border border-[#dce5dc] bg-white px-4 py-2.5 text-sm font-semibold text-[#42594b] transition hover:bg-[#edf3ed] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous day
              </button>

              <span className="text-xs text-[#819087]">
                {selectedDayIndex + 1} of {days.length}
              </span>

              <button
                type="button"
                onClick={() =>
                  setSelectedDayIndex((current) =>
                    Math.min(days.length - 1, current + 1),
                  )
                }
                disabled={selectedDayIndex === days.length - 1}
                className="inline-flex items-center gap-2 rounded-full bg-[#194b39] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123b2d] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next day
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
