import '@testing-library/jest-dom'
import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import { server } from './mocks/server'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Setup MSW server (only in Node environment for Vitest)
beforeAll(() => {
    if (typeof window === 'undefined' && 'listen' in server) {
        server.listen({ onUnhandledRequest: 'error' })
    }
})

// Reset handlers after each test
afterEach(() => {
    cleanup()
    // Clear localStorage
    localStorage.clear()
    // Clear all mocks
    vi.clearAllMocks()
    // Reset MSW handlers
    if ('resetHandlers' in server) {
        server.resetHandlers()
    }
})

// Clean up after all tests
afterAll(() => {
    if (typeof window === 'undefined' && 'close' in server) {
        server.close()
    }
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

// Mock ResizeObserver
if (typeof window !== 'undefined') {
    window.ResizeObserver = vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    })) as any
}

