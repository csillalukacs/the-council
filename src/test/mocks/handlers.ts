import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock successful SSE streaming response
  http.post('https://openrouter.ai/api/v1/chat/completions', async ({ request }) => {
    const body = await request.json() as any
    
    // Create a mock SSE stream
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder()
        const messages = [
          'Hello',
          ' from',
          ' the',
          ' council',
          ' member',
        ]
        
        let index = 0
        const sendChunk = () => {
          if (index < messages.length) {
            const data = JSON.stringify({
              choices: [{
                delta: { content: messages[index] },
                finish_reason: null,
              }],
            })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            index++
            setTimeout(sendChunk, 10)
          } else {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          }
        }
        
        sendChunk()
      },
    })

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    })
  }),
]

