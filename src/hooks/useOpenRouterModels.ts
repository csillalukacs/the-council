import { useState, useEffect } from "react";
import { FALLBACK_FREE_MODELS } from "../constants";

interface OpenRouterModel {
  id: string;
  pricing: {
    prompt: string;
    completion: string;
  };
}

export function useOpenRouterModels() {
  const [freeModels, setFreeModels] = useState<string[]>(FALLBACK_FREE_MODELS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/models");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const free: string[] = (data.data as OpenRouterModel[])
          .filter(
            (m) => m.pricing.prompt === "0" && m.pricing.completion === "0"
          )
          .map((m) => m.id)
          .sort();
        if (free.length > 0) setFreeModels(free);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch models"
        );
        // freeModels stays as FALLBACK_FREE_MODELS
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
  }, []);

  return { freeModels, loading, error };
}
