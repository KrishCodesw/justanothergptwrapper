// components/AuthInitializer.tsx

"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useEffect } from "react";

/**
 * A component that runs once on app load to fetch the
 * current user's session data and populate the auth store.
 */
export function AuthInitializer() {
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return null; // This component renders nothing
}
