
"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

type TripDurationUiProps = {
  data?: Record<string, unknown>;
  onConfirm: (days: number) => void;
  disabled?: boolean;
};

export default function TripDurationUi({
  data = {},
  onConfirm,
  disabled = false,
}: TripDurationUiProps) {
  const initialValue =
    typeof data.initialDays === "number" &&
    Number.isSafeInteger(data.initialDays) &&
    data.initialDays >= 1
      ? data.initialDays
      : 1;

  const [days, setDays] = useState(initialValue);
  const [confirmed, setConfirmed] = useState(false);

  const confirmLabel =
    typeof data.confirmLabel === "string"
      ? data.confirmLabel
      : "Confirm duration";

  function decreaseDays() {
    setDays((current) => Math.max(1, current - 1));
  }

  function increaseDays() {
    setDays((current) =>
      current < Number.MAX_SAFE_INTEGER ? current + 1 : current
    );
  }

  function confirmDuration() {
    if (
      disabled ||
      confirmed ||
      !Number.isSafeInteger(days) ||
      days < 1
    ) {
      return;
    }

    setConfirmed(true);
    onConfirm(days);
  }

  return (
    <section className="mt-4 w-full max-w-2xl rounded-2xl border border-emerald-900/10 bg-[#f5f4e9] p-3 shadow-sm dark:bg-card">
      <div className="rounded-xl bg-white px-4 py-6 text-center shadow-sm dark:bg-background">
        <h3 className="text-sm font-semibold text-foreground">
          How many days do you want to explore?
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Adjust the duration to match your travel plans.
        </p>

        <div className="mt-5 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={decreaseDays}
            disabled={disabled || confirmed || days <= 1}
            aria-label="Decrease trip duration"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-900/15 bg-white text-emerald-950 transition-colors hover:bg-emerald-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-muted dark:text-foreground"
          >
            <Minus className="h-4 w-4" />
          </button>

          <div className="min-w-28" aria-live="polite" aria-atomic="true">
            <p className="text-3xl font-bold tracking-tight text-emerald-950 dark:text-foreground">
              {days}
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              {days === 1 ? "Day" : "Days"}
            </p>
          </div>

          <button
            type="button"
            onClick={increaseDays}
            disabled={
              disabled ||
              confirmed ||
              days >= Number.MAX_SAFE_INTEGER
            }
            aria-label="Increase trip duration"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-900/15 bg-white text-emerald-950 transition-colors hover:bg-emerald-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-muted dark:text-foreground"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={confirmDuration}
          disabled={disabled || confirmed}
          className="mt-6 rounded-xl bg-emerald-900 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {confirmed ? "Confirmed" : confirmLabel}
        </button>
      </div>
    </section>
  );
}
