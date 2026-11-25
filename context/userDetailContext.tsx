
"use client";

import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export interface UserDetail {
  _id?: string;
  name?: string;
  imageUrl?: string;
  subscription?: string;
}

interface UserDetailContextType {
  userDetail: UserDetail | null;
  setUserDetail: Dispatch<SetStateAction<UserDetail | null>>;
}

export const UserDetailContext =
  createContext<UserDetailContextType | undefined>(undefined);

export function useUserDetail() {
  const context = useContext(UserDetailContext);

  if (!context) {
    throw new Error(
      "useUserDetail must be used inside UserDetailContext.Provider",
    );
  }

  return context;
}
