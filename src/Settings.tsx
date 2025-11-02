import { useState } from "react";
import Modal from "./components/Modal";
import { AVAILABLE_MODELS, STORAGE_KEYS } from "./constants";

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

  const handleModelChange = (index: number, value: string) => {
    const updated = [...models];
    updated[index] = value;
    setModels(updated);
    localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(updated));
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
        aria-label="Open settings"
      >
        ⚙️
      </button>

      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Models"
        maxWidth="300px"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {members.map((m, i) => (
            <div
              key={i}
              style={{
                fontSize: "12px",
              }}
            >
              <div style={{ marginBottom: "4px" }}>
                <span
                  style={{
                    color: m.color,
                    fontWeight: "bold",
                    marginRight: "4px",
                  }}
                >
                  ●
                </span>
                <span>Member {i + 1}</span>
              </div>
              <select
                value={models[i]}
                onChange={(e) => handleModelChange(i, e.target.value)}
                style={{
                  width: "100%",
                  background: "#111",
                  color: "white",
                  border: "1px solid #444",
                  borderRadius: "5px",
                  padding: "4px",
                }}
              >
                {AVAILABLE_MODELS.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
