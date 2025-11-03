import { Float, Sparkles, OrbitControls } from "@react-three/drei";
import { CouncilMember } from "../CouncilMember";
import CouncilUI from "../CouncilUI";
import SceneLights from "./SceneLights";
import { SCENE_CONFIG } from "../constants";
import type { CouncilMemberData } from "../hooks/useCouncilMembers";

interface CouncilSceneProps {
  members: CouncilMemberData[];
  activeMembers: string[];
  answers: Record<string, string | undefined>;
  onRetryMember: (memberId: string) => void;
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

export default function CouncilScene({
  members,
  activeMembers,
  answers,
  onRetryMember,
  showKeyInput,
  setShowKeyInput,
  apiKey,
  query,
  setQuery,
  loading,
  askCouncil,
  setApiKey,
  setShowHelp,
}: CouncilSceneProps) {
  return (
    <>
      <SceneLights />
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
            onRetry={() => onRetryMember(member.id)}
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
        askCouncil={askCouncil}
        setApiKey={setApiKey}
        setShowHelp={setShowHelp}
      />
      <OrbitControls enablePan={false} enableZoom={false} />
    </>
  );
}
