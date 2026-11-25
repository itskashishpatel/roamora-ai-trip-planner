
"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";

type Props = {
  data?: Record<string, unknown>;
  onSelect: (value: string) => void;
  disabled?: boolean;
};

export default function TravelDatesUi({
  data = {},
  onSelect,
  disabled = false,
}: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const heading =
    typeof data.heading === "string"
      ? data.heading
      : "When would you like to travel?";

  const validRange =
    Boolean(startDate) &&
    Boolean(endDate) &&
    endDate >= startDate;

  return (
    <section className="mt-4 w-full max-w-2xl rounded-2xl border border-[#dce5dc] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ed] text-[#245542]">
          <CalendarDays className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-[#173d30]">{heading}</h3>
          <p className="mt-1 text-sm text-[#819087]">
            Choose your start and end dates.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-medium text-[#64746b]">
            Departure date
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            disabled={disabled}
            className="h-11 w-full rounded-xl border border-[#dce5dc] bg-[#f8faf7] px-3 text-sm text-[#263a2f] outline-none focus:border-[#71927b]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-medium text-[#64746b]">
            Return date
          </span>
          <input
            type="date"
            min={startDate || undefined}
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            disabled={disabled || !startDate}
            className="h-11 w-full rounded-xl border border-[#dce5dc] bg-[#f8faf7] px-3 text-sm text-[#263a2f] outline-none focus:border-[#71927b] disabled:opacity-50"
          />
        </label>
      </div>

      <button
        type="button"
        disabled={disabled || !validRange}
        onClick={() =>
          onSelect(`My travel dates are ${startDate} to ${endDate}.`)
        }
        className="mt-5 w-full rounded-xl bg-[#194b39] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#123b2d] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Confirm dates
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect("My travel dates are flexible.")}
        className="mt-3 w-full rounded-xl border border-[#dce5dc] px-5 py-3 text-sm font-medium text-[#315441] transition hover:bg-[#f4f7f2] disabled:opacity-50"
      >
        My dates are flexible
      </button>
    </section>
  );
}
