
"use client";

import { useState } from "react";
import { Minus, Plus, UsersRound } from "lucide-react";

type Props = {
  data?: Record<string, unknown>;
  onSelect: (value: string) => void;
  disabled?: boolean;
};

export default function TravellerCountUi({
  data = {},
  onSelect,
  disabled = false,
}: Props) {
  const [count, setCount] = useState(3);

  const heading =
    typeof data.heading === "string"
      ? data.heading
      : "How many people are travelling?";

  return (
    <section className="mt-4 w-full max-w-2xl rounded-2xl border border-[#dce5dc] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf3ed] text-[#245542]">
          <UsersRound className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-semibold text-[#173d30]">{heading}</h3>
          <p className="mt-1 text-sm text-[#819087]">
            Enter the total number of travellers.
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-7">
        <button
          type="button"
          disabled={disabled || count <= 1}
          onClick={() => setCount((value) => Math.max(1, value - 1))}
          aria-label="Decrease traveller count"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dce5dc] text-[#245542] hover:bg-[#edf3ed] disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="min-w-20 text-center">
          <p className="text-4xl font-semibold tabular-nums text-[#173d30]">
            {count}
          </p>
          <p className="mt-1 text-xs text-[#819087]">
            {count === 1 ? "traveller" : "travellers"}
          </p>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() => setCount((value) => value + 1)}
          aria-label="Increase traveller count"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dce5dc] text-[#245542] hover:bg-[#edf3ed] disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect(`${count} travellers`)}
        className="mt-6 w-full rounded-xl bg-[#194b39] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#123b2d] disabled:opacity-50"
      >
        Confirm travellers
      </button>
    </section>
  );
}
