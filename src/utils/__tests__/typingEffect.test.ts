import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createTypingEffect } from '../typingEffect'
import * as conversationStorage from '../conversationStorage'

// Mock the conversationStorage module
vi.mock('../conversationStorage', () => ({
    updateConversationAnswer: vi.fn(),
}))

describe('typingEffect', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should accumulate text and display it gradually', () => {
        const callbacks = {
            setAnswer: vi.fn(),
            removeActiveMember: vi.fn(),
            setAnswerToSilence: vi.fn(),
        }

        const typingEffect = createTypingEffect(
            'member1',
            0,
            { member1: 'model1' },
            callbacks
        )

        typingEffect.start()

        // Append text
        typingEffect.appendText('Hello')
        typingEffect.appendText(' World')
        typingEffect.appendText('!')

        // Fast-forward time to allow typing effect to process
        vi.advanceTimersByTime(200)

        // Should have called setAnswer multiple times with progressively more text
        expect(callbacks.setAnswer).toHaveBeenCalled()
        const calls = callbacks.setAnswer.mock.calls
        expect(calls.length).toBeGreaterThan(0)

        // Last call should have the full text (or close to it)
        const lastCall = calls[calls.length - 1]
        expect(lastCall[1]).toContain('Hello')
    })

    it('should mark stream as done and clean up', () => {
        const callbacks = {
            setAnswer: vi.fn(),
            removeActiveMember: vi.fn(),
            setAnswerToSilence: vi.fn(),
        }

        const typingEffect = createTypingEffect(
            'member1',
            0,
            { member1: 'model1' },
            callbacks
        )

        typingEffect.start()
        typingEffect.appendText('Hello')
        typingEffect.markStreamDone()

        // Fast-forward to allow cleanup
        vi.advanceTimersByTime(500)

        expect(callbacks.removeActiveMember).toHaveBeenCalledWith('member1')
    })

    it('should handle empty stream and show silence', () => {
        const callbacks = {
            setAnswer: vi.fn(),
            removeActiveMember: vi.fn(),
            setAnswerToSilence: vi.fn(),
        }

        const typingEffect = createTypingEffect(
            'member1',
            0,
            { member1: 'model1' },
            callbacks
        )

        typingEffect.start()
        typingEffect.markStreamDone()

        // Fast-forward
        vi.advanceTimersByTime(100)

        expect(callbacks.setAnswerToSilence).toHaveBeenCalledWith('member1')
        expect(callbacks.removeActiveMember).toHaveBeenCalledWith('member1')
    })

    it('should update localStorage periodically', () => {
        const callbacks = {
            setAnswer: vi.fn(),
            removeActiveMember: vi.fn(),
            setAnswerToSilence: vi.fn(),
        }

        const typingEffect = createTypingEffect(
            'member1',
            0,
            { member1: 'model1' },
            callbacks
        )

        typingEffect.start()
        typingEffect.appendText('A'.repeat(250)) // Enough characters to trigger storage update

        // Fast-forward to trigger storage updates
        vi.advanceTimersByTime(1000)

        expect(conversationStorage.updateConversationAnswer).toHaveBeenCalled()
    })

    it('should finish and save final answer', () => {
        const callbacks = {
            setAnswer: vi.fn(),
            removeActiveMember: vi.fn(),
            setAnswerToSilence: vi.fn(),
        }

        const typingEffect = createTypingEffect(
            'member1',
            0,
            { member1: 'model1' },
            callbacks
        )

        typingEffect.start()
        typingEffect.appendText('Final answer')
        typingEffect.markStreamDone()

        // Wait for display to complete
        vi.advanceTimersByTime(1000)

        typingEffect.finish()

        expect(conversationStorage.updateConversationAnswer).toHaveBeenCalledWith(
            0,
            'member1',
            'Final answer',
            { member1: 'model1' }
        )
    })

    it('should handle cleanup when stream is done and all text is displayed', () => {
        const callbacks = {
            setAnswer: vi.fn(),
            removeActiveMember: vi.fn(),
            setAnswerToSilence: vi.fn(),
        }

        const typingEffect = createTypingEffect(
            'member1',
            undefined, // No conversation index
            { member1: 'model1' },
            callbacks
        )

        typingEffect.start()
        typingEffect.appendText('Short text')
        typingEffect.markStreamDone()

        // Fast-forward enough time for all text to be displayed
        vi.advanceTimersByTime(2000)

        expect(callbacks.removeActiveMember).toHaveBeenCalledWith('member1')
    })

    it('should handle cleanup manually', () => {
        const callbacks = {
            setAnswer: vi.fn(),
            removeActiveMember: vi.fn(),
            setAnswerToSilence: vi.fn(),
        }

        const typingEffect = createTypingEffect(
            'member1',
            0,
            { member1: 'model1' },
            callbacks
        )

        typingEffect.start()
        typingEffect.cleanup()

        expect(callbacks.removeActiveMember).toHaveBeenCalledWith('member1')
    })
})

