import React from "react";
import { STYLES, TYPOGRAPHY, COLORS, SPACING } from "../theme";

export default function HelpButton({
  setShowHelp,
}: {
  setShowHelp: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <button
      onClick={() => {
        setShowHelp(true);
      }}
      title="How to get API key"
      style={{
        ...STYLES.glass,
        borderRadius: "10%",
        color: COLORS.primaryText,
        cursor: "pointer",
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        padding: `${SPACING.sm} ${SPACING.lg}`,
        zIndex: 150,
      }}
    >
      ?
    </button>
  );
}
