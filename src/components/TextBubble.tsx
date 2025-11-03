import { Html } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { UI_TEXT, DIMENSIONS, Z_INDEX } from "../constants";
import { STYLES, SPACING, TYPOGRAPHY } from "../theme";

interface TextBubbleProps {
  text: string | undefined;
  active: boolean;
  textColor: string;
  font: string;
  onRetry?: () => void;
}

export default function TextBubble({
  text,
  active,
  textColor,
  font,
  onRetry,
}: TextBubbleProps) {
  const textBubbleRef = useRef<HTMLDivElement>(null);

  // Auto-scroll text bubble to bottom when answer changes
  useEffect(() => {
    if (textBubbleRef.current && text) {
      textBubbleRef.current.scrollTop = textBubbleRef.current.scrollHeight;
    }
  }, [text]);

  const displayText = text ?? (active ? UI_TEXT.STATUS.thinking : "");
  const showBubble = text || active;

  return (
    <Html position={[0, 1, 1]} center zIndexRange={Z_INDEX.htmlOverlay}>
      <div
        ref={textBubbleRef}
        className="hide-scrollbar"
        style={{
          ...STYLES.textBubble,
          color: textColor,
          fontSize: TYPOGRAPHY.fontSize.md,
          fontFamily: font,
          width: DIMENSIONS.textBubble.width,
          textAlign: "center",
          maxHeight: DIMENSIONS.textBubble.maxHeight,
          overflowY: "scroll",
          display: showBubble ? "block" : "none",
          position: "relative",
          //make text unselectable
          userSelect: "none",
        }}
      >
        {displayText}
        {text === UI_TEXT.STATUS.silence && onRetry && (
          <button
            onClick={onRetry}
            style={{
              position: "absolute",
              bottom: SPACING.xs,
              right: SPACING.xs,
              padding: SPACING.xs,
              ...STYLES.glassMedium,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: DIMENSIONS.retryButton.width,
              height: DIMENSIONS.retryButton.height,
            }}
            title="Retry"
          >
            <svg
              width={DIMENSIONS.retryButton.iconSize}
              height={DIMENSIONS.retryButton.iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
          </button>
        )}
      </div>
    </Html>
  );
}

