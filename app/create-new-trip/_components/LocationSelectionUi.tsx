"use client";

import { useState } from "react";
import { MapPin, ArrowUpRight, Search } from "lucide-react";

type LocationSelectionUiProps = {
  mode: "destination" | "source";
  data?: Record<string, unknown>;
  onSelect: (value: string) => void;
  disabled?: boolean;
};

const DEFAULT_DESTINATIONS = [
  "Goa, India",
  "Manali, India",
  "Jaipur, India",
  "Bali, Indonesia",
  "Dubai, UAE",
  "London, UK",
];

export default function LocationSelectionUi({
  mode,
  data = {},
  onSelect,
  disabled = false,
}: LocationSelectionUiProps) {
  const isDestination = mode === "destination";
  const [location, setLocation] = useState("");

  const options = Array.isArray(data.options)
    ? data.options.filter(
        (option): option is string =>
          typeof option === "string" && option.trim().length > 0
      )
    : isDestination
      ? DEFAULT_DESTINATIONS
      : [];

  function submitLocation(value = location) {
    const trimmed = value.trim();

    if (!trimmed || disabled) return;

    onSelect(trimmed);
    setLocation("");
  }

  return (
    <section className="mt-4 w-full max-w-2xl rounded-2xl border border-[#dce5dc] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ed] text-[#245542]">
          <MapPin className="h-5 w-5" />
        </span>

        <div>
          <p className="text-sm font-semibold text-[#173d30]">
            {isDestination ? "Choose a destination" : "Set your starting point"}
          </p>
          <p className="mt-1 text-xs text-[#819087]">
            {isDestination
              ? "Search for a place or select a suggestion."
              : "Enter the city or location you'll start from."}
          </p>
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitLocation();
        }}
        className="flex items-center gap-2 rounded-xl border border-[#dce5dc] bg-[#f8faf7] p-2 focus-within:border-[#71927b]"
      >
        <Search className="ml-2 h-4 w-4 shrink-0 text-[#819087]" />

        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          disabled={disabled}
          placeholder={
            isDestination
              ? "Search destination..."
              : "Enter your starting city..."
          }
          className="h-10 min-w-0 flex-1 bg-transparent px-1 text-sm text-[#263a2f] outline-none placeholder:text-[#96a198] disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={disabled || !location.trim()}
          className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[#194b39] px-4 text-sm font-semibold text-white transition hover:bg-[#123b2d] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </form>

      {isDestination && options.length > 0 && (
        <div className="mt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#819087]">
            Suggested places
          </p>

          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                disabled={disabled}
                onClick={() => submitLocation(option)}
                className="rounded-full border border-[#e3eae2] bg-[#f8faf7] px-3 py-2 text-sm text-[#315441] transition hover:border-[#71927b] hover:bg-[#edf3ed] disabled:opacity-50"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}