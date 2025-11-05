import { describe, it, expect } from 'vitest'
import { parseSSELine, processSSEBuffer } from '../sseUtils'

describe('sseUtils', () => {
    describe('parseSSELine', () => {
        it('should parse valid SSE line with content', () => {
            const line = 'data: {"choices":[{"delta":{"content":"Hello"}}]}'
            const result = parseSSELine(line)
            expect(result).toBe('Hello')
        })

        it('should return null for non-data lines', () => {
            const line = 'event: message'
            const result = parseSSELine(line)
            expect(result).toBeNull()
        })

        it('should return null for [DONE] marker', () => {
            const line = 'data: [DONE]'
            const result = parseSSELine(line)
            expect(result).toBeNull()
        })

        it('should return null for malformed JSON', () => {
            const line = 'data: {invalid json}'
            const result = parseSSELine(line)
            expect(result).toBeNull()
        })

        it('should return null when content is missing', () => {
            const line = 'data: {"choices":[{"delta":{}}]}'
            const result = parseSSELine(line)
            expect(result).toBeNull()
        })

        it('should return null for empty content', () => {
            const line = 'data: {"choices":[{"delta":{"content":""}}]}'
            const result = parseSSELine(line)
            expect(result).toBeNull() // Empty string is falsy, so || null returns null
        })

        it('should handle multiple chunks', () => {
            const line1 = 'data: {"choices":[{"delta":{"content":"Hello"}}]}'
            const line2 = 'data: {"choices":[{"delta":{"content":" World"}}]}'
            expect(parseSSELine(line1)).toBe('Hello')
            expect(parseSSELine(line2)).toBe(' World')
        })
    })

    describe('processSSEBuffer', () => {
        it('should process complete lines and keep incomplete line in buffer', () => {
            const buffer = 'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\ndata: {"choices":[{"delta":{"content":" World"}}]}\n\ndata: {"choices":[{"delta":{"content":"Incomplete'
            const result = processSSEBuffer(buffer)

            expect(result.deltas).toEqual(['Hello', ' World'])
            expect(result.newBuffer).toBe('data: {"choices":[{"delta":{"content":"Incomplete')
        })

        it('should return empty array and buffer for empty input', () => {
            const result = processSSEBuffer('')
            expect(result.deltas).toEqual([])
            expect(result.newBuffer).toBe('')
        })

        it('should handle single incomplete line', () => {
            const buffer = 'data: {"choices":[{"delta":{"content":"Incomplete'
            const result = processSSEBuffer(buffer)
            expect(result.deltas).toEqual([])
            expect(result.newBuffer).toBe(buffer)
        })

        it('should handle multiple complete lines', () => {
            const buffer = 'data: {"choices":[{"delta":{"content":"Chunk1"}}]}\n\ndata: {"choices":[{"delta":{"content":"Chunk2"}}]}\n\ndata: {"choices":[{"delta":{"content":"Chunk3"}}]}\n\n'
            const result = processSSEBuffer(buffer)
            expect(result.deltas).toEqual(['Chunk1', 'Chunk2', 'Chunk3'])
            expect(result.newBuffer).toBe('')
        })

        it('should filter out [DONE] markers', () => {
            const buffer = 'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\ndata: [DONE]\n\n'
            const result = processSSEBuffer(buffer)
            expect(result.deltas).toEqual(['Hello'])
        })

        it('should handle mixed valid and invalid lines', () => {
            const buffer = 'data: {"choices":[{"delta":{"content":"Valid"}}]}\n\ninvalid line\n\ndata: {"choices":[{"delta":{"content":"AlsoValid"}}]}\n\n'
            const result = processSSEBuffer(buffer)
            expect(result.deltas).toEqual(['Valid', 'AlsoValid'])
        })
    })
})

