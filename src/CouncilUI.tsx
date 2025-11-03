import { Html } from "@react-three/drei";
import { useState, useEffect } from "react";
import HelpButton from "./HelpButton";
import { STYLES, SPACING, TYPOGRAPHY, RADIUS } from "./theme";
import { UI_TEXT, DIMENSIONS, TIMING, Z_INDEX } from "./constants";

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
  const [isAnimating, setIsAnimating] = useState(false);
  const shouldShowInput = showKeyInput || !apiKey;
  const [shouldRender, setShouldRender] = useState(shouldShowInput);

  // When user clicks "edit key", populate the input with the existing API key
  useEffect(() => {
    if (showKeyInput && apiKey) {
      setTempKey(apiKey);
    } else if (!showKeyInput) {
      // Clear tempKey when input is hidden
      setTempKey("");
    }
  }, [showKeyInput, apiKey]);

  // Handle animation when input visibility changes
  useEffect(() => {
    if (shouldShowInput) {
      setShouldRender(true);
      // Trigger animation after render
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, TIMING.animation.inputTransition);
      return () => clearTimeout(timer);
    }
  }, [shouldShowInput]);

  const saveKey = () => {
    if (tempKey.trim()) {
      setApiKey(tempKey.trim());
      setShowKeyInput(false);
      setTempKey("");
    }
  };

  return (
    <Html center position={[0, -1, 0]} zIndexRange={Z_INDEX.htmlOverlay}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: DIMENSIONS.uiContainer.gap,
          alignItems: "center",
        }}
      >
        <div style={{ height: DIMENSIONS.uiContainer.height, overflow: "hidden", display: "flex", alignItems: "center" }}>
        {/* API Key UI */}
        {shouldRender ? (
          <div
            style={{
              display: "flex",
              gap: SPACING.md,
              alignItems: "center",
              ...STYLES.glass,
              padding: `${SPACING.sm} ${SPACING.md}`,
              borderRadius: RADIUS.lg,
              opacity: isAnimating ? 1 : 0,
              transform: isAnimating ? "scale(1)" : `scaleX(${DIMENSIONS.transform.scale.inputHidden})`,
              transition: `opacity ${TIMING.animation.inputTransition}ms ease-out, transform ${TIMING.animation.inputTransition}ms ease-out`,
            }}
          >
            <input
              type="text"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder={UI_TEXT.PLACEHOLDERS.apiKey}
              style={{
                ...STYLES.input,
                width: DIMENSIONS.apiKeyInput.width,
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
              {UI_TEXT.BUTTONS.save}
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
                ...STYLES.glass,
                padding: `${SPACING.md} ${SPACING.md}`,
              }}
            >
              {UI_TEXT.BUTTONS.editKey}
            </button>
          )
        )}
        </div>

        {/* Question input */}
        <div
          style={{
            ...STYLES.inputContainer,
            minWidth: DIMENSIONS.queryInput.minWidth,
          }}
        >
          <textarea
            className="hide-scrollbar"
            placeholder={UI_TEXT.PLACEHOLDERS.query}
            defaultValue={query}
            onChange={(e) => {
              setQuery(e.target.value);
              const target = e.target;
              target.style.height = "auto";
              target.style.height =
                Math.min(target.scrollHeight, window.innerHeight * DIMENSIONS.queryInput.maxHeightRatio) + "px";
            }}
            style={{
              width: DIMENSIONS.queryInput.width,
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
              ? UI_TEXT.BUTTONS.enterApiKey
              : loading
              ? UI_TEXT.BUTTONS.councilDeliberating
              : UI_TEXT.BUTTONS.askCouncil}
          </button>
          {!apiKey && <HelpButton setShowHelp={setShowHelp} />}
        </span>
      </div>
    </Html>
  );
}
