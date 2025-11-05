# Testing Guide

This project uses a comprehensive testing setup with Vitest for unit/integration tests and Playwright for E2E tests.

## Test Structure

```
src/
├── __tests__/           # Test files (organized by feature)
│   ├── utils/          # Utility function tests
│   ├── hooks/          # React hook tests
│   └── components/     # Component tests
├── __e2e__/            # End-to-end tests (Playwright)
└── test/               # Test setup and mocks
    ├── setup.ts        # Global test setup
    └── mocks/          # MSW handlers for API mocking
```

## Running Tests

### Unit & Integration Tests (Vitest)
```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### E2E Tests (Playwright)
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run all tests (unit + E2E)
npm run test:all
```

## Test Coverage

The test suite covers:

### ✅ Unit Tests
- **Utilities**: `sseUtils`, `conversationStorage`, `typingEffect`
- **Hooks**: `useLocalStorage`, `useCouncilApi`
- **Components**: `ApiKeyInput`, `QueryInput`

### ✅ Integration Tests
- API integration with mocked SSE streams
- Conversation persistence
- Model selection and persistence

### ✅ E2E Tests
- User flows (API key entry, query submission)
- Persistence across page reloads
- UI interactions

## Writing Tests

### Example: Unit Test
```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from '../utils/myFunction'

describe('myFunction', () => {
  it('should do something', () => {
    expect(myFunction(input)).toBe(expected)
  })
})
```

### Example: Component Test
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('should handle user interaction', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)
    
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Clicked')).toBeInTheDocument()
  })
})
```

### Example: Hook Test
```typescript
import { renderHook, act } from '@testing-library/react'
import { useMyHook } from '../useMyHook'

describe('useMyHook', () => {
  it('should update state', () => {
    const { result } = renderHook(() => useMyHook())
    
    act(() => {
      result.current.updateState('new value')
    })
    
    expect(result.current.state).toBe('new value')
  })
})
```

## Mocking

### API Mocking (MSW)
API requests are mocked using Mock Service Worker. Handlers are defined in `src/test/mocks/handlers.ts`.

### LocalStorage Mocking
LocalStorage is automatically cleared between tests in the test setup.

## Best Practices

1. **Test behavior, not implementation**: Focus on what the code does, not how it does it
2. **Use descriptive test names**: Test names should clearly describe what they're testing
3. **Keep tests isolated**: Each test should be independent and not rely on others
4. **Mock external dependencies**: Use mocks for API calls, localStorage, etc.
5. **Test edge cases**: Include tests for error conditions and boundary cases

## Continuous Integration

Tests should be run in CI/CD pipelines. The project is configured to:
- Run all tests on pull requests
- Generate coverage reports
- Fail builds if tests fail

