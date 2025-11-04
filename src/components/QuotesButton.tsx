import { STYLES, SPACING, RADIUS } from "../theme";

interface QuotesButtonProps {
  onClick: () => void;
}

export default function QuotesButton({ onClick }: QuotesButtonProps) {
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
      aria-label="What is this?"
      title="What is this?"
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
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    </button>
  );
}
