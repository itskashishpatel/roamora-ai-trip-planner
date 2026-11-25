import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, MapPin } from "lucide-react";
import { destinations } from "@/data/destinations";

export default function DestinationInspiration() {
  return (
    <main className="bg-[#f7f8f3]">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#245542]">
              <Compass className="h-3.5 w-3.5" />
              Your next somewhere
            </span>

            <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-[#173d30] sm:text-5xl lg:text-6xl">
              Find a place that feels like{" "}
              <span className="text-[#b56b3b]">you.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#64746b] sm:text-lg">
              From slow coastal mornings to mountain escapes, discover
              somewhere worth remembering. Roamora will help you turn the
              idea into a thoughtful travel plan.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/create-new-trip"
                className="inline-flex items-center gap-2 rounded-full bg-[#194b39] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123b2d]"
              >
                Start planning
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#destinations"
                className="inline-flex items-center rounded-full border border-[#cbd8ce] bg-white px-6 py-3 text-sm font-semibold text-[#245542] transition hover:bg-[#edf3ed]"
              >
                Explore destinations
              </a>
            </div>
          </div>

          <div className="relative min-h-[260px] overflow-hidden rounded-[2rem] bg-[#dce8dc] sm:min-h-[330px]">
            <Image
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=85"
              alt="A peaceful mountain lake surrounded by green mountains"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102d23]/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                A little inspiration
              </p>
              <p className="mt-2 max-w-sm text-2xl font-semibold sm:text-3xl">
                The best journeys begin with a feeling.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="destinations"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-20 sm:px-6 lg:px-8"
      >
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6a4b]">
              The Roamora collection
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#173d30] sm:text-3xl">
              Destinations to dream about
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#64746b]">
              Explore a few places worth adding to your travel wish list.
            </p>
          </div>

          <Link
            href="/create-new-trip"
            className="hidden items-center gap-2 text-sm font-semibold text-[#245542] hover:text-[#b56b3b] sm:inline-flex"
          >
            Plan something different
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination, index) => (
            <article
              key={destination.slug}
              className="group overflow-hidden rounded-[1.5rem] border border-[#dce5dc] bg-white shadow-[0_8px_30px_rgba(25,75,57,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(25,75,57,0.12)]"
            >
              <Link
                href={`/destinations/${destination.slug}`}
                className="block"
                aria-label={`View details about ${destination.name}`}
              >
                <div className="relative h-56 overflow-hidden sm:h-64">
                  <Image
                    src={destination.images[0]}
                    alt={`${destination.name}, ${destination.country}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-white/85">
                      <MapPin className="h-3.5 w-3.5" />
                      {destination.name}, {destination.country}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-snug sm:text-2xl">
                      {destination.tagline}
                    </h3>
                  </div>
                  <span className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </Link>

              <div className="p-5">
                <p className="line-clamp-2 min-h-12 text-sm leading-6 text-[#68776e]">
                  {destination.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {destination.bestFor.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#eff4ee] px-2.5 py-1 text-xs font-medium text-[#42624e]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 border-t border-[#edf1ec] pt-4">
                  <Link
                    href={`/destinations/${destination.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#194b39] transition group-hover:text-[#b56b3b]"
                  >
                    View destination
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 rounded-[2rem] bg-[#194b39] p-7 text-white sm:p-10 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
              Your journey, your way
            </p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
              Have somewhere else in mind?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
              Tell Roamora what kind of trip you want. We&apos;ll help shape
              the route, experiences and daily plan around you.
            </p>
          </div>

          <Link
            href="/create-new-trip"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#f4ead9] px-6 py-3 text-sm font-semibold text-[#194b39] transition hover:bg-white"
          >
            Start planning
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}