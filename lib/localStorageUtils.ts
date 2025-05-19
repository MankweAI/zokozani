// lib/localStorageUtils.ts
import { type TributeCardData } from "@/components/TributeCardComponent";

const TRIBUTES_STORAGE_KEY_PREFIX = "tributeWall_tributes_";

const getStorageKey = (deceasedFullName: string): string => {
  const keySuffix = deceasedFullName
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w-]/g, "");
  return `${TRIBUTES_STORAGE_KEY_PREFIX}${keySuffix || "default"}`;
};

export const loadTributesFromLocalStorage = (
  deceasedFullName: string
): TributeCardData[] => {
  const storageKey = getStorageKey(deceasedFullName);
  if (typeof window !== "undefined") {
    try {
      const storedTributes = localStorage.getItem(storageKey);
      if (storedTributes) {
        const parsedTributes: TributeCardData[] = JSON.parse(storedTributes);
        return parsedTributes
          .map((tribute) => ({
            ...tribute,
            timestamp: Number(tribute.timestamp),
          }))
          .sort((a, b) => b.timestamp - a.timestamp);
      }
      return [];
    } catch (error) {
      console.error("Error loading tributes from localStorage:", error);
      return [];
    }
  }
  return [];
};

export const saveTributesToLocalStorage = (
  deceasedFullName: string,
  tributes: TributeCardData[]
): void => {
  const storageKey = getStorageKey(deceasedFullName);
  if (typeof window !== "undefined") {
    try {
      const tributesToSave = [...tributes].sort(
        (a, b) => b.timestamp - a.timestamp
      );
      localStorage.setItem(storageKey, JSON.stringify(tributesToSave));
    } catch (error) {
      console.error("Error saving tributes to localStorage:", error);
    }
  }
};
