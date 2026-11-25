
"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";

type OptionSelectionUiProps = {
  data?: Record<string, unknown>;
  onSelect: (value: string) => void;
  disabled?: boolean;
  heading: string;
  helper: string;
};

export default function OptionSelectionUi({
  data = {},
  onSelect,
  disabled = false,
  heading,
  helper,
}: OptionSelectionUiProps) {
  const options = useMemo(() => {
    if (!Array.isArray(data.options)) return [];

    const normalized = data.options
      .map((option) => {
        if (typeof option === "string") {
          return option.trim();
        }

        if (
          option &&
          typeof option === "object" &&
          "label" in option
        ) {
          const label = (option as { label: unknown }).label;
          return typeof label === "string" ? label.trim() : "";
        }

        return "";
      })
      .filter(Boolean);

    return Array.from(new Set(normalized)).slice(0, 20);
  }, [data.options]);

  const [selected, setSelected] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  function toggle(option: string) {
    if (disabled || confirmed) return;

    setSelected((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option]
    );
  }

  function confirmSelection() {
    if (
      disabled ||
      confirmed ||
      selected.length === 0
    ) {
      return;
    }

    setConfirmed(true);
    onSelect(selected.join(", "));
  }

  if (options.length === 0) return null;

  return (
    <section className="mt-4 w-full max-w-2xl rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
      <div>
        <h3 className="font-semibold text-foreground">
          {heading}
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          {helper}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              disabled={disabled || confirmed}
              aria-pressed={active}
              onClick={() => toggle(option)}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                active
                  ? "border-emerald-900 bg-emerald-900 text-white"
                  : "border-border bg-background hover:border-emerald-800/50 hover:bg-emerald-50/50"
              }`}
            >
              {active && <Check className="h-3.5 w-3.5" />}
              {option}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p
          className="text-xs text-muted-foreground"
          aria-live="polite"
        >
          {confirmed
            ? "Your selection has been submitted."
            : selected.length === 0
              ? "Select one or more options."
              : `${selected.length} selected`}
        </p>

        <button
          type="button"
          disabled={
            disabled ||
            confirmed ||
            selected.length === 0
          }
          onClick={confirmSelection}
          className="rounded-xl bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {confirmed ? "Confirmed" : "Confirm selection"}
        </button>
      </div>
    </section>
  );
}
