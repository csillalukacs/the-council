import { useState } from "react";

export default function History() {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<
    { timestamp: string; query: string; answers: (string | undefined)[] }[]
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
            background: "#222",
            color: "#fff",
            border: "1px solid #555",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: "pointer",
            marginLeft: "10px",
          }}
        >
          📜 View History
        </button>
      </div>

      {showHistory && (
        <div
          style={{
            position: "fixed",
            boxSizing: "border-box",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.85)",
            color: "#fff",
            overflowY: "auto",
            padding: "40px",
            zIndex: 101,
          }}
        >
          <button
            onClick={() => setShowHistory(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "#222",
              color: "#fff",
              border: "1px solid #555",
              borderRadius: "8px",
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            ✖ Close
          </button>

          <h2>Conversation History</h2>
          {history.length === 0 ? (
            <p>No saved conversations yet.</p>
          ) : (
            history
              .slice()
              .reverse()
              .map((c, i) => (
                <div
                  key={i}
                  style={{
                    borderBottom: "1px solid #555",
                    marginBottom: "20px",
                    paddingBottom: "10px",
                  }}
                >
                  <p style={{ marginBottom: "6px" }}>
                    <strong>{new Date(c.timestamp).toLocaleString()}</strong>
                  </p>
                  <p
                    onClick={() => toggleExpand(i)}
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      color: "#ffd700",
                      marginBottom: expanded[i] ? "10px" : 0,
                    }}
                  >
                    {expanded[i] ? "▼ " : "▶ "} {c.query}
                  </p>

                  {expanded[i] && (
                    <ul style={{ marginLeft: "20px" }}>
                      {c.answers.map((a, j) => (
                        <li key={j}>
                          <em>Member {j + 1}:</em> {a || "*no response*"}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
}
