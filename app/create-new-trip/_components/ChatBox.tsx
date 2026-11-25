
"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Loader2, RotateCcw, Send } from "lucide-react";

import { api } from "@/convex/_generated/api";
import {
  EMPTY_TRIP_ANSWERS,
  type ChatMessage,
  type TripAnswers,
  type UIType,
} from "@/lib/trip-types";

import RenderGenerativeUI from "./RenderGenerativeUI";

type Message = ChatMessage & {
  UI?: UIType;
  props?: Record<string, unknown>;
  tripId?: string;
  saveStatus?: "saving" | "ready" | "error";
  saveError?: string;
};

type AIResponse = {
  resp: string;
  UI: UIType;
  props?: Record<string, unknown>;
  answers: TripAnswers;
};

type ChatBoxProps = {
  initialPrompt?: string;
  initialTripId?: string;
};

const welcomeMessage: Message = {
  role: "assistant",
  content: "Let's plan your next journey. Where would you like to go?",
  UI: "destination",
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
};

const VALID_UI: UIType[] = [
  "chat",
  "destination",
  "source",
  "travel_party",
  "traveller_count",
  "travel_dates",
  "travel_style",
  "trip_duration",
  "interests",
  "preferences",
  "final",
];

function getSaveErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "";

  if (/signed in|authentication|identity/i.test(message)) {
    return "Your sign-in session could not be verified by Convex. Check your Clerk JWT configuration and sign in again.";
  }

  return message || "The trip could not be saved. Please try again.";
}

function readTripAnswers(value: unknown): TripAnswers {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return EMPTY_TRIP_ANSWERS;
  }

  const data = value as Partial<TripAnswers>;

  return {
    ...EMPTY_TRIP_ANSWERS,
    ...data,
    interests: Array.isArray(data.interests)
      ? data.interests.filter((item): item is string => typeof item === "string")
      : [],
    preferences: Array.isArray(data.preferences)
      ? data.preferences.filter((item): item is string => typeof item === "string")
      : [],
  };
}

