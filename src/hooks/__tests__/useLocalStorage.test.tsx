import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useApiKey, useModels } from "../useLocalStorage";
import { STORAGE_KEYS, COUNCIL_SIZE, DEFAULT_MODEL } from "../../constants";

describe("useLocalStorage hooks", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("useApiKey", () => {
    it("should initialize with null when no key in localStorage", () => {
      const { result } = renderHook(() => useApiKey());
      expect(result.current[0]).toBeNull();
    });

    it("should load existing API key from localStorage", () => {
      const testKey = "test-api-key-123";
      localStorage.setItem(STORAGE_KEYS.API_KEY, testKey);

      const { result } = renderHook(() => useApiKey());
      expect(result.current[0]).toBe(testKey);
    });

    it("should save API key to localStorage when set", () => {
      const { result } = renderHook(() => useApiKey());
      const testKey = "new-api-key-456";

      act(() => {
        result.current[1](testKey);
      });

      expect(result.current[0]).toBe(testKey);
      expect(localStorage.getItem(STORAGE_KEYS.API_KEY)).toBe(testKey);
    });

    it("should remove API key from localStorage when set to null", () => {
      const testKey = "test-key";
      localStorage.setItem(STORAGE_KEYS.API_KEY, testKey);

      const { result } = renderHook(() => useApiKey());

      act(() => {
        result.current[1](null);
      });

      expect(result.current[0]).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.API_KEY)).toBeNull();
    });

    it("should handle function updates", () => {
      const initialKey = "initial-key";
      localStorage.setItem(STORAGE_KEYS.API_KEY, initialKey);

      const { result } = renderHook(() => useApiKey());

      act(() => {
        result.current[1]((prev) => (prev ? `${prev}-updated` : null));
      });

      expect(result.current[0]).toBe("initial-key-updated");
      expect(localStorage.getItem(STORAGE_KEYS.API_KEY)).toBe(
        "initial-key-updated"
      );
    });

    it("should save key with whitespace (trimming happens in component)", () => {
      const { result } = renderHook(() => useApiKey());

      act(() => {
        result.current[1]("  key-with-spaces  ");
      });

      // The hook doesn't trim - that's handled by ApiKeyInput component
      expect(result.current[0]).toBe("  key-with-spaces  ");
      expect(localStorage.getItem(STORAGE_KEYS.API_KEY)).toBe(
        "  key-with-spaces  "
      );
    });
  });

  describe("useModels", () => {
    it("should initialize with default model array", () => {
      const { result } = renderHook(() => useModels());
      expect(result.current[0]).toHaveLength(COUNCIL_SIZE);
      expect(result.current[0].every((model) => model === DEFAULT_MODEL)).toBe(
        true
      );
    });

    it("should load saved models from localStorage", () => {
      const savedModels = Array(COUNCIL_SIZE).fill("model-1");
      localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(savedModels));

      const { result } = renderHook(() => useModels());
      expect(result.current[0]).toEqual(savedModels);
    });

    it("should ignore invalid saved models (wrong length)", () => {
      const invalidModels = ["model1", "model2"]; // Wrong length
      localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(invalidModels));

      const { result } = renderHook(() => useModels());
      expect(result.current[0]).toHaveLength(COUNCIL_SIZE);
      expect(result.current[0].every((model) => model === DEFAULT_MODEL)).toBe(
        true
      );
    });

    it("should handle JSON parse error gracefully", () => {
      localStorage.setItem(STORAGE_KEYS.MODELS, "not-an-array");

      // The hook will throw on JSON.parse, so we need to catch it
      // In practice, this would be caught by error boundaries
      expect(() => {
        renderHook(() => useModels());
      }).toThrow();
    });

    it("should save models to localStorage when set", () => {
      const { result } = renderHook(() => useModels());
      const newModels = Array(COUNCIL_SIZE).fill("custom-model");

      act(() => {
        result.current[1](newModels);
      });

      expect(result.current[0]).toEqual(newModels);
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.MODELS)!);
      expect(stored).toEqual(newModels);
    });

    it("should handle function updates", () => {
      const { result } = renderHook(() => useModels());

      act(() => {
        result.current[1]((prev) => prev.map((_, i) => `model-${i}`));
      });

      expect(result.current[0]).toHaveLength(COUNCIL_SIZE);
      expect(result.current[0][0]).toBe("model-0");
      expect(result.current[0][COUNCIL_SIZE - 1]).toBe(
        `model-${COUNCIL_SIZE - 1}`
      );
    });

    it("should persist models across re-renders", () => {
      const { result, rerender } = renderHook(() => useModels());
      const newModels = Array(COUNCIL_SIZE).fill("persistent-model");

      act(() => {
        result.current[1](newModels);
      });

      rerender();

      expect(result.current[0]).toEqual(newModels);
    });
  });
});
