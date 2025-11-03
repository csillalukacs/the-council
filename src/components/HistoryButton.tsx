import { DIMENSIONS } from "../constants";
import { STYLES, SPACING } from "../theme";
import { UI_TEXT } from "../constants";

interface HistoryButtonProps {
  onClick: () => void;
}

export default function HistoryButton({ onClick }: HistoryButtonProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: DIMENSIONS.history.buttonPosition.bottom,
        right: DIMENSIONS.history.buttonPosition.right,
        zIndex: 10,
      }}
    >
      <button
        onClick={onClick}
        style={{
          ...STYLES.glass,
          padding: `${SPACING.md} ${SPACING.lg}`,
          marginLeft: SPACING.md,
        }}
      >
        {UI_TEXT.BUTTONS.viewHistory}
      </button>
    </div>
  );
}

