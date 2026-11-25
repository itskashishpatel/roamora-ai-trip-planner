
"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";

import Header from "./_components/Header";
import { api } from "@/convex/_generated/api";
import {
  UserDetailContext,
  type UserDetail,
} from "@/context/userDetailContext";

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const createNewUser = useMutation(api.user.CreateNewUser);

  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [syncedUserId, setSyncedUserId] = useState<string | null>(null);

  const { isLoaded, isSignedIn, user } = useUser();

  const currentUserDetail =
    isLoaded && isSignedIn && user && syncedUserId === user.id
      ? userDetail
      : null;

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) {
      setUserDetail(null);
      setSyncedUserId(null);
      return;
    }

    const clerkUser = user;
    const userId = clerkUser.id;

    const name =
      clerkUser.fullName ??
      clerkUser.username ??
      clerkUser.firstName ??
      "";

    const imageUrl = clerkUser.imageUrl ?? "";

    let cancelled = false;

    async function syncUser() {
      try {
        const result = await createNewUser({
          name,
          imageUrl,
        });

        if (!cancelled) {
          setUserDetail(result as UserDetail | null);
          setSyncedUserId(userId);
        }
      } catch (error) {
        console.error("Failed to save user to Convex:", error);
      }
    }

    void syncUser();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, user, createNewUser]);

  return (
    <UserDetailContext.Provider
      value={{
        userDetail: currentUserDetail,
        setUserDetail,
      }}
    >
      <Header />
      {children}
    </UserDetailContext.Provider>
  );
}
