import { useState } from "react";
import { API_ENDPOINT, SYSTEM_PROMPT, STORAGE_KEYS } from "../constants";
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
        }),
      });

      const data = await response.json();
      const output = data?.choices?.[0]?.message?.content ?? "*silence*";

      setAnswers((prev) => {
        const newAnswers = { ...prev, [memberId]: output };

        // Auto-update this conversation in localStorage if conversationIndex is provided
        if (conversationIndex !== undefined) {
          const stored = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || "[]"
          ) as Conversation[];
          if (stored[conversationIndex]) {
            stored[conversationIndex].answers = newAnswers;
            stored[conversationIndex].memberModels = memberModels;
            localStorage.setItem(
              STORAGE_KEYS.CONVERSATIONS,
              JSON.stringify(stored)
            );
          }
        }

        return newAnswers;
      });
      setActiveMembers((prev) => prev.filter((id) => id !== memberId));
      return true;
    } catch {
      setAnswers((prev) => ({
        ...prev,
        [memberId]: "Error fetching response.",
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

    await Promise.allSettled(
      members.map(async (member) => {
        await fetchMemberAnswer(member.id, query, conversationIndex);
      })
    );

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

