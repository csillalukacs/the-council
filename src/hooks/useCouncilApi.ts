import { useState } from "react";
import type { CouncilMemberData } from "./useCouncilMembers";
import { UI_TEXT } from "../constants";
import { getStoredConversations } from "../utils/conversationStorage";
import { createAndSaveConversation } from "../utils/conversationStorage";
import { fetchMemberAnswer } from "../utils/memberApiHelpers";
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

  const handleFetchMemberAnswer = async (
    memberId: string,
    query: string,
    conversationIndex?: number
  ) => {
    const member = members.find((m) => m.id === memberId);
    if (!member || !apiKey) return false;

    return fetchMemberAnswer({
      memberId,
      query,
      conversationIndex,
      member,
      model: memberModels[memberId],
      apiKey,
      memberModels,
      callbacks: {
        setAnswer: (id, text) => {
          setAnswers((prev) => ({ ...prev, [id]: text }));
        },
        removeActiveMember: (id) => {
          setActiveMembers((prev) => prev.filter((memberId) => memberId !== id));
        },
        setAnswerToSilence: (id) => {
          setAnswers((prev) => ({ ...prev, [id]: UI_TEXT.STATUS.silence }));
        },
      },
    });
  };

  const askCouncil = async (query: string) => {
    if (!query.trim() || !apiKey) return;

    setLoading(true);
    setLastQuery(query);

    // Create and save new conversation
    const conversationIndex = createAndSaveConversation(
      query,
      members.map((m) => m.id),
      memberModels
    );

    // Initialize UI state
    const initialAnswers: Record<string, string | undefined> = {};
    members.forEach((member) => {
      initialAnswers[member.id] = undefined;
    });
    setActiveMembers(members.map((m) => m.id));
    setAnswers(initialAnswers);

    // Stagger the requests so they don't all start streaming at once
    const requestPromises = members.map((member, index) => {
      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          await handleFetchMemberAnswer(member.id, query, conversationIndex);
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

    await handleFetchMemberAnswer(memberId, lastQuery, conversationIndex);
  };

  return {
    loading,
    answers,
    activeMembers,
    askCouncil,
    retryMember,
  };
}

