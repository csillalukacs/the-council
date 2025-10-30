import { useState } from "react";

export default function Settings({
  model,
  setModel,
}: {
  model: string;
  setModel: React.Dispatch<React.SetStateAction<string>>;
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

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setModel(value);
    localStorage.setItem("openrouter_model", value);
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
          }}
        >
          <h3 style={{ fontSize: "14px", marginBottom: "6px" }}>Settings</h3>
          <label style={{ display: "block", fontSize: "13px" }}>
            Model:
            <select
              value={model}
              onChange={handleModelChange}
              style={{
                width: "100%",
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
          </label>
        </div>
      )}
    </>
  );
}
