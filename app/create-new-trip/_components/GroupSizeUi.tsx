
"use client";

import {
  UserRound,
  Heart,
  UsersRound,
  BriefcaseBusiness,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type GroupOption = {
  title: string;
  description: string;
  icon: string;
  people: string;
  value: string;
};

type GroupSizeUiProps = {
  data?: Record<string, unknown>;
  onSelect: (value: string) => void;
  disabled?: boolean;
};

const iconMap: Record<string, LucideIcon> = {
  user: UserRound,
  heart: Heart,
  users: UsersRound,
  briefcase: BriefcaseBusiness,
};

const fallbackOptions: GroupOption[] = [
  {
    title: "Just Me",
    description: "A little adventure, all on your own.",
    icon: "user",
    people: "1 traveller",
    value: "Solo",
  },
  {
    title: "A Couple",
    description: "Two travellers, one shared journey.",
    icon: "heart",
    people: "2 travellers",
    value: "Couple",
  },
  {
    title: "Family",
    description: "Make memories with your loved ones.",
    icon: "users",
    people: "3–5 people",
    value: "Family",
  },
  {
    title: "Friends",
    description: "Good company makes every trip better.",
    icon: "users",
    people: "3–5 people",
    value: "Friends",
  },
  {
    title: "Colleagues",
    description: "A getaway with your work crew.",
    icon: "briefcase",
    people: "Group travel",
    value: "Colleagues",
  },
];

const allowedValues = ["Solo", "Couple", "Family", "Friends", "Colleagues"];

export default function GroupSizeUi({
  data = {},
  onSelect,
  disabled = false,
}: GroupSizeUiProps) {
  const rawOptions = Array.isArray(data.options)
    ? data.options
    : [];

  const validOptions = rawOptions.filter(
    (option): option is GroupOption =>
      !!option &&
      typeof option === "object" &&
      typeof option.title === "string" &&
      typeof option.description === "string" &&
      typeof option.value === "string" &&
      allowedValues.includes(option.value)
  );

  const options =
    validOptions.length === 5 ? validOptions : fallbackOptions;

  return (
    <section className="@container mt-4 w-full min-w-0">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm @md:p-5">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <UsersRound size={19} />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold tracking-tight text-gray-900">
              Who&apos;s travelling?
            </h3>
            <p className="mt-1 text-sm leading-5 text-gray-500">
              Select who will be joining you on this journey.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 @md:grid-cols-2 @2xl:grid-cols-3">
          {options.map((option) => {
            const Icon = iconMap[option.icon] ?? UsersRound;

            return (
              <button
                key={option.value}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(option.value)}
                className="
                  group flex min-w-0 w-full items-center gap-3
                  rounded-xl border border-gray-200 bg-white
                  p-3.5 text-left
                  transition-all duration-200
                  hover:border-blue-300 hover:bg-blue-50/50
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-blue-500 focus-visible:ring-offset-2
                  disabled:cursor-not-allowed disabled:opacity-50
                  @md:flex-col @md:items-start @md:p-4
                "
              >
                <div className="flex w-full shrink-0 items-center justify-between @md:w-auto">
                  <div className="
                    flex h-11 w-11 items-center justify-center
                    rounded-xl bg-gray-100 text-gray-600
                    transition-colors
                    group-hover:bg-blue-100 group-hover:text-blue-600
                  ">
                    <Icon size={20} />
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-blue-500 @md:hidden" />
                </div>

                <div className="min-w-0 flex-1 @md:w-full">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {option.title}
                  </h4>

                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    {option.description}
                  </p>

                  <span className="
                    mt-2.5 inline-flex rounded-md
                    bg-gray-100 px-2 py-1
                    text-[11px] font-medium text-gray-600
                    group-hover:bg-blue-50 group-hover:text-blue-700
                  ">
                    {option.people}
                  </span>
                </div>

                <ArrowUpRight className="
                  hidden h-4 w-4 text-gray-300
                  transition-colors group-hover:text-blue-500
                  @md:block
                " />
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          You can change your travel group later.
        </p>
      </div>
    </section>
  );
}
