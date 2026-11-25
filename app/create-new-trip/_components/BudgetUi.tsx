
"use client";

import { Coins, Wallet, Gem } from "lucide-react";

type Props = {
  data?: Record<string, unknown>;
  onSelect: (value: string) => void;
  disabled?: boolean;
};

const options = [
  {
    title: "Budget-friendly",
    description: "Keep costs low and explore affordably.",
    value: "low",
    icon: Coins,
  },
  {
    title: "Balanced",
    description: "A comfortable mix of value and experiences.",
    value: "moderate",
    icon: Wallet,
  },
  {
    title: "Luxury",
    description: "Enjoy premium stays and experiences.",
    value: "luxurious",
    icon: Gem,
  },
];

export default function BudgetUi({
  data = {},
  onSelect,
  disabled = false,
}: Props) {
  const heading =
    typeof data.heading === "string"
      ? data.heading
      : "What travel style suits you?";

  return (
    <section className="mt-4 w-full max-w-2xl rounded-2xl border border-[#dce5dc] bg-white p-4 shadow-sm sm:p-5">
      <h3 className="font-semibold text-[#173d30]">{heading}</h3>
      <p className="mt-1 text-sm text-[#819087]">
        This helps Roamora tailor stays and experiences to your preferences.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(option.value)}
              className="flex flex-col items-center rounded-xl border border-[#e3eae2] bg-[#f8faf7] p-4 text-center transition hover:border-[#71927b] hover:bg-[#edf3ed] disabled:opacity-50"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf3ed] text-[#245542]">
                <Icon className="h-6 w-6" />
              </span>
              <span className="mt-3 text-sm font-semibold text-[#173d30]">
                {option.title}
              </span>
              <span className="mt-1 text-xs leading-5 text-[#819087]">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
