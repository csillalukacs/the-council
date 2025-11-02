import { Canvas } from "@react-three/fiber";
import { Float, Sparkles, OrbitControls } from "@react-three/drei";
import { useState } from "react";
import { CouncilMemberMesh } from "./CouncilMemberMesh";
import CouncilUI from "./CouncilUI";
import Settings from "./Settings";
import History from "./History";
import Help from "./Help";
import { useCouncilMembers } from "./hooks/useCouncilMembers";
import { useCouncilApi } from "./hooks/useCouncilApi";
import { useApiKey, useModels } from "./hooks/useLocalStorage";
import { SCENE_CONFIG } from "./constants";

export default function CouncilChamber() {
  const members = useCouncilMembers();
  const [apiKey, setApiKey] = useApiKey();
  const [models, setModels] = useModels();
  const [showKeyInput, setShowKeyInput] = useState(!apiKey);
  const [query, setQuery] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  const { loading, answers, activeMembers, askCouncil } = useCouncilApi({
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
        background: "radial-gradient(circle at center, #111, #000)",
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
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={2} color="#8ff" />
        <directionalLight position={[0, 10, 0]} intensity={0.5} color="#8ff" />
        <Sparkles
          count={SCENE_CONFIG.SPARKLES.count}
          scale={SCENE_CONFIG.SPARKLES.scale}
          size={SCENE_CONFIG.SPARKLES.size}
          color={SCENE_CONFIG.SPARKLES.color}
          speed={SCENE_CONFIG.SPARKLES.speed}
        />
        <Float rotationIntensity={0}>
          {members.map((member, i) => (
            <CouncilMemberMesh
              key={i}
              position={member.position}
              color={member.color}
              active={activeMembers.includes(i)}
              answer={answers[i]}
              geometryFn={member.geometryFn}
              font={member.font}
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
