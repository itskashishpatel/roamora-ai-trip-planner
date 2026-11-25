
import ChatBox from "./_components/ChatBox";

type CreateNewTripPageProps = {
  searchParams: Promise<{
    prompt?: string;
    tripId?: string;
  }>;
};

export default async function CreateNewTrip({
  searchParams,
}: CreateNewTripPageProps) {
  const params = await searchParams;

  const initialPrompt =
    typeof params.prompt === "string" ? params.prompt : "";

  const initialTripId =
    typeof params.tripId === "string" ? params.tripId : undefined;

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[#f7f8f3] px-3 py-6 sm:px-6 sm:py-9">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6a4b]">
            Your travel companion
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#173d30] sm:text-3xl">
            Let&apos;s plan a trip that feels like yours.
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64746b]">
            Tell Roamora what you have in mind. We&apos;ll shape the details
            together, one step at a time.
          </p>
        </div>

        <div className="h-[min(760px,calc(100dvh-190px))] min-h-130">
          <ChatBox
            initialPrompt={initialPrompt}
            initialTripId={initialTripId}
          />
        </div>
      </div>
    </main>
  );
}
