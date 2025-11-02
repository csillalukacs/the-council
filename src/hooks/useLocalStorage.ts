import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  STORAGE_KEYS,
  COUNCIL_SIZE,
  DEFAULT_MODEL,
} from "../constants";

export function useApiKey(): [
  string | null,
  Dispatch<SetStateAction<string | null>>
] {
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
    if (savedKey) {
      setApiKeyState(savedKey);
    }
  }, []);

  const setApiKey: Dispatch<SetStateAction<string | null>> = (key) => {
    if (typeof key === "function") {
      setApiKeyState((prev) => {
        const newKey = key(prev);
        if (newKey) {
          localStorage.setItem(STORAGE_KEYS.API_KEY, newKey);
        } else {
          localStorage.removeItem(STORAGE_KEYS.API_KEY);
        }
        return newKey;
      });
    } else {
      if (key) {
        localStorage.setItem(STORAGE_KEYS.API_KEY, key);
      } else {
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
      }
      setApiKeyState(key);
    }
  };

  return [apiKey, setApiKey];
}

export function useModels(): [
  string[],
  Dispatch<SetStateAction<string[]>>
] {
  const [models, setModelsState] = useState<string[]>(
    Array(COUNCIL_SIZE).fill(DEFAULT_MODEL)
  );

  useEffect(() => {
    const savedModels = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.MODELS) || "[]"
    );
    if (Array.isArray(savedModels) && savedModels.length === COUNCIL_SIZE) {
      setModelsState(savedModels);
    }
  }, []);

  const setModels: Dispatch<SetStateAction<string[]>> = (newModels) => {
    if (typeof newModels === "function") {
      setModelsState((prev) => {
        const updated = newModels(prev);
        localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(updated));
        return updated;
      });
    } else {
      setModelsState(newModels);
      localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(newModels));
    }
  };

  return [models, setModels];
}

