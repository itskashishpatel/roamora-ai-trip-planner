
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  MapPin,
  Compass,
  Hotel,
  Utensils,
  Ticket,
  Clock3,
  ArrowUpRight,
  LoaderCircle,
  Lightbulb,
  Bus,
} from "lucide-react";

import { Timeline } from "@/components/ui/timeline";
import DaySelector from "./DaySelector";
import TripOverview from "./TripOverview";
import RecommendationCard from "./RecommendationCard";

type DataRecord = Record<string, unknown>;

type NormalizedActivity = {
  name: string;
  description: string;
  time: string;
  location: string;
  ticketPrice: string;
  bestTime: string;
};

type NormalizedDay = {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  activities: NormalizedActivity[];
  food: string;
  transport: string;
  tips: string[];
};

function asRecord(value: unknown): DataRecord {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as DataRecord;
  }

  return {};
}

function asText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return "";
}

function firstText(record: DataRecord, keys: string[]): string {
  for (const key of keys) {
    const value = asText(record[key]).trim();

    if (value) return value;
  }

  return "";
}

function normalizeActivity(value: unknown): NormalizedActivity {
  const item = asRecord(value);

  const rawPrice = firstText(item, [
    "ticketPrice",
    "entryFee",
    "price",
    "cost",
  ]);

  const isFree =
    item.isFree === true ||
    item.free === true ||
    rawPrice.toLowerCase() === "free" ||
    rawPrice === "0";

  return {
    name: firstText(item, ["name", "title"]) || "Suggested experience",
    description: firstText(item, ["description", "details"]),
    time: firstText(item, ["time", "startTime", "timeOfDay"]),
    location: firstText(item, ["location", "address", "area"]),
    ticketPrice: isFree
      ? "Free entry"
      : rawPrice
        ? `Ticket: ${rawPrice}`
        : "",
    bestTime: firstText(item, [
      "bestTimeToVisit",
      "bestTime",
      "recommendedTime",
    ]),
  };
}

function normalizeDay(value: unknown, index: number): NormalizedDay {
  const item = asRecord(value);

  const rawActivities = Array.isArray(item.activities)
    ? item.activities
    : [];

  const rawTips = Array.isArray(item.tips) ? item.tips : [];

  return {
    day: typeof item.day === "number" ? item.day : index + 1,
    title: firstText(item, ["title", "name"]) || `Explore Day ${index + 1}`,
    morning: asText(item.morning),
    afternoon: asText(item.afternoon),
    evening: asText(item.evening),
    activities: rawActivities.map(normalizeActivity),
    food: asText(item.food),
    transport: asText(item.transport),
    tips: rawTips.map(asText).filter(Boolean),
  };
}

function getRecommendationItems(value: unknown): DataRecord[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is DataRecord =>
      Boolean(item && typeof item === "object" && !Array.isArray(item)),
  );
}

function recommendationText(item: DataRecord, keys: string[]): string {
  return firstText(item, keys);
}

