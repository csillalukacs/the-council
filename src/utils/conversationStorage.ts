import { STORAGE_KEYS } from "../constants";
import type { Conversation } from "../types";

/**
 * Get all conversations from localStorage
 */
export const getStoredConversations = (): Conversation[] => {
    return JSON.parse(
        localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || "[]"
    ) as Conversation[];
};

/**
 * Save conversations to localStorage
 */
export const saveConversations = (conversations: Conversation[]) => {
    localStorage.setItem(
        STORAGE_KEYS.CONVERSATIONS,
        JSON.stringify(conversations)
    );
};

/**
 * Update a specific conversation's answer in localStorage
 */
export const updateConversationAnswer = (
    conversationIndex: number,
    memberId: string,
    answer: string,
    memberModels: Record<string, string>
) => {
    const stored = getStoredConversations();
    if (stored[conversationIndex]) {
        stored[conversationIndex].answers = {
            ...stored[conversationIndex].answers,
            [memberId]: answer,
        };
        stored[conversationIndex].memberModels = memberModels;
        saveConversations(stored);
    }
};

