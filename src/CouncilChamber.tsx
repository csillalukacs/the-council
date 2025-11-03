import { Canvas } from "@react-three/fiber";
import { Float, Sparkles, OrbitControls } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import { CouncilMember } from "./CouncilMember";
import CouncilUI from "./CouncilUI";
import Settings from "./Settings";
import History from "./History";
import Help from "./Help";
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
      <Settings models={models} setModels={setModels} members={members} />
      <Canvas
        camera={{
          position: SCENE_CONFIG.CAMERA.position,
          fov: SCENE_CONFIG.CAMERA.fov,
        }}
      >
        <ambientLight intensity={SCENE_CONFIG.LIGHTING.ambientIntensity} />
        <pointLight
          position={SCENE_CONFIG.LIGHTING.pointLight.position}
          intensity={SCENE_CONFIG.LIGHTING.pointLight.intensity}
          color={SCENE_CONFIG.LIGHTING.pointLight.color}
        />
        <directionalLight
          position={SCENE_CONFIG.LIGHTING.directionalLight.position}
          intensity={SCENE_CONFIG.LIGHTING.directionalLight.intensity}
          color={SCENE_CONFIG.LIGHTING.directionalLight.color}
        />
        <Sparkles
          count={SCENE_CONFIG.SPARKLES.count}
          scale={SCENE_CONFIG.SPARKLES.scale}
          size={SCENE_CONFIG.SPARKLES.size}
          color={SCENE_CONFIG.SPARKLES.color}
          speed={SCENE_CONFIG.SPARKLES.speed}
        />
        <Float rotationIntensity={0}>
          {members.map((member) => (
            <CouncilMember
              key={member.id}
              member={member}
              active={activeMembers.includes(member.id)}
              answer={answers[member.id]}
              onRetry={() => retryMember(member.id)}
            />
          ))}
        </Float>

        <CouncilUI
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
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
      {showHelp && <Help setShowHelp={setShowHelp} />}
      <History />
    </div>
  );
}
