import { useState } from "react";
import { API_ENDPOINT, SYSTEM_PROMPT, STORAGE_KEYS, UI_TEXT } from "../constants";
import type { Conversation } from "../types";
import type { CouncilMemberData } from "./useCouncilMembers";

interface UseCouncilApiProps {
  apiKey: string | null;
  models: string[];
  members: CouncilMemberData[];
}

export function useCouncilApi({
  apiKey,
  models,
  members,
}: UseCouncilApiProps) {
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | undefined>>(
    {}
  );
  const [activeMembers, setActiveMembers] = useState<string[]>([]);
  const [lastQuery, setLastQuery] = useState<string>("");

  // Create a map from member ID to model for quick lookup
  const memberModels = members.reduce(
    (acc, member, i) => {
      acc[member.id] = models[i] || models[0] || "";
      return acc;
    },
    {} as Record<string, string>
  );

  const fetchMemberAnswer = async (
    memberId: string,
    query: string,
    conversationIndex?: number
  ) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return false;

    let updateInterval: ReturnType<typeof setInterval> | undefined;

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: memberModels[memberId],
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "system", content: member.personality },
            { role: "user", content: query },
          ],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let displayedText = ""; // Text currently shown in UI
      let updateCount = 0; // Counter to throttle localStorage updates
      let buffer = ""; // Buffer for incomplete SSE lines
      let lastUpdateTime = Date.now();
      let streamDone = false; // Track if stream has completed
      const TYPING_DELAY_MS = 50; // Delay between character updates (50ms = ~20 chars/sec)

      if (!reader) {
        throw new Error("No reader available");
      }

      // Function to update displayed text at controlled rate
      const updateDisplayedText = () => {
        const now = Date.now();
        if (now - lastUpdateTime >= TYPING_DELAY_MS && displayedText.length < accumulatedText.length) {
          // Add a few characters at a time for smoother effect
          const charsToAdd = Math.min(3, accumulatedText.length - displayedText.length);
          displayedText = accumulatedText.slice(0, displayedText.length + charsToAdd);
          lastUpdateTime = now;

          setAnswers((prev) => {
            const newAnswers = {
              ...prev,
              [memberId]: displayedText,
            };

            // Periodically update localStorage (throttled: every 10 updates or every 200 chars)
            updateCount++;
            const shouldUpdateStorage =
              conversationIndex !== undefined &&
              (updateCount % 10 === 0 || displayedText.length % 200 === 0);

            if (shouldUpdateStorage) {
              const stored = JSON.parse(
                localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || "[]"
              ) as Conversation[];
              if (stored[conversationIndex]) {
                stored[conversationIndex].answers = {
                  ...stored[conversationIndex].answers,
                  [memberId]: accumulatedText, // Store full text, not displayed text
                };
                stored[conversationIndex].memberModels = memberModels;
                localStorage.setItem(
                  STORAGE_KEYS.CONVERSATIONS,
                  JSON.stringify(stored)
                );
              }
            }

            return newAnswers;
          });
        }

        // If stream is done and all text has been displayed, clean up
        if (streamDone && displayedText.length === accumulatedText.length) {
          clearInterval(updateInterval);
          setActiveMembers((prev) => prev.filter((id) => id !== memberId));

          // Final update to localStorage
          if (conversationIndex !== undefined) {
            const stored = JSON.parse(
              localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || "[]"
            ) as Conversation[];
            if (stored[conversationIndex]) {
              stored[conversationIndex].answers = {
                ...stored[conversationIndex].answers,
                [memberId]: accumulatedText || UI_TEXT.STATUS.silence,
              };
              stored[conversationIndex].memberModels = memberModels;
              localStorage.setItem(
                STORAGE_KEYS.CONVERSATIONS,
                JSON.stringify(stored)
              );
            }
          }
        }
      };

      // Start update interval for typing effect
      updateInterval = setInterval(updateDisplayedText, TYPING_DELAY_MS);

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Stream complete - mark as done but let typing effect continue
          streamDone = true;
          // If there's no text to display, clean up immediately
          if (!accumulatedText) {
            clearInterval(updateInterval);
            setAnswers((prev) => ({
              ...prev,
              [memberId]: UI_TEXT.STATUS.silence,
            }));
            setActiveMembers((prev) => prev.filter((id) => id !== memberId));

            // Final update to localStorage
            if (conversationIndex !== undefined) {
              const stored = JSON.parse(
                localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || "[]"
              ) as Conversation[];
              if (stored[conversationIndex]) {
                stored[conversationIndex].answers = {
                  ...stored[conversationIndex].answers,
                  [memberId]: UI_TEXT.STATUS.silence,
                };
                stored[conversationIndex].memberModels = memberModels;
                localStorage.setItem(
                  STORAGE_KEYS.CONVERSATIONS,
                  JSON.stringify(stored)
                );
              }
            }
          }
          // Otherwise, the interval will continue until all text is displayed
          break;
        }

        // Decode chunk and append to buffer
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Split by newlines, but keep the last potentially incomplete line in buffer
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep the last incomplete line

        // Parse SSE format
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6); // Remove "data: " prefix

            // Skip [DONE] marker
            if (data === "[DONE]") {
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;

              if (delta) {
                accumulatedText += delta;
                // Displayed text will be updated by the interval timer
                updateDisplayedText();
              }
            } catch (e) {
              // Skip malformed JSON lines
              console.warn("Failed to parse SSE data:", data, e);
            }
          }
        }
      }

      return true;
    } catch (error) {
      console.error("Error fetching member answer:", error);
      // Clear interval if it exists
      if (updateInterval) {
        clearInterval(updateInterval);
      }
      setAnswers((prev) => ({
        ...prev,
        [memberId]: UI_TEXT.STATUS.silence,
      }));
      setActiveMembers((prev) => prev.filter((id) => id !== memberId));
      return false;
    }
  };

  const askCouncil = async (query: string) => {
    if (!query.trim() || !apiKey) return;

    setLoading(true);
    setLastQuery(query);

    // Create a new conversation entry
    const initialAnswers: Record<string, string | undefined> = {};
    members.forEach((member) => {
      initialAnswers[member.id] = undefined;
    });

    const newConversation: Conversation = {
      timestamp: new Date().toISOString(),
      query,
      answers: initialAnswers,
      memberModels,
    };

    const existing = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || "[]"
    ) as Conversation[];
    existing.push(newConversation);
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(existing));
    const conversationIndex = existing.length - 1;

    setActiveMembers(members.map((m) => m.id));
    setAnswers(initialAnswers);

    // Stagger the requests so they don't all start streaming at once
    const STAGGER_DELAY_MS = 1000; // Delay between starting each request
    const requestPromises = members.map((member, index) => {
      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          await fetchMemberAnswer(member.id, query, conversationIndex);
          resolve();
        }, index * STAGGER_DELAY_MS);
      });
    });

    await Promise.allSettled(requestPromises);

    setLoading(false);
  };

  const retryMember = async (memberId: string) => {
    if (!lastQuery.trim() || !apiKey) return;

    // Clear the error answer and set as active
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      newAnswers[memberId] = undefined;
      return newAnswers;
    });
    setActiveMembers((prev) => {
      if (!prev.includes(memberId)) {
        return [...prev, memberId];
      }
      return prev;
    });

    // Try to update the latest conversation in localStorage
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || "[]"
    ) as Conversation[];
    const conversationIndex =
      stored.length > 0 ? stored.length - 1 : undefined;

    await fetchMemberAnswer(memberId, lastQuery, conversationIndex);
  };

  return {
    loading,
    answers,
    activeMembers,
    askCouncil,
    retryMember,
  };
}

