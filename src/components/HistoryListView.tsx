import { useState } from "react";
import { COLORS, SPACING, TYPOGRAPHY, STYLES, RADIUS } from "../theme";
import { UI_TEXT, DIMENSIONS, TIMING } from "../constants";
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
    }, TIMING.animation.deleteAnimation);
  };

  if (history.length === 0) {
    return <p style={{ opacity: 0.7 }}>{UI_TEXT.STATUS.noConversations}</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: DIMENSIONS.conversation.gap,
        padding: DIMENSIONS.conversation.padding,
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
                  ? `opacity ${TIMING.animation.deleteAnimation}ms ease-out, transform ${TIMING.animation.deleteAnimation}ms ease-out, max-height ${TIMING.animation.deleteAnimation}ms ease-out, margin-bottom ${TIMING.animation.deleteAnimation}ms ease-out, padding-bottom ${TIMING.animation.deleteAnimation}ms ease-out`
                  : `background-color 0.2s ease, opacity ${TIMING.animation.deleteAnimation}ms ease-out, transform ${TIMING.animation.deleteAnimation}ms ease-out`,
              }}
              onClick={() => !isDeleting && onConversationClick(i)}
              onMouseEnter={(e) => {
                if (!isDeleting) {
                  e.currentTarget.style.backgroundColor =
                    STYLES.conversationItem.hoverBackground;
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
                  background: STYLES.deleteButton.background,
                  border: STYLES.deleteButton.border,
                  borderRadius: RADIUS.sm,
                  color: STYLES.deleteButton.color,
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
                    e.currentTarget.style.background = STYLES.deleteButton.hoverBackground;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.7";
                  e.currentTarget.style.background = STYLES.deleteButton.background;
                }}
                title="Delete conversation"
                disabled={isDeleting}
              >
                {UI_TEXT.BUTTONS.delete}
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
                  paddingRight: DIMENSIONS.conversation.itemPaddingRight,
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
