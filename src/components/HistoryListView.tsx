import { COLORS, SPACING, TYPOGRAPHY } from "../theme";

interface Conversation {
  timestamp: string;
  query: string;
  answers: (string | undefined)[];
  models?: string[];
}

interface HistoryListViewProps {
  history: Conversation[];
  onConversationClick: (index: number) => void;
}

export default function HistoryListView({
  history,
  onConversationClick,
}: HistoryListViewProps) {
  if (history.length === 0) {
    return <p style={{ opacity: 0.7 }}>No saved conversations yet.</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "10px 40px",
      }}
    >
      {history
        .slice()
        .reverse()
        .map((c, i) => (
          <div
            key={i}
            style={{
              borderBottom: `1px solid ${COLORS.borderLightSubtle}`,
              paddingBottom: SPACING.lg,
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onClick={() => onConversationClick(i)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <p
              style={{
                marginBottom: SPACING.xs,
                fontSize: TYPOGRAPHY.fontSize.sm,
                opacity: 0.7,
              }}
            >
              {new Date(c.timestamp).toLocaleString()}
            </p>
            <p
              style={{
                fontWeight: TYPOGRAPHY.fontWeight.medium,
                color: COLORS.primaryText,
                marginBottom: SPACING.sm,
                fontSize: TYPOGRAPHY.fontSize.base,
                lineHeight: 1.4,
              }}
            >
              {c.query}
            </p>
          </div>
        ))}
    </div>
  );
}
