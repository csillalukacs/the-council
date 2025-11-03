import { TEXT_COLORS } from "../constants";
import { STYLES, COLORS, SPACING, TYPOGRAPHY } from "../theme";

interface Conversation {
  timestamp: string;
  query: string;
  answers: (string | undefined)[];
  models?: string[];
}

interface ConversationViewProps {
  conversation: Conversation;
  onBack: () => void;
}

export default function ConversationView({
  conversation,
  onBack,
}: ConversationViewProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px 40px",
      }}
    >
      <button
        onClick={onBack}
        style={{
          ...STYLES.glass,
          padding: `${SPACING.sm} ${SPACING.md}`,
          marginBottom: SPACING.lg,
          alignSelf: "flex-start",
          cursor: "pointer",
        }}
      >
        ← Back to History
      </button>

      <p
        style={{
          marginBottom: SPACING.xs,
          fontSize: TYPOGRAPHY.fontSize.sm,
          opacity: 0.7,
        }}
      >
        {new Date(conversation.timestamp).toLocaleString()}
      </p>
      <h3
        style={{
          fontWeight: TYPOGRAPHY.fontWeight.bold,
          color: COLORS.primaryText,
          marginBottom: SPACING.xl,
          fontSize: TYPOGRAPHY.fontSize.lg,
          lineHeight: 1.4,
        }}
      >
        {conversation.query}
      </h3>
      <ul
        style={{
          marginLeft: 0,
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: SPACING.md,
        }}
      >
        {conversation.answers.map((a, j) => {
          const model = conversation.models?.[j] || "unknown model";
          return (
            <li
              key={j}
              style={{
                color: TEXT_COLORS[j % TEXT_COLORS.length],
                fontSize: TYPOGRAPHY.fontSize.md,
                lineHeight: 1.6,
                padding: `${SPACING.md} ${SPACING.lg}`,
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: `1px solid ${COLORS.borderLightSubtle}`,
              }}
            >
              <div
                style={{
                  marginBottom: SPACING.xs,
                  fontSize: TYPOGRAPHY.fontSize.sm,
                  opacity: 0.8,
                }}
              >
                <em>Member {j + 1}</em>{" "}
                <span
                  style={{
                    fontSize: TYPOGRAPHY.fontSize.xs,
                    opacity: 0.6,
                    fontStyle: "italic",
                  }}
                >
                  ({model})
                </span>
              </div>
              <div>{a || "*no response*"}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
