"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/ui/Hero"; // Import your tool
import { useHistory } from "@/components/hooks/useHistory"; // To read local guest data
import { LogOut, User, CheckCircle2 } from "lucide-react";

function DashboardContent() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  // Get guest history to sync it
  const { history: localHistory, clearHistory, isLoaded } = useHistory();
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "done">(
    "idle"
  );

  // --- THE SYNC LOGIC ---
  useEffect(() => {
    const syncGuestData = async () => {
      // Only run if we have local history and haven't synced yet
      if (isLoaded && localHistory.length > 0 && syncStatus === "idle") {
        setSyncStatus("syncing");
        try {
          console.log("Found guest data, syncing to cloud...");

          await fetch("/api/queries/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guestHistory: localHistory }),
          });

          // Clear local storage after success so we don't sync again
          clearHistory();
          setSyncStatus("done");

          // Hide the "Syncing" toast after 3 seconds
          setTimeout(() => setSyncStatus("idle"), 3000);
        } catch (error) {
          console.error("Sync failed", error);
          setSyncStatus("idle");
        }
      }
    };

    syncGuestData();
  }, [localHistory, isLoaded, clearHistory, syncStatus]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/signin");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 1. DASHBOARD HEADER (Replaces the "Welcome" text) */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">
            P
          </div>
          <span className="font-semibold text-gray-800">Pro Workspace</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 px-3 py-1.5 bg-gray-100 rounded-full">
            <User className="w-4 h-4" />
            <span className="font-medium">{user?.full_name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* 2. SYNC TOAST NOTIFICATION (Shows when data is moving) */}
      {syncStatus !== "idle" && (
        <div className="absolute top-20 right-6 z-50 animate-in slide-in-from-right fade-in duration-300">
          <div className="bg-black text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 text-sm">
            {syncStatus === "syncing" ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Syncing your guest history...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>History synced to cloud!</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* 3. THE PRO TOOL (Unlimited & DB Connected) */}
      <div className="flex-1 overflow-hidden relative">
        {/* We pass isPro={true} so HeroSection knows to skip limits and use the DB */}
        <HeroSection isPro={true} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
