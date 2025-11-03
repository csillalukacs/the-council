import { useState, useEffect } from "react";
import { STYLES, SPACING, RADIUS } from "../theme";
import { UI_TEXT, DIMENSIONS, TIMING } from "../constants";

interface ApiKeyInputProps {
  showKeyInput: boolean;
  apiKey: string | null;
  setApiKey: React.Dispatch<React.SetStateAction<string | null>>;
  setShowKeyInput: (show: boolean) => void;
}

export default function ApiKeyInput({
  showKeyInput,
  apiKey,
  setApiKey,
  setShowKeyInput,
}: ApiKeyInputProps) {
  const [tempKey, setTempKey] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const shouldShowInput = showKeyInput || !apiKey;
  const [shouldRender, setShouldRender] = useState(shouldShowInput);

  useEffect(() => {
    if (showKeyInput && apiKey) {
      setTempKey(apiKey);
    } else if (!showKeyInput) {
      setTempKey("");
    }
  }, [showKeyInput, apiKey]);

  useEffect(() => {
    if (shouldShowInput) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
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
    <div
      style={{
        height: DIMENSIONS.uiContainer.height,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
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
            transform: isAnimating
              ? "scale(1)"
              : `scaleX(${DIMENSIONS.transform.scale.inputHidden})`,
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
  );
}

