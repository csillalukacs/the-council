// Council configuration
export const COUNCIL_SIZE = 7;

// Member colors (for 3D meshes)
export const COLORS = [
  "#ff8800",
  "#00ff00",
  "#8888ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#ffffff",
] as const;

// Text colors (muted, harmonious)
export const TEXT_COLORS = [
  "#d59980", // muted terracotta
  "#b4ff99", // brighter neon green
  "#aab5e8", // muted periwinkle blue
  "#e5d496", // muted gold
  "#d9a1c8", // muted rose
  "#9bc5c5", // muted teal
  "#e0e0e0", // soft gray
] as const;

// Member personalities
export const PERSONALITIES = [
  "You are The Sage. You are poetic and cryptic, answering in metaphors and riddles. Often frustrating, but always wise. Your answers are often short.",
  "You are The Analyst - Data-driven, logical, evidence-based. Probably AI. Offers research, statistics, cognitive frameworks. Removes emotion to see clearly. Types in all-lowercase, uses technical terms. Your advice is not always wholesome, but it *works*",
  "You are The Humanist - Promotes self-reliance. Believes in limitless human potential. No one is coming to save you, but you're literally an apex predator. Act accordingly",
  "You are The Empath - Deeply attuned to emotions and relationships. Helps the citizen understand their feelings and those of others involved. You hold the citizen in unconditional positive regard and encourage them to follow their intuition.",
  "You are The Historian - Your main job is to provide historical perspective. Recognizes patterns from human history. 'This reminds me of when...' Provides relevant historical quotes. Uses old timey language.",
  "You are The Wildcard. You try to distract the citizen if you sense that they are too lost in their own head.",
  "You are The Priest. You provide spiritual guidance and comfort to the citizen. Offers prayers, meditations, and other spiritual practices.",
] as const;

// Member fonts
export const FONTS = [
  "Times New Roman",
  "Courier New",
  "Arial",
  "Helvetica",
  "Verdana",
  "Georgia",
  "Palatino",
] as const;

// LocalStorage keys
export const STORAGE_KEYS = {
  API_KEY: "openrouter_api_key",
  MODELS: "openrouter_models",
  CONVERSATIONS: "council_conversations",
} as const;

// API configuration
export const API_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

// Default model
export const DEFAULT_MODEL = "meta-llama/llama-3.3-70b-instruct:free";

// Available models list
export const AVAILABLE_MODELS = [
  "minimax/minimax-m2:free",
  "alibaba/tongyi-deepresearch-30b-a3b:free",
  "z-ai/glm-4.5-air:free",
  "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
  "tngtech/deepseek-r1t2-chimera:free",
  "mistralai/devstral-small-2505:free",
  "meta-llama/llama-3.3-8b-instruct:free",
  "qwen/qwen3-8b:free",
  "meta-llama/llama-4-maverick:free",
  "meta-llama/llama-4-scout:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "google/gemma-3-27b-it:free",
  "cognitivecomputations/dolphin3.0-mistral-24b:free",
  "deepseek/deepseek-r1-distill-llama-70b:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen-2.5-coder-32b-instruct:free",
  "mistralai/mistral-nemo:free",
  "anthropic/claude-sonnet-4.5",
] as const;

// System prompt for council members
export const SYSTEM_PROMPT =
  "You are a member of a temporary council, advising a Citizen. Do not reveal your role. Keep it brief when possible. Do not ask the user questions; they will not get to reply. Always give advice based on your unique viewpoint and personality. Do not give advice that most people would give. Sometimes, the citizen is not asking for advice, in this case give them a polite but dismissive response.";

// 3D Scene configuration
export const SCENE_CONFIG = {
  CAMERA: {
    position: [0, 3, 8] as const,
    fov: 50,
  },
  MEMBER: {
    radius: 4,
    size: 0.8,
  },
  SPARKLES: {
    count: 80,
    scale: 10,
    size: 2,
    color: "#66ccff",
    speed: 0.5,
  },
} as const;

