import { useState } from "react";

export default function Settings({
  models,
  setModels,
  members,
}: {
  models: string[];
  setModels: React.Dispatch<React.SetStateAction<string[]>>;
  members: { color: string }[];
}) {
  const [showSettings, setShowSettings] = useState(false);

  const MODELS = [
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
  ];

  const handleModelChange = (index: number, value: string) => {
    setModels((prev) => {
      const updated = [...prev];
      updated[index] = value;
      localStorage.setItem("openrouter_models", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <>
      <button
        onClick={() => setShowSettings((s) => !s)}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
          background: "#222",
          color: "#fff",
          border: "1px solid #444",
          borderRadius: "8px",
          padding: "6px 10px",
          cursor: "pointer",
        }}
      >
        ⚙️
      </button>

      {showSettings && (
        <div
          style={{
            position: "absolute",
            top: 50,
            left: 10,
            background: "rgba(20,20,20,0.9)",
            border: "1px solid #555",
            borderRadius: "10px",
            padding: "12px",
            color: "white",
            zIndex: 10,
            width: "250px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <h3 style={{ fontSize: "14px", marginBottom: "8px" }}>
            Models:
          </h3>
          {members.map((m, i) => (
            <div
              key={i}
              style={{
                fontSize: "12px",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  color: m.color,
                  fontWeight: "bold",
                  marginRight: "4px",
                  width: "10%",
                }}
              >
                ●
              </span>
              <select
                value={models[i]}
                onChange={(e) => handleModelChange(i, e.target.value)}
                style={{
                  width: "90%",
                  background: "#111",
                  color: "white",
                  border: "1px solid #444",
                  borderRadius: "5px",
                  marginTop: "4px",
                  padding: "4px",
                }}
              >
                {MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
