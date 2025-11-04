// components/ProtectedRoute.tsx

"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Wraps a page component to protect it from unauthenticated access.
 * Reads auth state from the Zustand store.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to signin
    if (!isLoading && !user) {
      router.push("/auth/signin");
    }
  }, [isLoading, user, router]);

  // 1. While loading, show a spinner or nothing
  if (isLoading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  // 2. If loading is done and user exists, show the page
  if (user) {
    return <>{children}</>;
  }

  // 3. If no user and not loading (being redirected), return null
  return null;
}
