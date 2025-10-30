import { useState, useEffect } from "react";

export default function Settings({
  model,
  setModel,
  apiKey,
}: {
  model: string;
  setModel: React.Dispatch<React.SetStateAction<string>>;
  apiKey: string | null;
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      if (!apiKey) return;

      setLoading(true);
      try {
        const res = await fetch("https://openrouter.ai/api/v1/models", {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch models");
        const data = await res.json();

        const freeModels = data.data
          .filter((m: any) => {
            const pricing = m.pricing || {};
            return (
              m.id.includes(":free") ||
              pricing.prompt === 0 ||
              pricing.completion === 0
            );
          })
          .map((m: any) => m.id);

        setModels(freeModels);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [apiKey]);

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
              {loading ? (
                <option>Loading...</option>
              ) : models.length > 0 ? (
                models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))
              ) : (
                <option>Enter API key to see available models</option>
              )}
            </select>
          </label>
        </div>
      )}
    </>
  );
}
