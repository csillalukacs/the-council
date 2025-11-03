import { API_ENDPOINT, SYSTEM_PROMPT } from "../constants";
import type { CouncilMemberData } from "../hooks/useCouncilMembers";
import { processSSEBuffer } from "./sseUtils";
import { createTypingEffect } from "./typingEffect";

interface FetchMemberAnswerParams {
    memberId: string;
    query: string;
    conversationIndex: number | undefined;
    member: CouncilMemberData;
    model: string;
    apiKey: string;
    memberModels: Record<string, string>;
    callbacks: {
        setAnswer: (id: string, text: string) => void;
        removeActiveMember: (id: string) => void;
        setAnswerToSilence: (id: string) => void;
    };
}

/**
 * Fetch a single member's answer from the API with streaming support
 */
export async function fetchMemberAnswer({
    memberId,
    query,
    conversationIndex,
    member,
    model,
    apiKey,
    memberModels,
    callbacks,
}: FetchMemberAnswerParams): Promise<boolean> {
    const typingEffect = createTypingEffect(
        memberId,
        conversationIndex,
        memberModels,
        callbacks
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
                model,
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
        callbacks.setAnswerToSilence(memberId);
        callbacks.removeActiveMember(memberId);
        return false;
    }
}

