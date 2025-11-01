export default function Help({setShowHelp}: {setShowHelp: React.Dispatch<React.SetStateAction<boolean>>}) {
  return (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
          onClick={() => setShowHelp(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(15,25,35,0.95)",
              border: "1px solid rgba(102,204,255,0.4)",
              borderRadius: "10px",
              padding: "20px 24px",
              maxWidth: "420px",
              color: "#ccf6ff",
              textAlign: "center",
              lineHeight: 1.5,
              boxShadow: "0 0 20px rgba(102,204,255,0.3)",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "18px" }}>
              How to get an OpenRouter API Key:
            </h3>
            <p style={{ fontSize: "14px" }}>
              1. Visit{" "}
              <a
                href="https://openrouter.ai"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#80eaff" }}
              >
                openrouter.ai
              </a>
              <br />
              2. Sign in or create an account
              <br />
              3. Go to your{" "}
              <a
                href="https://openrouter.ai/settings/keys"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#80eaff" }}
              >
                API keys page
              </a>{" "}
              and create a new key
              <br />
              <br />
              This lets you make 50 requests per day to free models (so, you could consult the council up to 7 times). Alternatively, you can add $10 worth of credits to your account and increase this limit to 1000 requests per day.
            </p>
            <button
              onClick={() => setShowHelp(false)}
              style={{
                marginTop: "12px",
                padding: "6px 12px",
                background: "rgba(102,204,255,0.15)",
                border: "1px solid rgba(102,204,255,0.4)",
                borderRadius: "6px",
                color: "#ccf6ff",
                cursor: "pointer",
              }}
            >
              Got it
            </button>
          </div>
        </div>
  )
}