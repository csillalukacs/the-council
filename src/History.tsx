import { useState, useRef, useEffect } from "react";
import Modal from "./components/Modal";
import { TEXT_COLORS, STORAGE_KEYS } from "./constants";

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
            background: "rgba(102,204,255,0.1)",
            color: "#ccf6ff",
            border: "1px solid rgba(102,204,255,0.4)",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: "pointer",
            marginLeft: "10px",
            backdropFilter: "blur(6px)",
          }}
        >
          📜 View History
        </button>
      </div>

      <Modal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        title="Conversation History"
        maxWidth="90vw"
      >
        {history.length === 0 ? (
          <p style={{ opacity: 0.7 }}>No saved conversations yet.</p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {history
              .slice()
              .reverse()
              .map((c, i) => (
                <div
                  key={i}
                  style={{
                    borderBottom: "1px solid rgba(102,204,255,0.2)",
                    paddingBottom: "12px",
                  }}
                >
                  <p
                    style={{
                      marginBottom: "4px",
                      fontSize: "12px",
                      opacity: 0.7,
                    }}
                  >
                    {new Date(c.timestamp).toLocaleString()}
                  </p>
                  <p
                    onClick={() => toggleExpand(i)}
                    style={{
                      cursor: "pointer",
                      fontWeight: "500",
                      color: "#ccf6ff",
                      marginBottom: "6px",
                      fontSize: "14px",
                      lineHeight: "1.4",
                    }}
                  >
                    {expanded[i] ? "▼ " : "▶ "} {c.query}
                  </p>

                  <AnimatedCollapse show={!!expanded[i]}>
                    <ul
                      style={{
                        marginLeft: "16px",
                        marginTop: "6px",
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
                              marginBottom: "6px",
                              fontSize: "13px",
                              lineHeight: "1.4",
                            }}
                          >
                            <em>Member {j + 1}</em>{" "}
                            <span
                              style={{
                                fontSize: "11px",
                                opacity: 0.6,
                                fontStyle: "italic",
                              }}
                            >
                              ({model})
                            </span>
                            : {a || "*no response*"}
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
