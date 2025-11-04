// lib/store/useAuthStore.ts

import { create } from 'zustand';
import { User } from '../generated/prisma/client'; // Assuming this type from Prisma

// Define the shape of your store's state
interface AuthState {
  user: User | null; // The current user, or null if not logged in
  isLoading: boolean; // True when checking auth status on load
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create the store
export const useAuthStore = create<AuthState>((set) => ({
  
  user: null,
  isLoading: true, // Start in loading state until we check

 
  fetchUser: async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const user = await response.json();
        set({ user: user, isLoading: false });
      } else {
        // No valid session (401) or other error
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      set({ user: null, isLoading: false });
    }
  },

  /**
   * Logs the user out by calling the API and clearing the local state.
   */
  logout: async () => {
    try {
      // Call the API route to delete the session
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
    // Clear the user from the store regardless of API success
    set({ user: null });
  },
}));