function getMapUrl(destination: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    destination,
  )}`;
}

function ActivityContent({
  activity,
}: {
  activity: NormalizedActivity;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#e1e8dd] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#203d2d]">
            {activity.name}
          </h3>

          {activity.location && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#748276]">
              <MapPin className="h-3.5 w-3.5" />
              {activity.location}
            </p>
          )}
        </div>

        {activity.time && (
          <span className="shrink-0 rounded-full bg-[#edf4eb] px-3 py-1.5 text-[10px] font-semibold text-[#315c41]">
            {activity.time}
          </span>
        )}
      </div>

      {activity.description && (
        <p className="mt-3 text-sm leading-6 text-[#6c7b70]">
          {activity.description}
        </p>
      )}

      {(activity.ticketPrice || activity.bestTime) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {activity.ticketPrice && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f0f5eb] px-2.5 py-1.5 text-[10px] font-semibold text-[#356548]">
              <Ticket className="h-3.5 w-3.5" />
              {activity.ticketPrice}
            </span>
          )}

          {activity.bestTime && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#fff5e6] px-2.5 py-1.5 text-[10px] font-semibold text-[#8b622b]">
              <Clock3 className="h-3.5 w-3.5" />
              Best time: {activity.bestTime}
            </span>
          )}
        </div>
      )}
    </article>
  );
}

function EmptyRecommendation({
  type,
}: {
  type: "hotel" | "restaurant";
}) {
  const isHotel = type === "hotel";

  return (
    <RecommendationCard
      type={type}
      title={
        isHotel
          ? "Verified stays coming soon"
          : "Local dining discoveries coming soon"
      }
      description={
        isHotel
          ? "Hotel listings, ratings and nightly prices will appear when a verified accommodation source is connected."
          : "Restaurant listings, ratings, cuisine and price information will appear when a verified places source is connected."
      }
      placeholder
      imageUrl={
        isHotel
          ? "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=85"
          : "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85"
      }
    />
  );
}

export default function Itinerary() {
  const trips = useQuery(api.tripDetail.getMyTrips, {});

  const [pageOpenedAt, setPageOpenedAt] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);

  // Record the time when this component mounts.
  // requestAnimationFrame avoids setting state synchronously inside the effect.
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setPageOpenedAt(Date.now());
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  // Only show a trip created during this planning session.
  const currentTrip =
    trips && pageOpenedAt !== null
      ? trips.find((trip) => trip.createdAt >= pageOpenedAt)
      : undefined;

  const description = asRecord(currentTrip?.tripDescription);

  const rawDays = Array.isArray(description.days)
    ? description.days
    : [];

  const days = rawDays.map(normalizeDay);

  // Keep the selected day within the available range.
  const activeDayIndex = Math.min(
    selectedDay,
    Math.max(days.length - 1, 0),
  );

  const activeDay = days[activeDayIndex];

  const tripName = currentTrip?.tripName || "Your trip itinerary";

  const source = firstText(description, ["source", "origin", "from"]);

  const destination = firstText(description, ["destination", "to"]);

  const duration =
    typeof description.duration === "number"
      ? description.duration
      : days.length;

  const dates = firstText(description, [
    "travelDates",
    "dates",
    "dateRange",
  ]);

  const groupSize = firstText(description, [
    "groupSize",
    "travellers",
    "travelers",
  ]);

  const budget = firstText(description, ["budget", "travelStyle"]);

  const hotels = getRecommendationItems(description.hotels);
  const restaurants = getRecommendationItems(description.restaurants);
  const attractions = getRecommendationItems(description.attractions);

  const allActivities = days.flatMap((day) =>
    day.activities.map((activity) => ({
      ...activity,
      day: day.day,
    })),
  );

  const activitiesWithTicketInfo = allActivities.filter(
    (activity) => activity.ticketPrice || activity.bestTime,
  );

  const timelineEntries = activeDay
    ? activeDay.activities.length > 0
      ? activeDay.activities.map((activity, index) => ({
          title: activity.time || `Experience ${index + 1}`,
          content: <ActivityContent activity={activity} />,
        }))
      : (
          [
            ["Morning", activeDay.morning],
            ["Afternoon", activeDay.afternoon],
            ["Evening", activeDay.evening],
          ] as const
        )
          .filter(([, content]) => Boolean(content))
          .map(([period, content]) => ({
            title: period,
            content: (
              <article className="rounded-2xl border border-[#e1e8dd] bg-white p-4 shadow-sm sm:p-5">
                <p className="text-sm leading-7 text-[#68796d]">
                  {content}
                </p>
              </article>
            ),
          }))
    : [];

  if (trips === undefined || pageOpenedAt === null) {
    return (
      <div className="flex h-full min-h-155 items-center justify-center rounded-2xl bg-[#f8faf5]">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-7 w-7 animate-spin text-[#356548]" />
          <p className="mt-3 text-sm text-[#718174]">
            Preparing your trip dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <div className="flex h-full min-h-155 flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#e0e8dc] bg-[#f7f9f3] px-6 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e7efe2] text-[#28563c]">
          <Compass className="h-8 w-8" />
        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#61806a]">
          Your journey starts here
        </p>

        <h2 className="mt-2 max-w-sm text-2xl font-bold tracking-tight text-[#1c3e2c]">
          Your itinerary will appear here
        </h2>

        <p className="mt-3 max-w-sm text-sm leading-6 text-[#788579]">
          Start planning with Roamora. Once your AI-generated itinerary is
          ready and saved, your day-by-day dashboard will appear here.
        </p>

        <div className="mt-8 grid w-full max-w-sm grid-cols-3 gap-2">
          {[
            { icon: CalendarDaysIcon, label: "Day plans" },
            { icon: Hotel, label: "Stays" },
            { icon: MapPin, label: "Places" },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-[#e0e8dc] bg-white p-3"
              >
                <Icon className="mx-auto h-5 w-5 text-[#5c7d62]" />
                <p className="mt-2 text-[10px] font-semibold text-[#6e7e70]">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <div className="space-y-4 rounded-2xl bg-[#f8faf5] p-3 sm:p-4">
        <TripOverview
          tripName={tripName}
          source={source}
          destination={destination}
          duration={duration}
          dates={dates}
          groupSize={groupSize}
          budget={budget}
          tripId={currentTrip.tripId}
        />

        {days.length > 0 && (
          <>
            <DaySelector
              days={days.map((day) => ({
                day: day.day,
                title: day.title,
              }))}
              selectedDay={activeDayIndex}
              onSelect={setSelectedDay}
            />

            <section className="rounded-2xl border border-[#e1e8dd] bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#64806a]">
                  Your selected day
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#203d2d]">
                  Day {activeDay?.day}: {activeDay?.title}
                </h2>

                <p className="mt-1 text-xs text-[#839084]">
                  Follow your day at a comfortable pace.
                </p>
              </div>

              {timelineEntries.length > 0 ? (
                <Timeline data={timelineEntries} />
              ) : (
                <div className="rounded-xl bg-[#f5f7f1] p-5 text-sm leading-6 text-[#788579]">
                  Detailed activities have not been added for this day yet.
                </div>
              )}

              {activeDay?.food && (
                <div className="mt-5 rounded-xl border border-[#e5eade] bg-[#f8faf5] p-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-[#315640]">
                    <Utensils className="h-4 w-4" />
                    Food ideas
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#718174]">
                    {activeDay.food}
                  </p>
                </div>
              )}

              {activeDay?.transport && (
                <div className="mt-3 rounded-xl border border-[#e5eade] bg-[#f8faf5] p-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-[#315640]">
                    <Bus className="h-4 w-4" />
                    Getting around
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#718174]">
                    {activeDay.transport}
                  </p>
                </div>
              )}

              {activeDay?.tips && activeDay.tips.length > 0 && (
                <div className="mt-3 rounded-xl border border-[#eee3c9] bg-[#fffaf0] p-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-[#805d2c]">
                    <Lightbulb className="h-4 w-4" />
                    Local travel tips
                  </h3>

                  <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-5 text-[#8a795e]">
                    {activeDay.tips.map((tip, index) => (
                      <li key={`${index}-${tip}`}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </>
        )}

        {destination && (
          <section className="overflow-hidden rounded-2xl border border-[#e1e8dd] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-base font-bold text-[#203d2d]">
                  <MapPin className="h-4 w-4 text-[#477452]" />
                  Explore the destination
                </h2>
                <p className="mt-1 text-xs text-[#7a887c]">
                  Find places and directions around {destination}.
                </p>
              </div>

              <a
                href={getMapUrl(destination)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#174c38] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#235b43]"
              >
                Open map
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="mt-4 flex min-h-28 items-center justify-center rounded-xl border border-dashed border-[#cbd9c6] bg-[radial-gradient(circle_at_20%_30%,#e4edde,transparent_35%),radial-gradient(circle_at_80%_70%,#e6eddf,transparent_35%),#f5f8f1] p-5 text-center">
              <div>
                <MapPin className="mx-auto h-6 w-6 text-[#52785b]" />
                <p className="mt-2 text-sm font-semibold text-[#315640]">
                  {destination}
                </p>
                <p className="mt-1 text-[10px] text-[#849084]">
                  Map preview and route data can be connected in the next
                  phase.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-[#e1e8dd] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-base font-bold text-[#203d2d]">
                <Hotel className="h-4 w-4 text-[#477452]" />
                Recommended stays
              </h2>
              <p className="mt-1 text-xs text-[#7a887c]">
                Accommodation options around your destination.
              </p>
            </div>
            <span className="rounded-full bg-[#edf4eb] px-2.5 py-1 text-[10px] font-semibold text-[#356548]">
              Hotels
            </span>
          </div>

          {hotels.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {hotels.map((hotel, index) => (
                <RecommendationCard
                  key={`hotel-${index}`}
                  type="hotel"
                  title={
                    recommendationText(hotel, ["name", "title"]) ||
                    "Accommodation"
                  }
                  description={recommendationText(hotel, [
                    "description",
                    "summary",
                  ])}
                  imageUrl={recommendationText(hotel, [
                    "imageUrl",
                    "image",
                    "photo",
                  ])}
                  location={recommendationText(hotel, [
                    "location",
                    "address",
                  ])}
                  rating={recommendationText(hotel, ["rating"])}
                  price={recommendationText(hotel, [
                    "price",
                    "pricePerNight",
                  ])}
                  href={recommendationText(hotel, ["url", "website"])}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <EmptyRecommendation type="hotel" />
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#e1e8dd] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-base font-bold text-[#203d2d]">
                <Utensils className="h-4 w-4 text-[#477452]" />
                Local food & restaurants
              </h2>
              <p className="mt-1 text-xs text-[#7a887c]">
                Places to eat and local flavours to discover.
              </p>
            </div>
            <span className="rounded-full bg-[#fff3e6] px-2.5 py-1 text-[10px] font-semibold text-[#93652e]">
              Dining
            </span>
          </div>

          {restaurants.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {restaurants.map((restaurant, index) => (
                <RecommendationCard
                  key={`restaurant-${index}`}
                  type="restaurant"
                  title={
                    recommendationText(restaurant, ["name", "title"]) ||
                    "Restaurant"
                  }
                  description={recommendationText(restaurant, [
                    "description",
                    "cuisine",
                  ])}
                  imageUrl={recommendationText(restaurant, [
                    "imageUrl",
                    "image",
                    "photo",
                  ])}
                  location={recommendationText(restaurant, [
                    "location",
                    "address",
                  ])}
                  rating={recommendationText(restaurant, ["rating"])}
                  price={recommendationText(restaurant, [
                    "price",
                    "priceRange",
                  ])}
                  href={recommendationText(restaurant, ["url", "website"])}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <EmptyRecommendation type="restaurant" />
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#e1e8dd] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <h2 className="flex items-center gap-2 text-base font-bold text-[#203d2d]">
              <Ticket className="h-4 w-4 text-[#477452]" />
              Attractions & entry information
            </h2>
            <p className="mt-1 text-xs text-[#7a887c]">
              Ticket prices and visiting times are shown only when supplied
              in the itinerary.
            </p>
          </div>

          {attractions.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {attractions.map((attraction, index) => (
                <RecommendationCard
                  key={`attraction-${index}`}
                  type="attraction"
                  title={
                    recommendationText(attraction, ["name", "title"]) ||
                    "Attraction"
                  }
                  description={recommendationText(attraction, [
                    "description",
                  ])}
                  imageUrl={recommendationText(attraction, [
                    "imageUrl",
                    "image",
                    "photo",
                  ])}
                  location={recommendationText(attraction, [
                    "location",
                    "address",
                  ])}
                  price={recommendationText(attraction, [
                    "ticketPrice",
                    "entryFee",
                    "price",
                  ])}
                  bestTime={recommendationText(attraction, [
                    "bestTimeToVisit",
                    "bestTime",
                  ])}
                  href={recommendationText(attraction, ["url", "website"])}
                />
              ))}
            </div>
          ) : activitiesWithTicketInfo.length > 0 ? (
            <div className="space-y-2">
              {activitiesWithTicketInfo.map((activity, index) => (
                <div
                  key={`${activity.name}-${index}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f6f8f3] p-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#315640]">
                      {activity.name}
                    </p>
                    <p className="mt-1 text-[10px] text-[#849084]">
                      Day {activity.day}
                      {activity.bestTime
                        ? ` · Best time: ${activity.bestTime}`
                        : ""}
                    </p>
                  </div>

                  {activity.ticketPrice && (
                    <span className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-[#356548]">
                      {activity.ticketPrice}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#d8e2d3] bg-[#f8faf5] p-4">
              <p className="text-sm font-semibold text-[#45664d]">
                Ticket information is not available yet
              </p>
              <p className="mt-1 text-xs leading-5 text-[#849084]">
                We will show free-entry details, ticket prices and official
                booking links when reliable information is connected.
              </p>
            </div>
          )}
        </section>

        <div className="rounded-xl bg-[#edf3e9] p-4 text-center">
          <p className="text-xs leading-5 text-[#58705c]">
            Your itinerary is saved to your Roamora account.
          </p>
          <Link
            href={`/trips/${currentTrip.tripId}`}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#24563b] hover:underline"
          >
            Open full trip details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function CalendarDaysIcon({
  className,
}: {
  className?: string;
}) {
  return <Clock3 className={className} />;
}
