import { useCallback, useEffect, useState, useRef } from "react";
import {
  getHistory,
  storeHistory,
  addHistoryEntry,
  clearHistory as clearHistoryStorage,
} from "@/utils/analysisStorage";
import { getIconKeyFromSkinType } from "@/utils/iconMap";
import type { PredictResponse } from "@/interfaces/interfaces";

export type HistoryEntry = {
  id: string;
  type: string;
  primaryScore: string;
  dateLabel: string;
  breakdown?: { label: string; value: string }[];
  icon?: any;
};

export default function useHistory(initial: HistoryEntry[] = []) {
  const [history, setHistory] = useState<HistoryEntry[]>(initial);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const errorOccurredRef = useRef(false);

  // Load history from AsyncStorage on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await getHistory();
        if (mounted && Array.isArray(stored)) setHistory(stored as HistoryEntry[]);
      } catch {
        setErrorMessage("Failed to load history. Please try again.");
        setErrorModalVisible(true);
        errorOccurredRef.current = true;
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Add an entry to AsyncStorage + local state
  const addEntry = useCallback(async (entry: HistoryEntry) => {
    try {
      const updated = await addHistoryEntry(entry);
      if (Array.isArray(updated)) {
        setHistory(updated);
      } else {
        setHistory((prev) => [entry, ...prev]); // fallback local update
      }
    } catch {
      setErrorMessage("Failed to add history entry. Please try again.");
      setErrorModalVisible(true);
      setHistory((prev) => [entry, ...prev]); // fallback
      errorOccurredRef.current = true;
    }
  }, []);

  // Save a prediction result as a history entry
  const savePrediction = useCallback(
    async (result: PredictResponse) => {
      const id = Date.now().toString();

      const preds = (result.all_predictions || []).slice().sort(
        (a, b) => (b.confidence ?? 0) - (a.confidence ?? 0)
      );
      const top = preds[0];
      const nextTwo = preds.slice(1, 3);

      const entry: HistoryEntry = {
        id,
        type: result.skin_type || "",
        primaryScore: top
          ? top.confidence_display ?? `${Math.round((top.confidence ?? 0) * 100)}%`
          : result.confidence_display ?? `${Math.round((result.confidence ?? 0) * 100)}%`,
        dateLabel: new Date().toLocaleString(),
        breakdown: nextTwo.map((p) => ({
          label: p.label,
          value: p.confidence_display ?? `${Math.round((p.confidence ?? 0) * 100)}%`,
        })),
        icon: getIconKeyFromSkinType(result.skin_type),
      };

      await addEntry(entry);
    },
    [addEntry]
  );

  // Remove an entry
  const removeEntry = useCallback(async (id: string) => {
    try {
      const current = await getHistory();
      const updated = (current as HistoryEntry[]).filter((e) => e.id !== id);
      await storeHistory(updated);
      setHistory(updated);
    } catch {
      setErrorMessage("Failed to remove entry. Please try again.");
      setErrorModalVisible(true);
      setHistory((prev) => prev.filter((e) => e.id !== id)); // fallback local update
      errorOccurredRef.current = true;
    }
  }, []);

  // Clear all history
  const clearHistory = useCallback(async () => {
    try {
      await clearHistoryStorage();
      setHistory([]);
    } catch {
      setErrorMessage("Failed to clear history. Please try again.");
      setErrorModalVisible(true);
      setHistory([]); // fallback
      errorOccurredRef.current = true;
    }
  }, []);

  // Directly set history and store
  const setHistoryAndStore = useCallback(async (entries: HistoryEntry[]) => {
    setHistory(entries);
    try {
      await storeHistory(entries);
    } catch {
      setErrorMessage("Failed to update history. Please try again.");
      setErrorModalVisible(true);
      errorOccurredRef.current = true;
    }
  }, []);

  return {
    history,
    addEntry,
    removeEntry,
    clearHistory,
    setHistoryAndStore,
    savePrediction,
    errorModalVisible,
    setErrorModalVisible,
    errorMessage,
  } as const;
}
