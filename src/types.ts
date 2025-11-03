// Shared type definitions

export interface Conversation {
  timestamp: string;
  query: string;
  answers: (string | undefined)[];
  models?: string[];
}
