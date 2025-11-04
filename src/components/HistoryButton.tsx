import { STYLES, SPACING, RADIUS } from "../theme";

interface HistoryButtonProps {
  onClick: () => void;
}

export default function HistoryButton({ onClick }: HistoryButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        ...STYLES.glass,
        borderRadius: RADIUS.lg,
        padding: `${SPACING.md} ${SPACING.md}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        width: "36px",
        height: "36px",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = STYLES.glassMedium.background;
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = STYLES.glass.background;
        e.currentTarget.style.transform = "scale(1)";
      }}
      aria-label="View history"
      title="View history"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    </button>
  );
}
