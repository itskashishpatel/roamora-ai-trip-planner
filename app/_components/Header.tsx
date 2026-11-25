"use client";

import { useState } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { isSignedIn, isLoaded } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#e7ece5] bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex min-h-[68px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2"
        >
          <Image
            src="/logo.svg"
            alt="Roamora"
            width={44}
            height={44}
            priority
            className="h-9 w-9 object-contain"
          />

          <span className="text-xl font-bold tracking-tight text-[#172d24] sm:text-2xl">
            Roamora
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-[#536258] transition hover:text-[#194b39]"
          >
            Home
          </Link>

          {isLoaded && isSignedIn && (
            <Link
              href="/my-trips"
              className="text-sm font-medium text-[#536258] transition hover:text-[#194b39]"
            >
              My Trips
            </Link>
          )}

          <Link
            href="/destinations/goa"
            className="text-sm font-medium text-[#536258] transition hover:text-[#194b39]"
          >
            Discover
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {!isLoaded ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-gray-100" />
          ) : isSignedIn ? (
            <>
              <Link
                href="/create-new-trip"
                className="hidden rounded-full bg-[#194b39] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123b2d] sm:inline-flex"
              >
                Create Trip
              </Link>

              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hidden rounded-full px-3 py-2 text-sm font-semibold text-[#536258] transition hover:bg-gray-100 sm:inline-flex"
              >
                Sign in
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full bg-[#194b39] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123b2d]"
              >
                Get Started
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7ece5] text-[#245542] transition hover:bg-[#edf3ed] md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-[#e7ece5] bg-white px-4 py-4 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-1">
            <Link
              href="/"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-sm font-medium text-[#536258] hover:bg-[#edf3ed]"
            >
              Home
            </Link>

            <Link
              href="/destinations/goa"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-sm font-medium text-[#536258] hover:bg-[#edf3ed]"
            >
              Discover
            </Link>

            {isSignedIn && (
              <>
                <Link
                  href="/my-trips"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-[#536258] hover:bg-[#edf3ed]"
                >
                  My Trips
                </Link>

                <Link
                  href="/create-new-trip"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-[#536258] hover:bg-[#edf3ed]"
                >
                  Create Trip
                </Link>
              </>
            )}

            {!isSignedIn && (
              <Link
                href="/sign-in"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#536258] hover:bg-[#edf3ed]"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}