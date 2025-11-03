import { Html } from "@react-three/drei";
import HelpButton from "./HelpButton";
import ApiKeyInput from "./components/ApiKeyInput";
import QueryInput from "./components/QueryInput";
import { STYLES, SPACING } from "./theme";
import { UI_TEXT, DIMENSIONS, Z_INDEX } from "./constants";

interface CouncilUIProps {
  showKeyInput: boolean;
  setShowKeyInput: React.Dispatch<React.SetStateAction<boolean>>;
  apiKey: string | null;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  askCouncil: () => Promise<void>;
  setApiKey: React.Dispatch<React.SetStateAction<string | null>>;
  setShowHelp: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CouncilUI({
  showKeyInput,
  setShowKeyInput,
  apiKey,
  query,
  setQuery,
  loading,
  askCouncil,
  setApiKey,
  setShowHelp,
}: CouncilUIProps) {
  const getButtonText = () => {
    if (!apiKey) return UI_TEXT.BUTTONS.enterApiKey;
    if (loading) return UI_TEXT.BUTTONS.councilDeliberating;
    return UI_TEXT.BUTTONS.askCouncil;
  };

  return (
    <Html center position={[0, -1, 0]} zIndexRange={Z_INDEX.htmlOverlay}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: DIMENSIONS.uiContainer.gap,
          alignItems: "center",
        }}
      >
        <ApiKeyInput
          showKeyInput={showKeyInput}
          apiKey={apiKey}
          setApiKey={setApiKey}
          setShowKeyInput={setShowKeyInput}
        />
        <QueryInput query={query} setQuery={setQuery} />
        <span>
          <button
            disabled={loading || !apiKey}
            onClick={askCouncil}
            style={{
              marginTop: SPACING.lg,
              margin: SPACING.md,
              ...(loading || !apiKey
                ? STYLES.buttonDisabled
                : STYLES.buttonPrimary),
            }}
          >
            {getButtonText()}
          </button>
          {!apiKey && <HelpButton setShowHelp={setShowHelp} />}
        </span>
      </div>
    </Html>
  );
}
