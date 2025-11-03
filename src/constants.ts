// Council configuration
export const COUNCIL_SIZE = 7;




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
  LIGHTING: {
    ambientIntensity: 0.3,
    pointLight: {
      position: [0, 5, 0] as const,
      intensity: 2,
      color: "#8ff",
    },
    directionalLight: {
      position: [0, 10, 0] as const,
      intensity: 0.5,
      color: "#8ff",
    },
  },
} as const;

// Animation constants for member meshes
export const MEMBER_ANIMATION = {
  // Rotation constants
  baseRotationSpeed: 0.002,
  torusInitialRotation: Math.PI / 2,
  rotationVariation: {
    amplitude: 0.001,
    frequency: 1.5,
  },
  wobble: {
    x: { amplitude: 0.02, frequency: 2.1 },
    z: { amplitude: 0.015, frequency: 1.7 },
  },
  // Scale constants
  scale: {
    wave1: { amplitude: 0.03, frequency: 3 },
    wave2: { amplitude: 0.015, frequency: 1.8 },
  },
  // Emissive intensity constants
  emissive: {
    base: 0.4,
    inactive: 0.1,
    activeDefault: 0.3,
    min: 0.2,
    max: 0.8,
    wave1: { amplitude: 0.25, frequency: 3.5 },
    wave2: { amplitude: 0.15, frequency: 1.2 },
  },
  // Position bobbing
  bob: {
    amplitude: 0.04,
    frequency: 1.5,
  },
  // Member variation multipliers
  variation: {
    phaseMultiplier: 0.7,
    speedBase: 0.8,
    speedRange: 0.4, // varies from 0.8 to 1.2
  },
} as const;

// UI Text constants
export const UI_TEXT = {
  PLACEHOLDERS: {
    apiKey: "Enter your OpenRouter API key",
    query: "speak, citizen. the council awaits your question.",
  },
  BUTTONS: {
    editKey: "edit key",
    save: "Save",
    enterApiKey: "enter api key to ask",
    councilDeliberating: "the council is deliberating...",
    askCouncil: "ask the council",
    viewHistory: "📜 View History",
    backToHistory: "← Back to History",
    gotIt: "Got it",
    delete: "✕",
  },
  STATUS: {
    thinking: "Thinking...",
    errorFetching: "Error fetching response.",
    silence: "*silence*",
    noConversations: "No saved conversations yet.",
  },
} as const;

// Timing constants (in milliseconds)
export const TIMING = {
  animation: {
    modal: 200,
    historyTransition: 150,
    deleteAnimation: 250,
    inputTransition: 200,
  },
} as const;

// UI Dimensions
export const DIMENSIONS = {
  textBubble: {
    width: "300px",
    maxHeight: "200px",
  },
  retryButton: {
    width: "20px",
    height: "20px",
    iconSize: "12px",
  },
  apiKeyInput: {
    width: "260px",
  },
  queryInput: {
    width: "500px",
    maxHeightRatio: 0.6, // 60% of window height
    minWidth: "300px",
  },
  uiContainer: {
    gap: "8px",
    height: "50px",
  },
  modal: {
    maxWidth: {
      default: "90vw",
      settings: "400px",
      help: "420px",
      history: "70vw",
    },
    maxHeight: "80vh",
    minHeight: "300px",
  },
  conversation: {
    padding: "10px 40px",
    borderRadius: "8px",
    itemPaddingRight: "30px",
    gap: "12px",
  },
  settings: {
    padding: {
      left: "35px",
      right: "35px",
      top: "10px",
      bottom: "30px",
    },
  },
  history: {
    buttonPosition: {
      bottom: "20px",
      right: "20px",
    },
  },
  transform: {
    translateX: "20px",
    scale: {
      initial: 0.1,
      translateY: "-10px",
      inputHidden: 0.5,
    },
  },
} as const;

// Z-index constants
export const Z_INDEX = {
  htmlOverlay: [0, 100] as [number, number],
  settings: 10,
  modal: 100,
} as const;

