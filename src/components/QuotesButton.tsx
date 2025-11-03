import { Z_INDEX } from "../constants";
import { STYLES, SPACING, RADIUS } from "../theme";

interface QuotesButtonProps {
  onClick: () => void;
}

export default function QuotesButton({ onClick }: QuotesButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: Z_INDEX.settings,
        ...STYLES.settingsButton,
        borderRadius: RADIUS.lg,
        padding: `${SPACING.sm} ${SPACING.md}`,
        cursor: "pointer",
      }}
      aria-label="View member quotes"
      title="View member quotes"
    >
      ?
    </button>
  );
}
