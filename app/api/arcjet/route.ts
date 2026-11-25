
import Arcjet, { tokenBucket } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import {
  EMPTY_TRIP_ANSWERS,
  type ChatMessage,
  type TravelParty,
  type TravelStyle,
  type TripAnswers,
  type UIType,
} from "@/lib/trip-types";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const ARCJET_KEY = process.env.ARCJET_KEY;
const MODEL = "openrouter/free";

const aj = ARCJET_KEY
  ? Arcjet({
      key: ARCJET_KEY,
      characteristics: ["userId"],
      rules: [
        tokenBucket({
          mode: "LIVE",
          refillRate: 8,
          interval: "1m",
          capacity: 12,
        }),
      ],
    })
  : null;

type AIResult = {
  resp: string;
  UI: UIType;
  props: Record<string, unknown>;
  answers: TripAnswers;
};

const VALID_PARTIES: TravelParty[] = [
  "solo",
  "couple",
  "family",
  "friends",
  "colleagues",
  "other",
];

const VALID_STYLES: TravelStyle[] = [
  "low",
  "moderate",
  "luxurious",
];

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cleanString(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const result = value.trim();

  return result ? result.slice(0, 200) : null;
}

function normalizeDate(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;

  const date = new Date(`${trimmed}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString().slice(0, 10) === trimmed ? trimmed : null;
}

function normalizeAnswers(value: unknown): TripAnswers {
  const source = isObject(value) ? value : {};

  const party = VALID_PARTIES.includes(source.travelParty as TravelParty)
    ? (source.travelParty as TravelParty)
    : null;

  const style = VALID_STYLES.includes(source.travelStyle as TravelStyle)
    ? (source.travelStyle as TravelStyle)
    : null;

  let travelDates: TripAnswers["travelDates"] = null;

  if (isObject(source.travelDates)) {
    travelDates = {
      startDate: normalizeDate(source.travelDates.startDate),
      endDate: normalizeDate(source.travelDates.endDate),
    };
  }

  let travellerCount =
    typeof source.travellerCount === "number" &&
    Number.isSafeInteger(source.travellerCount) &&
    source.travellerCount >= 1
      ? source.travellerCount
      : null;

  if (party === "solo") travellerCount = 1;
  if (party === "couple") travellerCount = 2;

  let duration =
    typeof source.duration === "number" &&
    Number.isSafeInteger(source.duration) &&
    source.duration >= 1
      ? source.duration
      : null;

  if (
    travelDates?.startDate &&
    travelDates?.endDate
  ) {
    const start = new Date(`${travelDates.startDate}T00:00:00.000Z`);
    const end = new Date(`${travelDates.endDate}T00:00:00.000Z`);

    const difference =
      Math.round((end.getTime() - start.getTime()) / 86400000) + 1;

    if (difference >= 1) duration = difference;
  }

  return {
    destination: cleanString(source.destination),
    source: cleanString(source.source),
    travelDates,
    travelParty: party,
    travellerCount,
    travelStyle: style,
    duration,
    interests: Array.isArray(source.interests)
      ? source.interests
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 20)
      : [],
    preferences: Array.isArray(source.preferences)
      ? source.preferences
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 20)
      : [],
  };
}

function extractDurationFromText(messages: ChatMessage[]): number | null {
  const userMessages = messages
    .filter((message) => message.role === "user")
    .slice(-8);

  for (let i = userMessages.length - 1; i >= 0; i--) {
    const text = userMessages[i].content.toLowerCase();

    // Explicit corrections should be interpreted using the latest number.
    const range = text.match(
      /(\d+)\s*(?:-|to)\s*(\d+)\s*(?:days?|nights?)/i
    );

    if (range) {
      const first = Number(range[1]);
      const second = Number(range[2]);

      if (first >= 1 && second >= 1) {
        return Math.max(first, second);
      }
    }

    const weekMatch = text.match(/(\d+)\s*weeks?/i);

    if (weekMatch) {
      const days = Number(weekMatch[1]) * 7;
      if (Number.isSafeInteger(days) && days > 0) return days;
    }

    const dayMatch = text.match(/(\d+)\s*days?/i);

    if (dayMatch) {
      const days = Number(dayMatch[1]);
      if (Number.isSafeInteger(days) && days > 0) return days;
    }

    const wordNumbers: Record<string, number> = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      eleven: 11,
      twelve: 12,
      fourteen: 14,
      fifteen: 15,
      twenty: 20,
    };

    const wordMatch = text.match(
      /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fourteen|fifteen|twenty)\s*(?:days?|nights?)\b/i
    );

    if (wordMatch) return wordNumbers[wordMatch[1]];
  }

  return null;
}

function mergeAnswers(
  existing: TripAnswers,
  extracted: unknown,
  messages: ChatMessage[]
): TripAnswers {
  const incoming = normalizeAnswers(extracted);

  const merged: TripAnswers = {
    destination: incoming.destination ?? existing.destination,
    source: incoming.source ?? existing.source,
    travelDates: incoming.travelDates ?? existing.travelDates,
    travelParty: incoming.travelParty ?? existing.travelParty,
    travellerCount: incoming.travellerCount ?? existing.travellerCount,
    travelStyle: incoming.travelStyle ?? existing.travelStyle,
    duration: incoming.duration ?? existing.duration,
    interests:
      incoming.interests.length > 0
        ? incoming.interests
        : existing.interests,
    preferences:
      incoming.preferences.length > 0
        ? incoming.preferences
        : existing.preferences,
  };

  if (merged.travelParty === "solo") merged.travellerCount = 1;
  if (merged.travelParty === "couple") merged.travellerCount = 2;

  const mentionedDuration = extractDurationFromText(messages);

  if (
    mentionedDuration !== null &&
    !(
      merged.travelDates?.startDate &&
      merged.travelDates?.endDate
    )
  ) {
    merged.duration = mentionedDuration;
  }

  return normalizeAnswers(merged);
}

function getNextQuestion(answers: TripAnswers): UIType {
  if (!answers.destination) return "destination";
  if (!answers.source) return "source";
  if (!answers.travelParty) return "travel_party";

  if (
    answers.travelParty !== "solo" &&
    answers.travelParty !== "couple" &&
    !answers.travellerCount
  ) {
    return "traveller_count";
  }

  if (!answers.travelDates) return "travel_dates";
  if (!answers.travelStyle) return "travel_style";
  if (!answers.duration) return "trip_duration";
  if (answers.interests.length === 0) return "interests";
  if (answers.preferences.length === 0) return "preferences";

  return "final";
}

function fallbackQuestion(ui: UIType): { resp: string; props: Record<string, unknown> } {
  const questions: Record<string, { resp: string; props: Record<string, unknown> }> = {
    destination: {
      resp: "Where would you like to go?",
      props: {
        options: [
          "Goa, India",
          "Manali, India",
          "Jaipur, India",
          "Bali, Indonesia",
          "Paris, France",
          "Tokyo, Japan",
        ],
      },
    },
    source: {
      resp: "Where will you be travelling from?",
      props: {},
    },
    travel_party: {
      resp: "Who will be travelling with you?",
      props: {},
    },
    traveller_count: {
      resp: "How many people will be travelling?",
      props: {},
    },
    travel_dates: {
      resp: "When would you like to travel?",
      props: {},
    },
    travel_style: {
      resp: "What travel style would suit you best?",
      props: {},
    },
    trip_duration: {
      resp: "How many days would you like your trip to last?",
      props: {},
    },
    interests: {
      resp: "What would you love to experience on this trip?",
      props: {
        options: [
          "Food and local cuisine",
          "Nature and landscapes",
          "Adventure",
          "Culture and history",
          "Shopping",
          "Relaxation",
          "Nightlife",
          "Photography",
        ],
      },
    },
    preferences: {
      resp: "Is there anything else I should keep in mind?",
      props: {
        options: [
          "Family-friendly activities",
          "Avoid crowded places",
          "Accessible travel",
          "Slow-paced itinerary",
          "Local experiences",
          "Vegetarian food options",
          "Early starts",
          "More free time",
        ],
      },
    },
  };

  return questions[ui] ?? {
    resp: "Tell me a little more about your trip.",
    props: {},
  };
}

async function callOpenRouter(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  maxTokens = 3000
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("The AI service is not configured.");
  }

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      signal: AbortSignal.timeout(90000),
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Roamora",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: maxTokens,
      }),
    }
  );

  const data: unknown = await response.json();

  if (!response.ok || !isObject(data)) {
    throw new Error("The AI provider could not process your request.");
  }

  const choices = Array.isArray(data.choices) ? data.choices : [];
  const choice = isObject(choices[0]) ? choices[0] : {};
  const message = isObject(choice.message) ? choice.message : {};
  const content = message.content;

  const text =
    typeof content === "string"
      ? content
      : Array.isArray(content)
        ? content
            .map((part) =>
              isObject(part) && typeof part.text === "string"
                ? part.text
                : ""
            )
            .join("")
        : "";

  if (!text.trim()) {
    throw new Error("The AI provider returned an empty response. Please retry.");
  }

  return text;
}

function parseJson(text: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(text);

    if (!isObject(parsed)) {
      throw new Error("Invalid JSON object.");
    }

    return parsed;
  } catch {
    throw new Error("The AI returned an invalid structured response. Please retry.");
  }
}

async function extractTripAnswers(
  messages: ChatMessage[],
  currentAnswers: TripAnswers
): Promise<unknown> {
  const recentConversation = messages
    .slice(-24)
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n");

  const prompt = `
You extract travel-planning facts from a conversation.

Return one JSON object with exactly these keys:
{
  "destination": string or null,
  "source": string or null,
  "travelDates": {
    "startDate": "YYYY-MM-DD" or null,
    "endDate": "YYYY-MM-DD" or null
  } or null,
  "travelParty": "solo" | "couple" | "family" | "friends" | "colleagues" | "other" or null,
  "travellerCount": integer or null,
  "travelStyle": "low" | "moderate" | "luxurious" or null,
  "duration": positive integer or null,
  "interests": string[],
  "preferences": string[]
}

Rules:
- Extract only facts the user actually provided.
- Do not invent missing details.
- Do not change an answer unless the user clearly corrects it.
- Solo means exactly 1 traveller.
- Couple means exactly 2 travellers.
- For family, friends, colleagues, or other, extract an exact count only if the user gave one.
- If the user says dates are flexible, return travelDates as {"startDate":null,"endDate":null}.
- If the user gives a date range, use ISO dates.
- If the user says 4-5 days, use 5 days.
- If a date range is supplied, duration is the inclusive number of calendar days.
- If the user explicitly changes an earlier answer, use the latest correction.
- Preserve the distinction between destination and starting city.
- Return JSON only.

CURRENT STRUCTURED ANSWERS:
${JSON.stringify(currentAnswers)}

CONVERSATION:
${recentConversation}
`;

  const content = await callOpenRouter(
    [{ role: "system", content: prompt }],
    1800
  );

  return parseJson(content);
}

async function generateQuestion(
  ui: UIType,
  answers: TripAnswers,
  messages: ChatMessage[]
): Promise<{ resp: string; props: Record<string, unknown> }> {
  const fallback = fallbackQuestion(ui);

  const prompt = `
You are Roamora, a friendly but concise AI trip planner.

Generate exactly one natural question for the user.
The server has already selected the required field. Do not ask about any other field.
Do not repeat information the user has already provided.
Do not ask multiple questions.
Return JSON only:
{"resp":"question text","props":{}}

Required field: ${ui}
Known trip details: ${JSON.stringify(answers)}
Recent conversation: ${JSON.stringify(messages.slice(-8))}
`;

  try {
    const content = await callOpenRouter(
      [{ role: "system", content: prompt }],
      400
    );

    const parsed = parseJson(content);
    const resp = cleanString(parsed.resp);

    return {
      resp: resp ?? fallback.resp,
      props: fallback.props,
    };
  } catch {
    return fallback;
  }
}

function validateItinerary(
  value: unknown,
  answers: TripAnswers
): Record<string, unknown> {
  if (!isObject(value)) {
    throw new Error("The generated itinerary has an invalid format.");
  }

  const description = isObject(value.tripDescription)
    ? value.tripDescription
    : value;

  if (
    typeof description.destination !== "string" ||
    typeof description.source !== "string"
  ) {
    throw new Error("The itinerary is missing its starting point or destination.");
  }

  if (!Array.isArray(description.days)) {
    throw new Error("The itinerary is missing its daily plans.");
  }

  const expectedDays = answers.duration;

  if (
    !expectedDays ||
    description.days.length !== expectedDays
  ) {
    throw new Error(
      `The itinerary must contain exactly ${expectedDays ?? "the requested"} days. Please retry.`
    );
  }

  const days = description.days.map((day, index) => {
    if (!isObject(day)) {
      throw new Error(`Day ${index + 1} has an invalid format.`);
    }

    if (
      typeof day.title !== "string" ||
      typeof day.morning !== "string" ||
      typeof day.afternoon !== "string" ||
      typeof day.evening !== "string" ||
      !Array.isArray(day.activities)
    ) {
      throw new Error(`Day ${index + 1} is missing required fields.`);
    }

    const activities = day.activities.map((activity) => {
      if (!isObject(activity)) {
        throw new Error(`An activity on day ${index + 1} is invalid.`);
      }

      if (
        typeof activity.name !== "string" ||
        typeof activity.description !== "string" ||
        typeof activity.time !== "string"
      ) {
        throw new Error(`An activity on day ${index + 1} is incomplete.`);
      }

      return {
        name: activity.name.trim(),
        description: activity.description.trim(),
        time: activity.time.trim(),
        ...(typeof activity.location === "string"
          ? { location: activity.location.trim() }
          : {}),
      };
    });

    return {
      ...day,
      day: index + 1,
      title: day.title.trim(),
      morning: day.morning.trim(),
      afternoon: day.afternoon.trim(),
      evening: day.evening.trim(),
      activities,
      tips: Array.isArray(day.tips)
        ? day.tips.filter(
            (tip): tip is string =>
              typeof tip === "string" && Boolean(tip.trim())
          )
        : [],
    };
  });

  return {
    destination: answers.destination,
    source: answers.source,
    travelDates: answers.travelDates,
    travelParty: answers.travelParty,
    travellerCount: answers.travellerCount,
    travelStyle: answers.travelStyle,
    duration: expectedDays,
    interests: answers.interests,
    preferences: answers.preferences,
    summary:
      typeof description.summary === "string"
        ? description.summary
        : `A ${expectedDays}-day trip to ${answers.destination}.`,
    days,
  };
}

async function generateItinerary(
  answers: TripAnswers
): Promise<{ tripName: string; tripDescription: Record<string, unknown>; summary: string }> {
  const prompt = `
You are an expert travel itinerary planner.

Create a practical, coherent travel itinerary using these confirmed details:
${JSON.stringify(answers)}

Return JSON only in this format:
{
  "tripName": "Short trip name",
  "summary": "Short overview",
  "tripDescription": {
    "destination": "Destination",
    "source": "Starting city",
    "summary": "Short overview",
    "duration": 3,
    "days": [
      {
        "day": 1,
        "title": "Day title",
        "morning": "Morning plan",
        "afternoon": "Afternoon plan",
        "evening": "Evening plan",
        "activities": [
          {
            "name": "Activity",
            "description": "What to do",
            "time": "10:00 AM",
            "location": "Place"
          }
        ],
        "food": "Food suggestions",
        "transport": "Transport guidance",
        "tips": ["Useful tip"]
      }
    ]
  }
}

Rules:
- Produce exactly ${answers.duration} days, no more and no fewer.
- Day numbers must start at 1 and increase sequentially.
- Keep the route geographically sensible and avoid unnecessary backtracking.
- Include realistic morning, afternoon, and evening plans.
- Do not claim that tickets, hotels, or transport have been booked.
- Do not invent live prices, availability, or opening hours.
- Respect the travel party, exact traveller count, travel style, interests, and preferences.
- Include practical transport guidance.
- Do not add an extra day for arrival or departure.
`;

  const content = await callOpenRouter(
    [{ role: "system", content: prompt }],
    16000
  );

  const parsed = parseJson(content);

  const tripDescription = validateItinerary(parsed, answers);

  const tripName =
    cleanString(parsed.tripName) ??
    `Trip to ${answers.destination}`;

  const summary =
    cleanString(parsed.summary) ??
    `Your ${answers.duration}-day trip to ${answers.destination}.`;

  return {
    tripName,
    summary,
    tripDescription,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to plan and save a trip." },
        { status: 401 }
      );
    }

    if (!OPENROUTER_API_KEY || !aj) {
      return NextResponse.json(
        { error: "The trip planning service is not configured." },
        { status: 500 }
      );
    }

    const decision = await aj.protect(req, {
      userId,
      requested: 1,
    });

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body: unknown = await req.json();

    if (!isObject(body) || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    if (body.messages.length > 60) {
      return NextResponse.json(
        { error: "This conversation is too long. Please start a new trip." },
        { status: 413 }
      );
    }

    const messages: ChatMessage[] = body.messages
      .filter((item): item is Record<string, unknown> => isObject(item))
      .filter(
        (item) =>
          (item.role === "user" || item.role === "assistant") &&
          typeof item.content === "string" &&
          item.content.trim().length > 0
      )
      .slice(-30)
      .map((item) => ({
        role: item.role as "user" | "assistant",
        content: (item.content as string).trim().slice(0, 4000),
      }));

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "No valid conversation messages were provided." },
        { status: 400 }
      );
    }

    const existingAnswers = normalizeAnswers(body.answers ?? EMPTY_TRIP_ANSWERS);

    const extracted = await extractTripAnswers(messages, existingAnswers);

    const answers = mergeAnswers(
      existingAnswers,
      extracted,
      messages
    );

    const nextUI = getNextQuestion(answers);

    if (nextUI !== "final") {
      const question = await generateQuestion(
        nextUI,
        answers,
        messages
      );

      const result: AIResult = {
        resp: question.resp,
        UI: nextUI,
        props: question.props,
        answers,
      };

      return NextResponse.json(result);
    }

    const itinerary = await generateItinerary(answers);

    const result: AIResult = {
      resp: "Your trip plan is ready. I've put together an itinerary based on your answers.",
      UI: "final",
      props: {
        tripName: itinerary.tripName,
        summary: itinerary.summary,
        tripDescription: itinerary.tripDescription,
      },
      answers,
    };

    return NextResponse.json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    ) {
      return NextResponse.json(
        {
          error:
            "Roamora took too long to respond. Your draft is saved; please try again.",
        },
        { status: 504 }
      );
    }

    console.error(
      "Roamora API error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process your trip request.",
      },
      { status: 500 }
    );
  }
}
