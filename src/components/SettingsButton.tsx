import { Z_INDEX } from "../constants";
import { STYLES, SPACING, RADIUS } from "../theme";

interface SettingsButtonProps {
  onClick: () => void;
}

export default function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: Z_INDEX.settings,
        ...STYLES.settingsButton,
        borderRadius: RADIUS.lg,
        padding: `${SPACING.sm} ${SPACING.md}`,
        cursor: "pointer",
      }}
      aria-label="Open settings"
    >
      ⚙️
    </button>
  );
}

