import { useState } from "react";
import { API_ENDPOINT, SYSTEM_PROMPT, UI_TEXT } from "../constants";
import type { Conversation } from "../types";
import type { CouncilMemberData } from "./useCouncilMembers";
import { getStoredConversations, saveConversations } from "../utils/conversationStorage";
import { processSSEBuffer } from "../utils/sseUtils";
import { createTypingEffect } from "../utils/typingEffect";
import { STAGGER_DELAY_MS } from "../utils/apiConstants";

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

    const typingEffect = createTypingEffect(
      memberId,
      conversationIndex,
      memberModels,
      {
        setAnswer: (id, text) => {
          setAnswers((prev) => ({ ...prev, [id]: text }));
        },
        removeActiveMember: (id) => {
          setActiveMembers((prev) => prev.filter((memberId) => memberId !== id));
        },
        setAnswerToSilence: (id) => {
          setAnswers((prev) => ({ ...prev, [id]: UI_TEXT.STATUS.silence }));
        },
      }
    );
    typingEffect.start();

    try {
      // Make API request
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
      if (!reader) {
        throw new Error("No reader available");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      // Stream processing loop
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          typingEffect.markStreamDone();
          break;
        }

        // Decode chunk and process SSE lines
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const { newBuffer, deltas } = processSSEBuffer(buffer);
        buffer = newBuffer;

        // Append deltas to accumulated text
        for (const delta of deltas) {
          typingEffect.appendText(delta);
        }
      }

      typingEffect.finish();
      return true;
    } catch (error) {
      console.error("Error fetching member answer:", error);
      typingEffect.cleanup();
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

    // Create initial answers for all members
    const initialAnswers: Record<string, string | undefined> = {};
    members.forEach((member) => {
      initialAnswers[member.id] = undefined;
    });

    // Create and save new conversation
    const newConversation: Conversation = {
      timestamp: new Date().toISOString(),
      query,
      answers: initialAnswers,
      memberModels,
    };

    const existing = getStoredConversations();
    existing.push(newConversation);
    saveConversations(existing);
    const conversationIndex = existing.length - 1;

    // Initialize UI state
    setActiveMembers(members.map((m) => m.id));
    setAnswers(initialAnswers);

    // Stagger the requests so they don't all start streaming at once
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
    setAnswers((prev) => ({
      ...prev,
      [memberId]: undefined,
    }));
    setActiveMembers((prev) =>
      prev.includes(memberId) ? prev : [...prev, memberId]
    );

    // Get the latest conversation index
    const stored = getStoredConversations();
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

