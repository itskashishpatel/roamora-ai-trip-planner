
export type TravelParty =
  | "solo"
  | "couple"
  | "family"
  | "friends"
  | "colleagues"
  | "other";

export type TravelStyle = "low" | "moderate" | "luxurious";

export type TravelDates = {
  startDate: string | null;
  endDate: string | null;
};

export type TripAnswers = {
  destination: string | null;
  source: string | null;
  travelDates: TravelDates | null;
  travelParty: TravelParty | null;
  travellerCount: number | null;
  travelStyle: TravelStyle | null;
  duration: number | null;
  interests: string[];
  preferences: string[];
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type UIType =
  | "chat"
  | "destination"
  | "source"
  | "travel_party"
  | "traveller_count"
  | "travel_dates"
  | "travel_style"
  | "trip_duration"
  | "interests"
  | "preferences"
  | "final";

export const EMPTY_TRIP_ANSWERS: TripAnswers = {
  destination: null,
  source: null,
  travelDates: null,
  travelParty: null,
  travellerCount: null,
  travelStyle: null,
  duration: null,
  interests: [],
  preferences: [],
};
