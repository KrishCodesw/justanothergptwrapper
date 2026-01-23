"use client";

import { useState, useEffect } from "react";

export interface HistoryItem {
  id: string;
  query: string;              // original input
  sql?: string;   
  type: "GENERATE" | "CORRECT"|"EXPLAIN";            // corrected SQL (optional)
  processedData?: {           // full processed data
    original: string;
    corrected: string;
    type: string;
    changes_made: string[];
    risk_level: string;
    confidence?: number;
  };
  schema?: any;               // optional schema info
  timestamp: number;
}


const STORAGE_KEY = "sql_history_sessions";

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [dbHistory, setDbHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // Prevents hydration mismatch

  // 1. LOAD: Run once when the component mounts (Client-side only)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
        // If data is corrupt, wipe it so the app doesn't crash
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. SAVE: Helper to add item and persist
  const addToHistory = (
  query: string,
  type: "GENERATE" | "CORRECT"|"EXPLAIN",
  sql?: string,
  schema?: string,
  processedData?: any,
  toDb: boolean = false
) => {
  const newItem: HistoryItem = {
    id: Date.now().toString(),
    query,
    type,
    sql,
    schema,
    processedData,
    timestamp: Date.now(),
  };

  if (toDb) {
      const updatedDb = [newItem, ...dbHistory];
      setDbHistory(updatedDb);
    } else {
      const updated = [newItem, ...history];
      setHistory(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
};


  // 3. DELETE: Helper to remove item and persist
  const removeHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // 4. CLEAR: Helper to wipe everything
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    addToHistory,
    dbHistory,
    setDbHistory,
    removeHistoryItem,
    clearHistory,
    setHistory,
    isLoaded,
  };
}