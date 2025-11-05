import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Use node server for Vitest (runs in Node environment)
export const server = setupServer(...handlers)

