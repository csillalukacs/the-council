import { useState } from "react";

export const MODEL_OPTIONS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-oss-20b:free",
  "google/gemma-3n-e2b-it:free",
  "qwen/qwen-2.5-72b-instruct:free",
];

export default function Settings({
  model,
  setModel,
}: {
  model: string;
  setModel: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [showSettings, setShowSettings] = useState(false);

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
            width: "220px",
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
              {MODEL_OPTIONS.map((m) => (
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
