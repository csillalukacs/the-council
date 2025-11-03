/**
 * Parse SSE line and extract content delta
 */
export const parseSSELine = (line: string): string | null => {
  if (!line.startsWith("data: ")) {
    return null;
  }

  const data = line.slice(6); // Remove "data: " prefix

  // Skip [DONE] marker
  if (data === "[DONE]") {
    return null;
  }

  try {
    const parsed = JSON.parse(data);
    return parsed.choices?.[0]?.delta?.content || null;
  } catch (e) {
    console.warn("Failed to parse SSE data:", data, e);
    return null;
  }
};

/**
 * Process SSE buffer and extract content deltas
 */
export const processSSEBuffer = (
  buffer: string
): { newBuffer: string; deltas: string[] } => {
  const deltas: string[] = [];
  const lines = buffer.split("\n");
  const newBuffer = lines.pop() || ""; // Keep the last incomplete line

  for (const line of lines) {
    const delta = parseSSELine(line);
    if (delta) {
      deltas.push(delta);
    }
  }

  return { newBuffer, deltas };
};

