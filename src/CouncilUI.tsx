import { Html } from "@react-three/drei";
import { useState, useEffect } from "react";
import HelpButton from "./HelpButton";
import { STYLES, SPACING, TYPOGRAPHY, RADIUS } from "./theme";

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

  // When user clicks "edit key", populate the input with the existing API key
  useEffect(() => {
    if (showKeyInput && apiKey) {
      setTempKey(apiKey);
    } else if (!showKeyInput) {
      // Clear tempKey when input is hidden
      setTempKey("");
    }
  }, [showKeyInput, apiKey]);

  const saveKey = () => {
    if (tempKey.trim()) {
      setApiKey(tempKey.trim());
      setShowKeyInput(false);
      setTempKey("");
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
        {showKeyInput || !apiKey ? (
          <div
            style={{
              display: "flex",
              gap: SPACING.md,
              alignItems: "center",
              ...STYLES.glass,
              padding: `${SPACING.sm} ${SPACING.md}`,
              borderRadius: RADIUS.lg,
            }}
          >
            <input
              type="text"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="Enter your OpenRouter API key"
              style={{
                ...STYLES.input,
                width: "260px",
              }}
            />
            <button
              onClick={saveKey}
              style={{
                padding: `${SPACING.sm} ${SPACING.md}`,
                ...STYLES.glassMedium,
                borderRadius: RADIUS.md,
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
                gap: SPACING.sm,
                ...STYLES.glass,
                padding: `${SPACING.xs} ${SPACING.md}`,
              }}
            >
              edit key
            </button>
          )
        )}

        {/* Question input */}
        <div
          style={{
            ...STYLES.inputContainer,
            minWidth: "300px",
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
              ...STYLES.input,
              textAlign: "center",
              fontSize: TYPOGRAPHY.fontSize.lg,
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
              marginTop: SPACING.lg,
              margin: SPACING.md,
              ...(loading || !apiKey
                ? STYLES.buttonDisabled
                : STYLES.buttonPrimary),
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