export default function ChatBox({
  initialPrompt = "",
  initialTripId,
}: ChatBoxProps) {
  const { isLoaded: clerkLoaded, userId } = useAuth();

  const addTripDetail = useMutation(api.tripDetail.addTripDetail);
  const upsertTripDraft = useMutation(api.tripDetail.upsertTripDraft);

  const tripIdRef = useRef<string | null>(initialTripId ?? null);
  const restoredRef = useRef(false);

  const existingTrip = useQuery(
    api.tripDetail.getTripById,
    initialTripId ? { tripId: initialTripId } : "skip"
  );

  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [answers, setAnswers] = useState<TripAnswers>(EMPTY_TRIP_ANSWERS);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const latestInteractiveIndex = messages.reduce((latest, message, index) => {
    if (
      message.role === "assistant" &&
      message.UI &&
      message.UI !== "chat" &&
      message.UI !== "final"
    ) {
      return index;
    }

    return latest;
  }, -1);

  useEffect(() => {
    if (!clerkLoaded) return;

    if (initialTripId && existingTrip === undefined) return;

    if (restoredRef.current) return;

    restoredRef.current = true;

    if (initialTripId && existingTrip) {
      const savedMessages = Array.isArray(existingTrip.messages)
        ? existingTrip.messages
        : [];

      if (savedMessages.length > 0) {
        setMessages(savedMessages as Message[]);
      }

      setAnswers(readTripAnswers(existingTrip.answers));
      setDraftLoaded(true);
      return;
    }

    if (initialTripId && existingTrip === null) {
      setError("This trip could not be found or you do not have permission to access it.");
      setDraftLoaded(true);
      return;
    }

    if (initialPrompt.trim()) {
      setInput(initialPrompt.trim());
    }

    setDraftLoaded(true);
  }, [clerkLoaded, initialTripId, existingTrip, initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  function ensureTripId(): string {
    if (!tripIdRef.current) {
      tripIdRef.current = crypto.randomUUID();
    }

    return tripIdRef.current;
  }

  async function saveDraft(
    conversation: Message[],
    currentAnswers: TripAnswers
  ) {
    if (!userId) return;

    const tripId = ensureTripId();

    setSavingDraft(true);

    const destination = currentAnswers.destination?.trim();

    try {
      await upsertTripDraft({
        tripId,
        tripName: destination
          ? `Trip to ${destination}`
          : "Untitled trip",
        tripDescription: {
          source: currentAnswers.source ?? "",
          destination: currentAnswers.destination ?? "",
          travelDates: currentAnswers.travelDates,
          travelParty: currentAnswers.travelParty,
          travellerCount: currentAnswers.travellerCount,
          travelStyle: currentAnswers.travelStyle,
          duration: currentAnswers.duration,
          interests: currentAnswers.interests,
          preferences: currentAnswers.preferences,
          days: [],
        },
        answers: currentAnswers,
        messages: conversation.map(({ role, content }) => ({
          role,
          content,
        })),
      });
    } finally {
      setSavingDraft(false);
    }
  }

  async function requestAI(
    conversation: Message[],
    currentAnswers: TripAnswers
  ): Promise<AIResponse> {
    const response = await fetch("/api/arcjet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: conversation.map(({ role, content }) => ({
          role,
          content,
        })),
        answers: currentAnswers,
      }),
    });

    const data: unknown = await response.json();

    if (!response.ok) {
      const errorData = data as { error?: string };
      throw new Error(errorData.error || "Unable to process your request.");
    }

    if (!data || typeof data !== "object") {
      throw new Error("The AI returned an invalid response.");
    }

    const result = data as Partial<AIResponse>;

    if (
      typeof result.resp !== "string" ||
      !result.resp.trim() ||
      !result.UI ||
      !VALID_UI.includes(result.UI)
    ) {
      throw new Error("The AI returned an invalid response.");
    }

    return {
      resp: result.resp,
      UI: result.UI,
      props: result.props ?? {},
      answers: readTripAnswers(result.answers),
    };
  }

  async function saveFinalTrip(
    props: Record<string, unknown>,
    tripId: string
  ) {
    const tripName = props.tripName;
    const tripDescription = props.tripDescription;

    if (typeof tripName !== "string" || !tripName.trim()) {
      throw new Error("The generated trip is missing its name.");
    }

    if (
      !tripDescription ||
      typeof tripDescription !== "object" ||
      Array.isArray(tripDescription)
    ) {
      throw new Error("The generated itinerary is missing its details.");
    }

    const description = tripDescription as Record<string, unknown>;

    if (!Array.isArray(description.days) || description.days.length === 0) {
      throw new Error("The generated itinerary has no daily plans.");
    }

    await addTripDetail({
      tripId,
      tripName: tripName.trim(),
      tripDescription,
    });
  }

  async function processAIResponse(
    data: AIResponse,
    conversation: Message[]
  ): Promise<Message> {
    setAnswers(data.answers);

    const tripId = ensureTripId();

    const assistantMessage: Message = {
      role: "assistant",
      content: data.resp,
      UI: data.UI,
      props: data.props ?? {},
    };

    const updatedConversation = [...conversation, assistantMessage];

    if (data.UI !== "final") {
      await saveDraft(updatedConversation, data.answers);
      return assistantMessage;
    }

    try {
      await saveFinalTrip(data.props ?? {}, tripId);

      return {
        ...assistantMessage,
        tripId,
        saveStatus: "ready",
      };
    } catch (saveError) {
      return {
        ...assistantMessage,
        tripId,
        saveStatus: "error",
        saveError: getSaveErrorMessage(saveError),
      };
    }
  }

  async function handleSend(text?: string) {
    const messageText = (text ?? input).trim();

    if (!messageText || loading || !draftLoaded) return;

    const userMessage: Message = {
      role: "user",
      content: messageText,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      await saveDraft(updatedMessages, answers);

      const data = await requestAI(updatedMessages, answers);
      const assistantMessage = await processAIResponse(data, updatedMessages);

      setMessages((previous) => [...previous, assistantMessage]);
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }

  async function handleRetry() {
    if (loading) return;

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage) return;

    setError("");
    setLoading(true);

    try {
      if (
        lastMessage.UI === "final" &&
        lastMessage.saveStatus === "error" &&
        lastMessage.tripId
      ) {
        await saveFinalTrip(
          lastMessage.props ?? {},
          lastMessage.tripId
        );

        setMessages((previous) =>
          previous.map((message, index) =>
            index === previous.length - 1
              ? {
                  ...message,
                  saveStatus: "ready",
                  saveError: undefined,
                }
              : message
          )
        );

        return;
      }

      if (lastMessage.role !== "user") return;

      const data = await requestAI(messages, answers);
      const assistantMessage = await processAIResponse(data, messages);

      setMessages((previous) => [...previous, assistantMessage]);
    } catch (retryError) {
      setError(
        retryError instanceof Error
          ? retryError.message
          : "Retry failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-[#dce5dc] bg-white shadow-[0_12px_45px_rgba(25,75,57,0.07)]">
      <div className="flex items-center justify-between border-b border-[#edf1ec] px-4 py-3 sm:px-5">
        <div>
          <p className="text-sm font-semibold text-[#173d30]">
            Roamora Trip Planner
          </p>
          <p className="text-xs text-[#819087]">
            Your journey, planned one step at a time
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#819087]">
          {savingDraft && (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Saving draft
            </>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-5 sm:px-5">
        {!draftLoaded ? (
          <div className="flex h-full items-center justify-center gap-2 text-sm text-[#819087]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading your trip...
          </div>
        ) : (
          messages.map((message, index) => {
            const isUser = message.role === "user";
            const isLatestInteractive = index === latestInteractiveIndex;

            return (
              <div
                key={`${index}-${message.role}`}
                className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`min-w-0 max-w-[94%] sm:max-w-[88%] ${isUser ? "ml-auto" : "mr-auto"}`}>
                  <div
                    className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                      isUser
                        ? "rounded-br-md bg-[#194b39] text-white"
                        : "rounded-bl-md bg-[#f4f7f2] text-[#263a2f]"
                    }`}
                  >
                    {message.content}
                  </div>

                  {message.UI && message.UI !== "chat" && (
                    <RenderGenerativeUI
                      UI={message.UI}
                      props={{
                        ...(message.props ?? {}),
                        saveStatus: message.saveStatus,
                        tripId: message.tripId,
                        saveError: message.saveError,
                      }}
                      onSelect={handleSend}
                      disabled={loading || !isLatestInteractive}
                      onRetry={handleRetry}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-[#819087]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Roamora is thinking...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <p>{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              disabled={loading}
              className="mt-2 inline-flex items-center gap-2 font-semibold"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSend();
        }}
        className="border-t border-[#edf1ec] bg-white p-3 sm:p-4"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-[#dce5dc] bg-[#f8faf7] p-2 focus-within:border-[#71927b]">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void handleSend();
              }
            }}
            disabled={loading || !draftLoaded}
            rows={1}
            placeholder="Tell Roamora what you have in mind..."
            className="max-h-32 min-h-10 min-w-0 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-[#263a2f] outline-none placeholder:text-[#96a198] disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading || !input.trim() || !draftLoaded}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#194b39] text-white transition hover:bg-[#123b2d] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-[#9aa69d]">
          Press Enter to send · Shift + Enter for a new line
        </p>
      </form>
    </div>
  );
}
