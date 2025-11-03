import Modal from "./components/Modal";
import { STYLES, COLORS, SPACING, TYPOGRAPHY } from "./theme";
import { DIMENSIONS, UI_TEXT } from "./constants";

export default function Help({
  setShowHelp,
}: {
  setShowHelp: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Modal isOpen={true} onClose={() => setShowHelp(false)} maxWidth={DIMENSIONS.modal.maxWidth.help}>
      <div style={{ textAlign: "center", lineHeight: 1.5 }}>
        <h3
          style={{ marginBottom: SPACING.md, fontSize: TYPOGRAPHY.fontSize.xl }}
        >
          How to get an OpenRouter API Key:
        </h3>
        <p style={{ fontSize: TYPOGRAPHY.fontSize.base }}>
          1. Visit{" "}
          <a
            href="https://openrouter.ai"
            target="_blank"
            rel="noreferrer"
            style={{ color: COLORS.primaryDark }}
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
            style={{ color: COLORS.primaryDark }}
          >
            API keys page
          </a>{" "}
          and create a new key
          <br />
          <br />
          This lets you make 50 requests per day to free models (so, you could
          consult the council up to 7 times). Alternatively, you can add $10
          worth of credits to your account and increase this limit to 1000
          requests per day.
        </p>
        <button
          onClick={() => setShowHelp(false)}
          style={{
            marginTop: SPACING.lg,
            padding: `${SPACING.sm} ${SPACING.lg}`,
            ...STYLES.glassMedium,
          }}
        >
          {UI_TEXT.BUTTONS.gotIt}
        </button>
      </div>
    </Modal>
  );
}
