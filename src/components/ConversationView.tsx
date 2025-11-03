import { useCouncilMembers } from "../hooks/useCouncilMembers";
import { STYLES, COLORS, SPACING, TYPOGRAPHY } from "../theme";
import type { Conversation } from "../types";

interface ConversationViewProps {
  conversation: Conversation;
  onBack: () => void;
}

export default function ConversationView({
  conversation,
  onBack,
}: ConversationViewProps) {
  const members = useCouncilMembers();
  // Create a map for quick member lookup
  const memberMap = new Map(members.map((m) => [m.id, m]));

  // Get member IDs in the order they appear in the members array
  const memberIds = members.map((m) => m.id);

  // Handle backward compatibility: check if answers is an array (old format)
  const isLegacyFormat = Array.isArray((conversation as any).answers);

  // Convert legacy array format to new object format if needed
  const answers = isLegacyFormat
    ? (() => {
        const arr = (conversation as any).answers as (string | undefined)[];
        const obj: Record<string, string | undefined> = {};
        memberIds.forEach((id, i) => {
          obj[id] = arr[i];
        });
        return obj;
      })()
    : conversation.answers;

  // Handle legacy models array format
  const memberModels = (conversation as any).models
    ? (() => {
        const arr = (conversation as any).models as string[];
        const obj: Record<string, string> = {};
        memberIds.forEach((id, i) => {
          obj[id] = arr[i] || "unknown model";
        });
        return obj;
      })()
    : conversation.memberModels;

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

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
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
        <p
          style={{
            marginBottom: SPACING.xs,
            fontSize: TYPOGRAPHY.fontSize.sm,
            opacity: 0.7,
          }}
        >
          {new Date(conversation.timestamp).toLocaleString()}
        </p>
      </div>
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
        {memberIds.map((memberId) => {
          const member = memberMap.get(memberId);
          const answer = answers[memberId];
          const model = memberModels?.[memberId] || "unknown model";

          if (!member) return null;

          return (
            <li
              key={memberId}
              style={{
                color: member.textColor,
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
                <em>{member.displayName}</em>{" "}
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
              <div>{answer || "*no response*"}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
