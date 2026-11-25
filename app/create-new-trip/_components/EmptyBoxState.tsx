
import { Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Suggestion = {
  label: string;
  prompt: string;
  icon: LucideIcon;
  color: string;
};

type EmptyBoxStateProps = {
  suggestions: Suggestion[];
  onSuggestionClick: (suggestion: Suggestion) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export default function EmptyBoxState({
  suggestions,
  onSuggestionClick,
  onSubmit,
  disabled = false,
}: EmptyBoxStateProps) {
  return (
    <div className="flex h-full min-h-64 flex-col items-center justify-center px-6 text-center">
      <h2 className="text-2xl font-semibold text-gray-900">
        Start Planning Your Next Trip
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Tell Roamora where you want to go, and let&apos;s plan your journey.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-gray-100 px-2 pt-4">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;

          return (
            <button
              key={suggestion.label}
              type="button"
              disabled={disabled}
              onClick={() => onSuggestionClick(suggestion)}
              className="inline-flex items-center gap-2 text-sm text-gray-700 transition-colors hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon className={`h-4 w-4 ${suggestion.color}`} />
              <span>{suggestion.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          aria-label="Submit trip request"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
