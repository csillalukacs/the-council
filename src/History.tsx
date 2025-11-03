import { useState } from "react";
import Modal from "./components/Modal";
import { TEXT_COLORS, STORAGE_KEYS } from "./constants";
import { STYLES, COLORS, SPACING, TYPOGRAPHY } from "./theme";

export default function History() {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<
    {
      timestamp: string;
      query: string;
      answers: (string | undefined)[];
      models?: string[];
    }[]
  >([]);
  const [openedConversation, setOpenedConversation] = useState<number | null>(
    null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const viewHistory = () => {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || "[]"
    );
    setHistory(saved);
    setShowHistory(true);
    setOpenedConversation(null);
  };

  const openConversation = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setOpenedConversation(index);
      setIsTransitioning(false);
    }, 150);
  };

  const closeConversation = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setOpenedConversation(null);
      setIsTransitioning(false);
    }, 150);
  };

  const handleCloseModal = () => {
    setShowHistory(false);
    setOpenedConversation(null);
    setIsTransitioning(false);
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          zIndex: 10,
        }}
      >
        <button
          onClick={viewHistory}
          style={{
            ...STYLES.glass,
            padding: `${SPACING.md} ${SPACING.lg}`,
            marginLeft: SPACING.md,
          }}
        >
          📜 View History
        </button>
      </div>

      <Modal
        isOpen={showHistory}
        onClose={handleCloseModal}
        title={openedConversation !== null ? undefined : "Conversation History"}
        maxWidth="70vw"
      >
        <div
          style={{
            position: "relative",
            minHeight: "300px",
            overflow: "hidden",
          }}
        >
          {/* History List View */}
          <AnimatedView
            show={openedConversation === null}
            isTransitioning={isTransitioning}
          >
            {history.length === 0 ? (
              <p style={{ opacity: 0.7 }}>No saved conversations yet.</p>
            ) : (
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
                      onClick={() => openConversation(i)}
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
            )}
          </AnimatedView>

          {/* Conversation View */}
          <AnimatedView
            show={openedConversation !== null}
            isTransitioning={isTransitioning}
          >
            {openedConversation !== null && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "10px 40px",
                }}
              >
                <button
                  onClick={closeConversation}
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

                {(() => {
                  const reversedIndex = history.length - 1 - openedConversation;
                  const c = history[reversedIndex];
                  return (
                    <>
                      <p
                        style={{
                          marginBottom: SPACING.xs,
                          fontSize: TYPOGRAPHY.fontSize.sm,
                          opacity: 0.7,
                        }}
                      >
                        {new Date(c.timestamp).toLocaleString()}
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
                        {c.query}
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
                        {c.answers.map((a, j) => {
                          const model = c.models?.[j] || "unknown model";
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
                    </>
                  );
                })()}
              </div>
            )}
          </AnimatedView>
        </div>
      </Modal>
    </div>
  );
}

function AnimatedView({
  show,
  children,
  isTransitioning,
}: {
  show: boolean;
  children: React.ReactNode;
  isTransitioning: boolean;
}) {
  return (
    <div
      style={{
        position: show ? "relative" : "absolute",
        top: 0,
        left: 0,
        right: 0,
        opacity: show && !isTransitioning ? 1 : 0,
        transform:
          show && !isTransitioning
            ? "translateX(0)"
            : show
            ? "translateX(20px)"
            : "translateX(-20px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: show ? "auto" : "none",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}
