import { useState } from "react";
import { COLORS, SPACING, TYPOGRAPHY } from "../theme";
import type { Conversation } from "../types";

interface HistoryListViewProps {
  history: Conversation[];
  onConversationClick: (index: number) => void;
  onDeleteConversation: (index: number) => void;
}

export default function HistoryListView({
  history,
  onConversationClick,
  onDeleteConversation,
}: HistoryListViewProps) {
  const [deletingIndices, setDeletingIndices] = useState<Set<number>>(
    new Set()
  );

  const handleDelete = (index: number) => {
    // Mark as deleting to trigger animation
    setDeletingIndices((prev) => new Set(prev).add(index));

    // After animation completes, actually delete
    setTimeout(() => {
      onDeleteConversation(index);
      setDeletingIndices((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }, 250); // Match animation duration
  };

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
        .map((c, i) => {
          const isDeleting = deletingIndices.has(i);
          return (
            <div
              key={i}
              style={{
                borderBottom: `1px solid ${COLORS.borderLightSubtle}`,
                cursor: isDeleting ? "default" : "pointer",
                position: "relative",
                opacity: isDeleting ? 0 : 1,
                maxHeight: isDeleting ? 0 : "none",
                overflow: "hidden",
                marginBottom: isDeleting ? 0 : undefined,
                paddingBottom: isDeleting ? 0 : SPACING.lg,
                transition: isDeleting
                  ? "opacity 0.25s ease-out, transform 0.25s ease-out, max-height 0.25s ease-out, margin-bottom 0.25s ease-out, padding-bottom 0.25s ease-out"
                  : "background-color 0.2s ease, opacity 0.25s ease-out, transform 0.25s ease-out",
              }}
              onClick={() => !isDeleting && onConversationClick(i)}
              onMouseEnter={(e) => {
                if (!isDeleting) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.05)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(i);
                }}
                style={{
                  position: "absolute",
                  top: SPACING.xs,
                  right: SPACING.xs,
                  background: "rgba(255, 77, 77, 0.2)",
                  border: `1px solid rgba(255, 77, 77, 0.4)`,
                  borderRadius: "4px",
                  color: "#ff6b6b",
                  cursor: "pointer",
                  padding: `${SPACING.xs} ${SPACING.sm}`,
                  fontSize: TYPOGRAPHY.fontSize.xs,
                  transition: "all 0.2s ease",
                  opacity: isDeleting ? 0 : 0.7,
                  zIndex: 1,
                  pointerEvents: isDeleting ? "none" : "auto",
                }}
                onMouseEnter={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.background = "rgba(255, 77, 77, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.7";
                  e.currentTarget.style.background = "rgba(255, 77, 77, 0.2)";
                }}
                title="Delete conversation"
                disabled={isDeleting}
              >
                ✕
              </button>
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
                  paddingRight: "30px",
                }}
              >
                {c.query}
              </p>
            </div>
          );
        })}
    </div>
  );
}
