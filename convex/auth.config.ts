import type { AuthConfig } from "convex/server";

const clerkDomain = process.env.CLERK_FRONTEND_API_URL;

if (!clerkDomain) {
  throw new Error(
    "CLERK_FRONTEND_API_URL is missing from the Convex environment."
  );
}

export default {
  providers: [
    {
      domain: clerkDomain,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;