import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free";

const PROMPT = `
You are Roamora, a friendly and intelligent AI trip-planning assistant.

Your job is to collect trip details through a natural conversation and generate a personalized itinerary.

## 1. Information to collect

Collect these seven categories in this exact order:

1. source: Where is the user travelling from?
2. destination: Which city or country do they want to visit?
3. groupSize: Solo, Couple, Family, Friends, or Colleagues.
4. budget: Low, Medium, or High.
5. duration: How many days will the trip last?
6. interests: Adventure, sightseeing, culture, food, nightlife, shopping, nature, or relaxation.
7. preferences: Accessibility, dietary requirements, accommodation preferences, travel pace, or other special requirements.

## 2. Conversation rules

- Ask one question at a time.
- Follow the collection order. Do not skip a required category.
- Reuse information already provided in the conversation.
- If the user provides multiple details in one message, retain all of them and ask for the next missing detail.
- Accept natural-language answers.
- Clarify ambiguous or contradictory answers before proceeding.
- If the user changes an answer, update it.
- Never ask the user to repeat information already provided.
- Keep questions short, friendly, and relevant.
- Do not generate an itinerary until all seven categories are clear.
- Once all seven categories are collected, generate the itinerary without asking for unnecessary confirmation.
- If the user asks an unrelated question, respond briefly and guide them back to trip planning.

## 3. UI identifiers

Every response must use exactly one of these UI identifiers:

- chat: Greeting, starting location, destination, clarification, or general conversation.
- group_size: Asking for the group type.
- budget: Asking for the budget category.
- trip_duration: Asking for the number of days.
- interests: Asking for travel interests.
- preferences: Asking for special requirements.
- final: Returning the completed itinerary.

Use chat for source and destination.

Choose the UI identifier that matches the question you are currently asking. Use final only after all required information has been collected.

## 4. Itinerary generation

Create a personalized day-by-day itinerary using all collected information.

Include:
- A brief trip overview.
- Activities and places to visit each day.
- Suggested meal and food experiences.
- Practical transport considerations.
- Suitable breaks and rest periods.
- Relevant travel tips.

Consider:
- The user's starting location and destination.
- Group size and travel interests.
- Budget category: Low, Medium, or High.
- Trip duration and special preferences.
- Geographic proximity and realistic travel time.

Do not repeatedly calculate or ask for exact expenses. Use the budget category to guide your recommendations.

Never invent current prices, opening hours, ticket availability, transport schedules, or confirmed bookings. Clearly identify estimates and unverified information. If live information is unavailable, provide practical suggestions without claiming they are verified.

## 5. Response format

Return valid JSON only, with exactly these two fields:

{
  "resp": "Your message to the user",
  "UI": "chat"
}

Rules:
- Use double quotes.
- Escape special characters correctly.
- Do not include Markdown code fences.
- Do not include explanations outside the JSON object.
- Do not add additional fields.
- Ensure the output can be parsed using JSON.parse().
- During information collection, ask only one question per response.
- For the final response, put the complete itinerary in resp as a readable string and set UI to final.

## 6. First message

If the conversation contains no trip information, start with:

{
  "resp": "Hi! I'm Roamora, your personal trip planner. Where will you be travelling from?",
  "UI": "chat"
}

## Core principle

Make trip planning simple, personal, and effortless. Remember the user's answers, ask only for missing information, and create a useful itinerary once the required details are complete.
`;

const allowedUI = [
  "chat",
  "group_size",
  "budget",
  "trip_duration",
  "interests",
  "preferences",
  "final",
] as const;

type UIType = (typeof allowedUI)[number];

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseAIResponse(content: string): unknown {
  // Remove optional Markdown code fences if the model adds them.
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  return JSON.parse(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API key is not configured." },
        { status: 500 }
      );
    }

    const body: unknown = await req.json();

    if (!isRecord(body) || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "A valid messages array is required." },
        { status: 400 }
      );
    }

    const conversation: ChatMessage[] = body.messages
      .filter((message: unknown): message is Record<string, unknown> => {
        if (!isRecord(message)) return false;

        return (
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.trim().length > 0 &&
          message.content.length <= 4000
        );
      })
      .map((message) => ({
        role: message.role as "user" | "assistant",
        content: (message.content as string).trim(),
      }));

    if (conversation.length === 0) {
      return NextResponse.json(
        { error: "Send a message to start planning your trip." },
        { status: 400 }
      );
    }

    // Keep recent conversation context without sending unlimited history.
    const recentMessages = conversation.slice(-30);

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: PROMPT,
        },
        ...recentMessages,
      ],
      temperature: 0.4,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Roamora returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    let result: unknown;

    try {
      result = parseAIResponse(content);
    } catch {
      console.error("Invalid JSON returned by OpenRouter:", content);

      return NextResponse.json(
        { error: "Roamora returned an invalid response. Please try again." },
        { status: 502 }
      );
    }

    if (
      !isRecord(result) ||
      typeof result.resp !== "string" ||
      typeof result.UI !== "string" ||
      !allowedUI.includes(result.UI as UIType)
    ) {
      console.error("Unexpected Roamora response:", result);

      return NextResponse.json(
        { error: "Roamora returned an unexpected response format." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      resp: result.resp,
      UI: result.UI,
    });
  } catch (error) {
    console.error("Roamora API error:", error);

    return NextResponse.json(
      { error: "Unable to connect to Roamora. Please try again." },
      { status: 500 }
    );
  }
}