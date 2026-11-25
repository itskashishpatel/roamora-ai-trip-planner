import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  MapPin,
} from "lucide-react";
import { destinations, getDestination } from "@/data/destinations";

export function generateStaticParams() {
  return destinations.map((destination) => ({
    slug: destination.slug,
  }));
}

export default async function DestinationDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = getDestination(slug);

  if (!destination) notFound();

  const plannerPrompt = `Help me plan a trip to ${destination.name}, ${destination.country}. I am interested in ${destination.bestFor.join(", ")}. Suggest a practical itinerary and ask me for any missing trip details.`;

  return (
    <main className="min-h-screen bg-[#f7f8f3]">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <Link
          href="/#destinations"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#52665a] transition hover:text-[#194b39]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to destinations
        </Link>

        <section className="mt-6 overflow-hidden rounded-[2rem] bg-[#173d30]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-center p-7 text-white sm:p-10 lg:p-14">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
                Destination guide
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                {destination.name}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4" />
                {destination.country}
              </p>

              <p className="mt-6 text-xl font-medium leading-snug text-[#f3e8d7]">
                {destination.tagline}
              </p>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                {destination.description}
              </p>

              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#e9c69e]" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/65">
                    Best time to visit
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {destination.bestTime}
                  </p>
                </div>
              </div>

              <Link
                href={`/create-new-trip?prompt=${encodeURIComponent(plannerPrompt)}`}
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-[#f3e8d7] px-6 py-3 text-sm font-semibold text-[#173d30] transition hover:bg-white"
              >
                Plan a trip here
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative min-h-[320px] lg:min-h-[560px]">
              <Image
                src={destination.images[0]}
                alt={`${destination.name} travel scenery`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6a4b]">
              A closer look
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#173d30] sm:text-3xl">
              A few views to inspire your journey
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destination.images.map((image, index) => (
              <div
                key={image}
                className={`relative overflow-hidden rounded-2xl ${
                  index === 0
                    ? "h-72 sm:col-span-2 sm:h-96 lg:col-span-1"
                    : "h-72"
                }`}
              >
                <Image
                  src={image}
                  alt={`${destination.name} travel view ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-8 rounded-3xl border border-[#dce5dc] bg-white p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6a4b]">
              Travel inspiration
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#173d30]">
              What makes {destination.name} special?
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#68776e]">
              Use these ideas as a starting point. Your Roamora itinerary can
              be adjusted around your dates, travel pace and interests.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {destination.highlights.map((highlight) => (
              <div
                key={highlight}
                className="flex items-start gap-3 rounded-xl bg-[#f4f7f2] p-4"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#dce9dc] text-[#245542]">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <p className="text-sm leading-6 text-[#42594b]">
                  {highlight}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-[#e9efe6] p-6 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6a4b]">
            Your next step
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#173d30]">
            Ready to explore {destination.name}?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64746b]">
            Let Roamora turn your inspiration into a day-by-day travel plan.
          </p>
          <Link
            href={`/create-new-trip?prompt=${encodeURIComponent(plannerPrompt)}`}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#194b39] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#123b2d]"
          >
            Start planning
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}