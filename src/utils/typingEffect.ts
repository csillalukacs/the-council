import { UI_TEXT } from "../constants";
import { updateConversationAnswer } from "./conversationStorage";

// Constants
const TYPING_DELAY_MS = 50; // Delay between character updates (~20 chars/sec)
const STORAGE_UPDATE_INTERVAL = 10; // Update localStorage every N display updates
const STORAGE_UPDATE_CHAR_THRESHOLD = 200; // Update localStorage every N characters

/**
 * Typing effect manager interface
 */
export interface TypingEffectCallbacks {
    setAnswer: (memberId: string, text: string) => void;
    removeActiveMember: (memberId: string) => void;
    setAnswerToSilence: (memberId: string) => void;
}

/**
 * Create typing effect manager
 * Manages the gradual display of streaming text with a typing animation effect
 */
export const createTypingEffect = (
    memberId: string,
    conversationIndex: number | undefined,
    memberModels: Record<string, string>,
    callbacks: TypingEffectCallbacks
) => {
    let accumulatedText = "";
    let displayedText = "";
    let updateCount = 0;
    let lastUpdateTime = Date.now();
    let streamDone = false;
    let updateInterval: ReturnType<typeof setInterval> | undefined;

    const updateDisplay = () => {
        const now = Date.now();
        const shouldUpdateDisplay =
            now - lastUpdateTime >= TYPING_DELAY_MS &&
            displayedText.length < accumulatedText.length;

        if (shouldUpdateDisplay) {
            // Add a few characters at a time for smoother effect
            const charsToAdd = Math.min(
                3,
                accumulatedText.length - displayedText.length
            );
            displayedText = accumulatedText.slice(
                0,
                displayedText.length + charsToAdd
            );
            lastUpdateTime = now;

            callbacks.setAnswer(memberId, displayedText);

            // Periodically update localStorage (throttled)
            updateCount++;
            const shouldUpdateStorage =
                conversationIndex !== undefined &&
                (updateCount % STORAGE_UPDATE_INTERVAL === 0 ||
                    displayedText.length % STORAGE_UPDATE_CHAR_THRESHOLD === 0);

            if (shouldUpdateStorage) {
                updateConversationAnswer(
                    conversationIndex,
                    memberId,
                    accumulatedText, // Store full text, not displayed text
                    memberModels
                );
            }
        }

        // Clean up when stream is done and all text has been displayed
        if (streamDone && displayedText.length === accumulatedText.length) {
            cleanup();
        }
    };

    const cleanup = () => {
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = undefined;
        }
        callbacks.removeActiveMember(memberId);
    };

    const finish = () => {
        if (conversationIndex !== undefined) {
            const finalAnswer = accumulatedText || UI_TEXT.STATUS.silence;
            updateConversationAnswer(
                conversationIndex,
                memberId,
                finalAnswer,
                memberModels
            );
        }
    };

    const start = () => {
        updateInterval = setInterval(updateDisplay, TYPING_DELAY_MS);
    };

    const markStreamDone = () => {
        streamDone = true;
        // If there's no text, clean up immediately
        if (!accumulatedText) {
            cleanup();
            callbacks.setAnswerToSilence(memberId);
            finish();
        }
    };

    const appendText = (delta: string) => {
        accumulatedText += delta;
        updateDisplay();
    };

    return { start, markStreamDone, appendText, cleanup, finish };
};

