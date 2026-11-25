
"use client";

import LocationSelectionUi from "./LocationSelectionUi";
import BudgetUi from "./BudgetUi";
import TripDurationUi from "./TripDurationUi";
import TripReadyCard from "./TripReadyCard";
import OptionSelectionUi from "./OptionSelectionUi";
import TravelPartyUi from "./TravelPartyUi";
import TravellerCountUi from "./TravellerCountUi";
import TravelDatesUi from "./TravelDatesUi";

import type { UIType } from "@/lib/trip-types";

type RenderGenerativeUIProps = {
  UI?: UIType | string;
  props?: Record<string, unknown>;
  onSelect: (value: string) => void;
  disabled?: boolean;
  onRetry?: () => void;
};

export default function RenderGenerativeUI({
  UI,
  props = {},
  onSelect,
  disabled = false,
  onRetry,
}: RenderGenerativeUIProps) {
  switch (UI) {
    case "destination":
      return (
        <LocationSelectionUi
          mode="destination"
          data={props}
          onSelect={onSelect}
          disabled={disabled}
        />
      );

    case "source":
      return (
        <LocationSelectionUi
          mode="source"
          data={props}
          onSelect={onSelect}
          disabled={disabled}
        />
      );

    case "travel_party":
      return (
        <TravelPartyUi
          data={props}
          onSelect={onSelect}
          disabled={disabled}
        />
      );

    case "traveller_count":
      return (
        <TravellerCountUi
          data={props}
          onSelect={onSelect}
          disabled={disabled}
        />
      );

    case "travel_dates":
      return (
        <TravelDatesUi
          data={props}
          onSelect={onSelect}
          disabled={disabled}
        />
      );

    case "travel_style":
      return (
        <BudgetUi
          data={props}
          onSelect={onSelect}
          disabled={disabled}
        />
      );

    case "trip_duration":
      return (
        <TripDurationUi
          onConfirm={(days) => onSelect(`${days} days`)}
          disabled={disabled}
        />
      );

    case "interests":
      return (
        <OptionSelectionUi
          data={props}
          heading="What would you love to experience?"
          helper="Choose as many interests as you like."
          onSelect={onSelect}
          disabled={disabled}
        />
      );

    case "preferences":
      return (
        <OptionSelectionUi
          data={props}
          heading="Anything else we should keep in mind?"
          helper="Select any preferences that matter for this trip."
          onSelect={onSelect}
          disabled={disabled}
        />
      );

    case "final":
      return (
        <TripReadyCard
          status={
            props.saveStatus === "error"
              ? "error"
              : props.tripId
                ? "ready"
                : "saving"
          }
          tripId={
            typeof props.tripId === "string"
              ? props.tripId
              : undefined
          }
          tripName={
            typeof props.tripName === "string"
              ? props.tripName
              : "Your trip is ready"
          }
          description={
            typeof props.summary === "string"
              ? props.summary
              : "Your personalized itinerary is ready to explore."
          }
          error={
            typeof props.saveError === "string"
              ? props.saveError
              : undefined
          }
          onRetry={onRetry}
        />
      );

    default:
      return null;
  }
}
