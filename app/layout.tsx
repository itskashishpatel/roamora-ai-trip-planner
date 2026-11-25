
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Provider from "./provider";

export const metadata: Metadata = {
  title: "Roamora - Find Your Kind of Somewhere",
  description:
    "Plan personalized trips, discover new destinations, and create memorable travel experiences with Roamora. Your ultimate travel companion for unforgettable adventures.",
};

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage-grotesque",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={bricolageGrotesque.variable}>
        <body className={bricolageGrotesque.className}>
          <ConvexClientProvider>
            <Provider>{children}</Provider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
