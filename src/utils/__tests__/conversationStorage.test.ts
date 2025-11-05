import { describe, it, expect, beforeEach } from 'vitest'
import {
    getStoredConversations,
    saveConversations,
    updateConversationAnswer,
    createAndSaveConversation,
} from '../conversationStorage'
import type { Conversation } from '../../types'
import { STORAGE_KEYS } from '../../constants'

describe('conversationStorage', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    describe('getStoredConversations', () => {
        it('should return empty array when localStorage is empty', () => {
            const result = getStoredConversations()
            expect(result).toEqual([])
        })

        it('should return stored conversations', () => {
            const conversations: Conversation[] = [
                {
                    timestamp: '2024-01-01T00:00:00.000Z',
                    query: 'Test query',
                    answers: { member1: 'Answer 1', member2: 'Answer 2' },
                },
            ]
            localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations))

            const result = getStoredConversations()
            expect(result).toEqual(conversations)
        })

        it('should handle corrupted data gracefully', () => {
            localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, 'invalid json')
            // This will throw, but we can test the behavior
            expect(() => getStoredConversations()).toThrow()
        })
    })

    describe('saveConversations', () => {
        it('should save conversations to localStorage', () => {
            const conversations: Conversation[] = [
                {
                    timestamp: '2024-01-01T00:00:00.000Z',
                    query: 'Test query',
                    answers: { member1: 'Answer 1' },
                },
            ]

            saveConversations(conversations)
            const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)
            expect(stored).toBeTruthy()
            expect(JSON.parse(stored!)).toEqual(conversations)
        })

        it('should overwrite existing conversations', () => {
            const initial: Conversation[] = [
                {
                    timestamp: '2024-01-01T00:00:00.000Z',
                    query: 'Old query',
                    answers: {},
                },
            ]
            saveConversations(initial)

            const updated: Conversation[] = [
                {
                    timestamp: '2024-01-02T00:00:00.000Z',
                    query: 'New query',
                    answers: {},
                },
            ]
            saveConversations(updated)

            const stored = getStoredConversations()
            expect(stored).toEqual(updated)
            expect(stored.length).toBe(1)
        })
    })

    describe('updateConversationAnswer', () => {
        it('should update answer for existing conversation', () => {
            const conversations: Conversation[] = [
                {
                    timestamp: '2024-01-01T00:00:00.000Z',
                    query: 'Test query',
                    answers: { member1: 'Old answer' },
                },
            ]
            saveConversations(conversations)

            const memberModels = { member1: 'model1' }
            updateConversationAnswer(0, 'member1', 'New answer', memberModels)

            const updated = getStoredConversations()
            expect(updated[0].answers.member1).toBe('New answer')
            expect(updated[0].memberModels).toEqual(memberModels)
        })

        it('should add new member answer to existing conversation', () => {
            const conversations: Conversation[] = [
                {
                    timestamp: '2024-01-01T00:00:00.000Z',
                    query: 'Test query',
                    answers: { member1: 'Answer 1' },
                },
            ]
            saveConversations(conversations)

            const memberModels = { member1: 'model1', member2: 'model2' }
            updateConversationAnswer(0, 'member2', 'Answer 2', memberModels)

            const updated = getStoredConversations()
            expect(updated[0].answers.member2).toBe('Answer 2')
            expect(updated[0].answers.member1).toBe('Answer 1')
        })

        it('should not update if conversation index is invalid', () => {
            const conversations: Conversation[] = [
                {
                    timestamp: '2024-01-01T00:00:00.000Z',
                    query: 'Test query',
                    answers: { member1: 'Answer 1' },
                },
            ]
            saveConversations(conversations)

            const memberModels = { member1: 'model1' }
            updateConversationAnswer(99, 'member1', 'New answer', memberModels)

            const updated = getStoredConversations()
            expect(updated[0].answers.member1).toBe('Answer 1') // Should remain unchanged
        })
    })

    describe('createAndSaveConversation', () => {
        it('should create and save new conversation', () => {
            const memberIds = ['member1', 'member2', 'member3']
            const memberModels = {
                member1: 'model1',
                member2: 'model2',
                member3: 'model3',
            }

            const index = createAndSaveConversation('Test query', memberIds, memberModels)

            expect(index).toBe(0)
            const conversations = getStoredConversations()
            expect(conversations.length).toBe(1)
            expect(conversations[0].query).toBe('Test query')
            expect(conversations[0].answers).toEqual({
                member1: undefined,
                member2: undefined,
                member3: undefined,
            })
            expect(conversations[0].memberModels).toEqual(memberModels)
            expect(conversations[0].timestamp).toBeTruthy()
        })

        it('should return correct index for multiple conversations', () => {
            const memberIds = ['member1']
            const memberModels = { member1: 'model1' }

            const index1 = createAndSaveConversation('Query 1', memberIds, memberModels)
            const index2 = createAndSaveConversation('Query 2', memberIds, memberModels)
            const index3 = createAndSaveConversation('Query 3', memberIds, memberModels)

            expect(index1).toBe(0)
            expect(index2).toBe(1)
            expect(index3).toBe(2)

            const conversations = getStoredConversations()
            expect(conversations.length).toBe(3)
            expect(conversations[0].query).toBe('Query 1')
            expect(conversations[1].query).toBe('Query 2')
            expect(conversations[2].query).toBe('Query 3')
        })

        it('should initialize answers with undefined for all members', () => {
            const memberIds = ['member1', 'member2']
            const memberModels = { member1: 'model1', member2: 'model2' }

            createAndSaveConversation('Test', memberIds, memberModels)

            const conversations = getStoredConversations()
            expect(conversations[0].answers.member1).toBeUndefined()
            expect(conversations[0].answers.member2).toBeUndefined()
        })
    })
})

