import { Canvas } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import Settings from "./Settings";
import History from "./History";
import Help from "./Help";
import Quotes from "./Quotes";
import CouncilScene from "./components/CouncilScene";
import ButtonGroup from "./components/ButtonGroup";
import SettingsButton from "./components/SettingsButton";
import HistoryButton from "./components/HistoryButton";
import QuotesButton from "./components/QuotesButton";
import { useCouncilMembers } from "./hooks/useCouncilMembers";
import { useCouncilApi } from "./hooks/useCouncilApi";
import { useApiKey, useModels } from "./hooks/useLocalStorage";
import { SCENE_CONFIG } from "./constants";
import { COLORS } from "./theme";

export default function CouncilChamber() {
  const members = useCouncilMembers();
  const [apiKey, setApiKey] = useApiKey();
  const [models, setModels] = useModels();
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [query, setQuery] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showQuotes, setShowQuotes] = useState(false);
  const prevApiKeyRef = useRef<string | null>(null);

  // Update showKeyInput based on whether API key exists
  // Only hide input when API key loads initially (transitions from null to non-null)
  // Don't interfere when user explicitly clicks "edit key"
  useEffect(() => {
    if (apiKey && prevApiKeyRef.current === null) {
      // API key just loaded from localStorage, hide the input
      setShowKeyInput(false);
    }
    prevApiKeyRef.current = apiKey;
  }, [apiKey]);

  const { loading, answers, activeMembers, askCouncil, retryMember } =
    useCouncilApi({
      apiKey,
      models,
      members,
    });

  const handleAskCouncil = async () => {
    await askCouncil(query);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: COLORS.bgGradient,
        position: "relative",
      }}
    >
      <Settings 
        models={models} 
        setModels={setModels} 
        members={members}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />
      <Canvas
        camera={{
          position: SCENE_CONFIG.CAMERA.position,
          fov: SCENE_CONFIG.CAMERA.fov,
        }}
      >
        <CouncilScene
          members={members}
          activeMembers={activeMembers}
          answers={answers}
          onRetryMember={retryMember}
          showKeyInput={showKeyInput}
          setShowKeyInput={setShowKeyInput}
          apiKey={apiKey}
          query={query}
          setQuery={setQuery}
          loading={loading}
          askCouncil={handleAskCouncil}
          setApiKey={setApiKey}
          setShowHelp={setShowHelp}
        />
      </Canvas>
      {showHelp && <Help setShowHelp={setShowHelp} />}
      <History showHistory={showHistory} setShowHistory={setShowHistory} />
      <Quotes showQuotes={showQuotes} setShowQuotes={setShowQuotes} />
      
      <ButtonGroup>
        <SettingsButton onClick={() => setShowSettings((s) => !s)} />
        <HistoryButton onClick={() => setShowHistory(true)} />
        <QuotesButton onClick={() => setShowQuotes(true)} />
      </ButtonGroup>
    </div>
  );
}
