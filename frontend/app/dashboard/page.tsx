// app/dashboard/page.tsx

"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";

function DashboardContent() {
  // Get state and actions from the store
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/signin");
  };

  return (
    <div>
      {/* user is guaranteed to exist here because of ProtectedRoute */}
      <h1>Welcome, {user?.full_name}!</h1>
      <p>Your email is: {user?.email}</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

// The main page export
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
