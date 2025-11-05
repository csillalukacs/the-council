import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QueryInput from '../QueryInput'

describe('QueryInput', () => {
  const mockSetQuery = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.innerHeight
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    })
  })

  it('should render textarea with placeholder', () => {
    render(<QueryInput query="" setQuery={mockSetQuery} />)

    const textarea = screen.getByPlaceholderText(/speak, citizen/i)
    expect(textarea).toBeInTheDocument()
  })

  it('should display initial query value', () => {
    render(<QueryInput query="Initial query" setQuery={mockSetQuery} />)

    const textarea = screen.getByPlaceholderText(/speak, citizen/i) as HTMLTextAreaElement
    expect(textarea.defaultValue).toBe('Initial query')
  })

  it('should call setQuery when user types', async () => {
    const user = userEvent.setup()
    
    render(<QueryInput query="" setQuery={mockSetQuery} />)

    const textarea = screen.getByPlaceholderText(/speak, citizen/i)
    await user.type(textarea, 'Test query')

    expect(mockSetQuery).toHaveBeenCalledTimes(10) // Called for each character
    expect(mockSetQuery).toHaveBeenLastCalledWith('Test query')
  })

  it('should adjust textarea height when content changes', async () => {
    const user = userEvent.setup()
    
    render(<QueryInput query="" setQuery={mockSetQuery} />)

    const textarea = screen.getByPlaceholderText(/speak, citizen/i) as HTMLTextAreaElement
    
    // Set initial height
    textarea.style.height = 'auto'
    
    await user.type(textarea, 'Line 1\nLine 2\nLine 3')

    // Height should be adjusted (auto means it was reset)
    expect(textarea.style.height).not.toBe('auto')
  })

  it('should respect max height ratio', async () => {
    const user = userEvent.setup()
    window.innerHeight = 1000 // 60% = 600px max
    
    render(<QueryInput query="" setQuery={mockSetQuery} />)

    const textarea = screen.getByPlaceholderText(/speak, citizen/i) as HTMLTextAreaElement
    
    // Type a lot of content
    const longText = 'Line\n'.repeat(200)
    await user.type(textarea, longText)

    // Height should be capped at maxHeightRatio
    const height = parseInt(textarea.style.height)
    expect(height).toBeLessThanOrEqual(600) // 60% of 1000px
  })

  it('should handle empty query', async () => {
    const user = userEvent.setup()
    
    render(<QueryInput query="Initial" setQuery={mockSetQuery} />)

    const textarea = screen.getByPlaceholderText(/speak, citizen/i)
    
    // Clear the textarea
    await user.clear(textarea)
    await user.type(textarea, 'New query')

    expect(mockSetQuery).toHaveBeenCalled()
  })

  it('should handle multi-line input', async () => {
    const user = userEvent.setup()
    
    render(<QueryInput query="" setQuery={mockSetQuery} />)

    const textarea = screen.getByPlaceholderText(/speak, citizen/i)
    await user.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3')

    expect(mockSetQuery).toHaveBeenCalled()
    const lastCall = mockSetQuery.mock.calls[mockSetQuery.mock.calls.length - 1]
    expect(lastCall[0]).toContain('Line 1')
    expect(lastCall[0]).toContain('Line 2')
    expect(lastCall[0]).toContain('Line 3')
  })
})

