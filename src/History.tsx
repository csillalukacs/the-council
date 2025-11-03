import { useState, useRef, useEffect } from "react";
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
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const viewHistory = () => {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || "[]"
    );
    setHistory(saved);
    setShowHistory(true);
  };

  const toggleExpand = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
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
        onClose={() => setShowHistory(false)}
        title="Conversation History"
        maxWidth="70vw"
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
                    onClick={() => toggleExpand(i)}
                    style={{
                      cursor: "pointer",
                      fontWeight: TYPOGRAPHY.fontWeight.medium,
                      color: COLORS.primaryText,
                      marginBottom: SPACING.sm,
                      fontSize: TYPOGRAPHY.fontSize.base,
                      lineHeight: 1.4,
                    }}
                  >
                    {expanded[i] ? "▼ " : "▶ "} {c.query}
                  </p>

                  <AnimatedCollapse show={!!expanded[i]}>
                    <ul
                      style={{
                        marginLeft: SPACING.xl,
                        marginTop: SPACING.sm,
                        padding: 0,
                        listStyle: "none",
                      }}
                    >
                      {c.answers.map((a, j) => {
                        const model = c.models?.[j] || "unknown model";
                        return (
                          <li
                            key={j}
                            style={{
                              color: TEXT_COLORS[j % TEXT_COLORS.length],
                              marginBottom: SPACING.sm,
                              fontSize: TYPOGRAPHY.fontSize.md,
                              lineHeight: 1.4,
                              padding: "12px 60px 10px 20px"
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
                            : <div>{a || "*no response*"}</div>
                          </li>
                        );
                      })}
                    </ul>
                  </AnimatedCollapse>
                </div>
              ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

function AnimatedCollapse({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(show ? ref.current.scrollHeight + 20 : 0);
    }
  }, [show, children]);

  return (
    <div
      style={{
        overflow: "hidden",
        transition: "height 0.3s ease",
        height,
      }}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
}
