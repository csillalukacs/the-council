import { useState } from "react";
import { API_ENDPOINT, SYSTEM_PROMPT, STORAGE_KEYS } from "../constants";

interface UseCouncilApiProps {
  apiKey: string | null;
  models: string[];
  members: Array<{ personality: string }>;
}

interface Conversation {
  timestamp: string;
  query: string;
  answers: (string | undefined)[];
  models: string[];
}

export function useCouncilApi({
  apiKey,
  models,
  members,
}: UseCouncilApiProps) {
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<(string | undefined)[]>(
    Array(members.length).fill(undefined)
  );
  const [activeMembers, setActiveMembers] = useState<number[]>([]);
  const [lastQuery, setLastQuery] = useState<string>("");

  const fetchMemberAnswer = async (
    memberIndex: number,
    query: string,
    conversationIndex?: number
  ) => {
    const member = members[memberIndex];
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: models[memberIndex],
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
        const newAnswers = [...prev];
        newAnswers[memberIndex] = output;

        // Auto-update this conversation in localStorage if conversationIndex is provided
        if (conversationIndex !== undefined) {
          const stored = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || "[]"
          ) as Conversation[];
          if (stored[conversationIndex]) {
            stored[conversationIndex].answers = newAnswers;
            localStorage.setItem(
              STORAGE_KEYS.CONVERSATIONS,
              JSON.stringify(stored)
            );
          }
        }

        return newAnswers;
      });
      setActiveMembers((prev) => prev.filter((x) => x !== memberIndex));
      return true;
    } catch {
      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[memberIndex] = "Error fetching response.";
        return newAnswers;
      });
      setActiveMembers((prev) => prev.filter((x) => x !== memberIndex));
      return false;
    }
  };

  const askCouncil = async (query: string) => {
    if (!query.trim() || !apiKey) return;

    setLoading(true);
    setLastQuery(query);

    // Create a new conversation entry
    const newConversation: Conversation = {
      timestamp: new Date().toISOString(),
      query,
      answers: Array(members.length).fill(undefined),
      models: [...models],
    };

    const existing = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || "[]"
    ) as Conversation[];
    existing.push(newConversation);
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(existing));
    const conversationIndex = existing.length - 1;

    setActiveMembers(Array.from({ length: members.length }, (_, i) => i));
    setAnswers(Array(members.length).fill(undefined));

    await Promise.allSettled(
      members.map(async (_, i) => {
        await fetchMemberAnswer(i, query, conversationIndex);
      })
    );

    setLoading(false);
  };

  const retryMember = async (memberIndex: number) => {
    if (!lastQuery.trim() || !apiKey) return;

    // Clear the error answer and set as active
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[memberIndex] = undefined;
      return newAnswers;
    });
    setActiveMembers((prev) => {
      if (!prev.includes(memberIndex)) {
        return [...prev, memberIndex];
      }
      return prev;
    });

    // Try to update the latest conversation in localStorage
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || "[]"
    ) as Conversation[];
    const conversationIndex =
      stored.length > 0 ? stored.length - 1 : undefined;

    await fetchMemberAnswer(memberIndex, lastQuery, conversationIndex);
  };

  return {
    loading,
    answers,
    activeMembers,
    askCouncil,
    retryMember,
  };
}

