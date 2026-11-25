
"use client";

import { CalendarDays, Check } from "lucide-react";

export type DayOption = {
  day: number;
  title: string;
};

type DaySelectorProps = {
  days: DayOption[];
  selectedDay: number;
  onSelect: (day: number) => void;
};

export default function DaySelector({
  days,
  selectedDay,
  onSelect,
}: DaySelectorProps) {
  if (days.length === 0) return null;

  return (
    <section className="rounded-2xl border border-[#dce5d9] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#174c38]">
            <CalendarDays className="h-4 w-4" />
            Your journey
          </div>
          <p className="mt-1 text-xs text-[#758579]">
            Select a day to explore its itinerary
          </p>
        </div>

        <span className="rounded-full bg-[#edf4eb] px-3 py-1 text-xs font-semibold text-[#245a40]">
          {days.length} {days.length === 1 ? "day" : "days"}
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {days.map((day, index) => {
          const active = selectedDay === index;
          const dayNumber = day.day || index + 1;

          return (
            <button
              key={`${dayNumber}-${index}`}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(index)}
              className={`group relative flex min-w-19 shrink-0 flex-col items-center rounded-xl border px-3 py-3 text-center transition-all duration-200 ${
                active
                  ? "border-[#174c38] bg-[#174c38] text-white shadow-md shadow-emerald-950/10"
                  : "border-[#e5eae2] bg-[#fafbf8] text-[#344b3d] hover:border-[#8ba994] hover:bg-[#f0f5ee]"
              }`}
            >
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${
                  active ? "text-white/70" : "text-[#87948a]"
                }`}
              >
                Day
              </span>

              <span className="mt-1 text-xl font-bold leading-none">
                {dayNumber}
              </span>

              <span
                className={`mt-2 max-w-17.5 truncate text-[10px] font-medium ${
                  active ? "text-white/80" : "text-[#718076]"
                }`}
                title={day.title}
              >
                {day.title || "Explore"}
              </span>

              {active && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#d7e7c9] text-[#174c38]">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
