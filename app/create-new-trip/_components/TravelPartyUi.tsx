
"use client";

import {
  UserRound,
  Heart,
  UsersRound,
  BriefcaseBusiness,
  UserPlus,
} from "lucide-react";

type Props = {
  data?: Record<string, unknown>;
  onSelect: (value: string) => void;
  disabled?: boolean;
};

const options = [
  {
    title: "Solo",
    description: "A journey on your own.",
    value: "solo",
    icon: UserRound,
    people: "1 traveller",
  },
  {
    title: "Couple",
    description: "A trip for two.",
    value: "couple",
    icon: Heart,
    people: "2 travellers",
  },
  {
    title: "Family",
    description: "A getaway with family.",
    value: "family",
    icon: UsersRound,
    people: "Family group",
  },
  {
    title: "Friends",
    description: "An adventure with friends.",
    value: "friends",
    icon: UsersRound,
    people: "Group travel",
  },
  {
    title: "Colleagues",
    description: "A trip with your work team.",
    value: "colleagues",
    icon: BriefcaseBusiness,
    people: "Group travel",
  },
  {
    title: "Other",
    description: "Another kind of travel group.",
    value: "other",
    icon: UserPlus,
    people: "Custom group",
  },
];

export default function TravelPartyUi({
  data = {},
  onSelect,
  disabled = false,
}: Props) {
  const heading =
    typeof data.heading === "string"
      ? data.heading
      : "Who will be travelling?";

  const description =
    typeof data.description === "string"
      ? data.description
      : "Choose the group that best describes your trip.";

  return (
    <section className="mt-4 w-full max-w-2xl rounded-2xl border border-[#dce5dc] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-[#173d30]">{heading}</h3>
        <p className="mt-1 text-sm text-[#819087]">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(option.value)}
              className="group flex items-center gap-3 rounded-xl border border-[#e3eae2] bg-[#f8faf7] p-3.5 text-left transition hover:border-[#71927b] hover:bg-[#edf3ed] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf3ed] text-[#245542]">
                <Icon className="h-5 w-5" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#173d30]">
                  {option.title}
                </span>
                <span className="mt-0.5 block text-xs text-[#819087]">
                  {option.description}
                </span>
                <span className="mt-1.5 block text-[11px] font-medium text-[#54715f]">
                  {option.people}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
