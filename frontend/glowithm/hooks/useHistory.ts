import { useCallback, useEffect, useState } from "react";
import { getHistory, storeHistory, addHistoryEntry, clearHistory as clearHistoryStorage } from "@/utils/analysisStorage";
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await getHistory();
        if (mounted && Array.isArray(stored)) setHistory(stored as HistoryEntry[]);
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const addEntry = useCallback(async (entry: HistoryEntry) => {
    try {
      const updated = await addHistoryEntry(entry);
      if (Array.isArray(updated)) setHistory(updated as HistoryEntry[]);
    } catch (err) {
      console.error("addEntry failed:", err);
      // fallback to local update
      setHistory((prev) => [entry, ...prev]);
    }
  }, []);

  const savePrediction = useCallback(async (result: PredictResponse) => {
    const id = Date.now().toString();

    // Sort predictions so we reliably pick top and the next two
    const preds = (result.all_predictions || []).slice().sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0));
    const top = preds[0];
    const nextTwo = preds.slice(1, 3);

    const entry: HistoryEntry = {
      id,
      // keep using server-provided skin_type as the displayed type to avoid changing UI
      type: result.skin_type || "",
      primaryScore: top ? (top.confidence_display ?? `${Math.round(((top.confidence ?? 0) * 100))}%`) : (result.confidence_display ?? `${Math.round(((result.confidence ?? 0) * 100))}%`),
      dateLabel: new Date().toLocaleString(),
      breakdown: nextTwo.map((p) => ({ label: p.label, value: p.confidence_display ?? `${Math.round(((p.confidence ?? 0) * 100))}%` })),
      icon: getIconKeyFromSkinType(result.skin_type),
    };

    await addEntry(entry);
  }, [addEntry]);

  const removeEntry = useCallback(async (id: string) => {
    try {
      const current = await getHistory();
      const updated = (current as HistoryEntry[]).filter((e) => e.id !== id);
      await storeHistory(updated);
      setHistory(updated as HistoryEntry[]);
    } catch (err) {
      console.error("removeEntry failed:", err);
      setHistory((prev) => prev.filter((e) => e.id !== id));
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await clearHistoryStorage();
      setHistory([]);
    } catch (err) {
      console.error("clearHistory failed:", err);
      setHistory([]);
    }
  }, []);

  const setHistoryAndStore = useCallback(async (entries: HistoryEntry[]) => {
    setHistory(entries);
    try {
      await storeHistory(entries);
    } catch (error) {
      console.error("Failed to persist history:", error);
    }
  }, []);

  return { history, addEntry, removeEntry, clearHistory, setHistory: setHistoryAndStore, savePrediction } as const;
}
