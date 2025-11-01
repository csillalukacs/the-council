import { Html } from "@react-three/drei";
import { useState } from "react";
import HelpButton from "./HelpButton";

export default function CouncilUI({
  showKeyInput,
  setShowKeyInput,
  apiKey,
  query,
  setQuery,
  loading,
  askCouncil,
  setApiKey,
  setShowHelp,
}: {
  showKeyInput: boolean;
  setShowKeyInput: React.Dispatch<React.SetStateAction<boolean>>;
  apiKey: string | null;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  askCouncil: () => Promise<void>;
  setApiKey: React.Dispatch<React.SetStateAction<string | null>>;
  setShowHelp: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [tempKey, setTempKey] = useState("");

  const saveKey = () => {
    if (tempKey.trim()) {
      localStorage.setItem("openrouter_api_key", tempKey.trim());
      setApiKey(tempKey.trim());
      setShowKeyInput(false);
    }
  };

  return (
    <Html center position={[0, -1, 0]} zIndexRange={[0, 100]}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          alignItems: "center",
        }}
      >
        {/* API Key UI */}
        {showKeyInput ? (
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              background: "rgba(102,204,255,0.1)",
              padding: "6px 10px",
              borderRadius: "8px",
              border: "1px solid rgba(102,204,255,0.4)",
              backdropFilter: "blur(6px)",
            }}
          >
            <input
              type="text"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="Enter your OpenRouter API key"
              style={{
                background: "transparent",
                border: "none",
                color: "#ccf6ff",
                outline: "none",
                width: "260px",
              }}
            />
            <button
              onClick={saveKey}
              style={{
                padding: "6px 10px",
                background: "rgba(102,204,255,0.15)",
                border: "1px solid rgba(102,204,255,0.4)",
                borderRadius: "6px",
                color: "#ccf6ff",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        ) : (
          apiKey && (
            <button
              onClick={() => setShowKeyInput(true)}
              title="Edit API key"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(102,204,255,0.1)",
                border: "1px solid rgba(102,204,255,0.4)",
                borderRadius: "6px",
                color: "#ccf6ff",
                padding: "4px 8px",
                cursor: "pointer",
                backdropFilter: "blur(6px)",
              }}
            >
              edit key
            </button>
          )
        )}

        {/* Question input */}
        <div
          style={{
            padding: "8px 16px",
            background: "rgba(102, 204, 255, 0.15)",
            border: "1px solid rgba(102, 204, 255, 0.4)",
            borderRadius: "6px",
            minWidth: "300px",
            color: "#ccf6ff",
            fontSize: "14px",
            letterSpacing: "0.5px",
            backdropFilter: "blur(6px)",
            boxShadow: "0 0 12px rgba(102, 204, 255, 0.3)",
          }}
        >
          <textarea
            className="hide-scrollbar"
            placeholder="the council is listening. what ails you, citizen?"
            defaultValue={query}
            onChange={(e) => {
              setQuery(e.target.value);
              const target = e.target;
              target.style.height = "auto";
              target.style.height =
                Math.min(target.scrollHeight, window.innerHeight * 0.6) + "px";
            }}
            style={{
              width: "500px",
              background: "transparent",
              border: "none",
              color: "white",
              outline: "none",
              textAlign: "center",
              fontSize: "16px",
              overflowY: "scroll",
              resize: "none",
            }}
          />
        </div>

        {/* Ask button */}
        <span>
          <button
            disabled={loading || !apiKey}
            onClick={askCouncil}
            style={{
              marginTop: "12px",
              margin: "10px",
              padding: "8px 16px",
              background:
                loading || !apiKey
                  ? "rgba(102, 204, 255, 0.05)"
                  : "rgba(102, 204, 255, 0.15)",
              border: "1px solid rgba(102, 204, 255, 0.4)",
              borderRadius: "6px",
              color: "#ccf6ff",
              fontSize: "14px",
              letterSpacing: "0.5px",
              cursor: loading || !apiKey ? "not-allowed" : "pointer",
              backdropFilter: "blur(6px)",
              boxShadow: "0 0 12px rgba(102, 204, 255, 0.3)",
              transition: "all 0.2s ease",
            }}
          >
            {!apiKey
              ? "enter api key to ask"
              : loading
              ? "the council is deliberating..."
              : "ask the council"}
          </button>
          {!apiKey && <HelpButton setShowHelp={setShowHelp} />}
        </span>
      </div>
    </Html>
  );
}
