import { useState, useRef, useEffect } from "react";
import { colors } from "./CouncilChamber";

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
      localStorage.getItem("council_conversations") || "[]"
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

      {showHistory && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 101,
          }}
          onClick={() => setShowHistory(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90vw",
              height: "90vh",
              background: "rgba(15,25,35,0.95)",
              border: "1px solid rgba(102,204,255,0.4)",
              borderRadius: "10px",
              color: "#ccf6ff",
              overflowY: "auto",
              padding: "24px",
              boxShadow: "0 0 20px rgba(102,204,255,0.3)",
              backdropFilter: "blur(6px)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowHistory(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "rgba(102,204,255,0.15)",
                color: "#ccf6ff",
                border: "1px solid rgba(102,204,255,0.4)",
                borderRadius: "6px",
                padding: "6px 10px",
                cursor: "pointer",
                backdropFilter: "blur(6px)",
              }}
            >
              ✖ Close
            </button>

            <h2 style={{ marginBottom: "16px", fontSize: "20px" }}>
              Conversation History
            </h2>
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
                                  color: colors[j % colors.length],
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
          </div>
        </div>
      )}
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
