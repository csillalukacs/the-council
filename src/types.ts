// Shared type definitions

export interface Conversation {
  timestamp: string;
  query: string;
  answers: Record<string, string | undefined>; // Map of member ID -> answer
  memberModels?: Record<string, string>; // Map of member ID -> model
}
