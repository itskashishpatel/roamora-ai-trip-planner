
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  Compass,
  Globe2,
  Landmark,
  Plane,
  Send,
} from "lucide-react";

export const suggestions = [
  {
    label: "Create New Trip",
    icon: Globe2,
    color: "text-blue-500",
    prompt: "",
  },
  {
    label: "Inspire me where to go",
    icon: Plane,
    color: "text-green-500",
    prompt: "Suggest destinations for my next trip",
  },
  {
    label: "Discover Hidden gems",
    icon: Landmark,
    color: "text-orange-500",
    prompt: "Find hidden gems and less crowded destinations worth exploring",
  },
  {
    label: "Adventure Destinations",
    icon: Compass,
    color: "text-amber-500",
    prompt: "Suggest exciting adventure destinations and activities",
  },
];

export default function Hero() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const [tripPrompt, setTripPrompt] = useState("");

  const handleSubmit = () => {
    if (!isLoaded) return;

    const prompt = tripPrompt.trim();

    const destination = prompt
      ? `/create-new-trip?prompt=${encodeURIComponent(prompt)}`
      : "/create-new-trip";

    if (!isSignedIn) {
      router.push(
        `/sign-in?redirect_url=${encodeURIComponent(destination)}`
      );
      return;
    }

    router.push(destination);
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-8 sm:px-6">
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          Hey, I&apos;m your personal{" "}
          <span className="text-blue-500">Trip Planner</span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
          Tell me what you want, and I&apos;ll handle the rest: flights,
          hotels, and activities — all in seconds.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg sm:p-5">
        <label htmlFor="trip-prompt" className="sr-only">
          Describe your trip
        </label>

        <textarea
          id="trip-prompt"
          value={tripPrompt}
          onChange={(event) => setTripPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Create a trip to Paris from New York..."
          rows={4}
          className="w-full resize-y border-0 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0"
        />

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-gray-100 px-2 pt-4">
          {suggestions.map((suggestion) => {
            const Icon = suggestion.icon;

            return (
              <button
                key={suggestion.label}
                type="button"
                onClick={() => {
                  if (suggestion.label === "Create New Trip") {
                    handleSubmit();
                    return;
                  }

                  setTripPrompt(suggestion.prompt);
                }}
                className="inline-flex items-center gap-2 text-sm text-gray-700 transition-colors hover:text-blue-600"
              >
                <Icon className={`h-4 w-4 ${suggestion.color}`} />
                <span>{suggestion.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isLoaded}
            aria-label="Submit trip request"
            className="ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm transition-colors hover:bg-blue-600 disabled:cursor-wait disabled:opacity-60"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </section>

      <section className="mt-8 text-center">
        <p className="text-sm text-gray-600 sm:text-base">
          Not sure where to start?{" "}
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="font-semibold text-gray-900 hover:text-blue-600"
          >
            See how it works
          </button>
          <span className="ml-2" aria-hidden="true">
            ↓
          </span>
        </p>
      </section>

      <section
        id="how-it-works"
        className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
      >
        <video
          className="h-auto max-h-120 w-full object-cover"
          src="/home_screen.mp4"
          controls
          playsInline
          preload="metadata"
          aria-label="See how Roamora works"
        />
      </section>
    </main>
  );
}
