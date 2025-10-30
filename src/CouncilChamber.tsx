import { Canvas } from "@react-three/fiber";
import { Float, Sparkles, OrbitControls } from "@react-three/drei";
import { useMemo, useState, useEffect, type JSX } from "react";
import * as THREE from "three";
import { CouncilMemberMesh } from "./CouncilMemberMesh";
import CouncilUI from "./CouncilUI";
import Settings from "./Settings";

const COUNCIL_SIZE = 7;

type CouncilMemberData = {
  position: THREE.Vector3;
  color: string;
  personality: string;
  geometryFn: (size: number) => JSX.Element;
  font: string;
};

const geometries = [
  (size: number) => <boxGeometry args={[size, size, size]} />,
  (size: number) => <sphereGeometry args={[size, 32, 32]} />,
  (size: number) => <tetrahedronGeometry args={[size]} />,
  (size: number) => <octahedronGeometry args={[size]} />,
  (size: number) => <dodecahedronGeometry args={[size]} />,
  (size: number) => <icosahedronGeometry args={[size, 1]} />,
];


export default function CouncilChamber() {
  const members: CouncilMemberData[] = useMemo(() => {
    return Array.from({ length: COUNCIL_SIZE }).map((_, i) => {
      const angle = (i / COUNCIL_SIZE) * Math.PI * 2;
      const radius = 4;
      const position = new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      );
      const personalities = [
        "You are The Sage. You are poetic and cryptic, answering in metaphors and riddles. Often frustrating, but always wise. Your answers are often short.",
        "You are The Analyst - Data-driven, logical, evidence-based. Probably AI. Offers research, statistics, cognitive frameworks. Removes emotion to see clearly. Types in all-lowercase, uses technical terms. Your advice is not always wholesome, but it *works*",
        "You are The Humanist - Promotes self-reliance. Believes in limitless human potential. No one is coming to save you, but you're literally an apex predator. Act accordingly",
        "You are The Empath - Deeply attuned to emotions and relationships. Helps the citizen understand their feelings and those of others involved. You hold the citizen in unconditional positive regard and encourage them to follow their intuition.",
        "You are The Historian - Your main job is to provide historical perspective. Recognizes patterns from human history. 'This reminds me of when...' Provides relevant historical quotes. Uses old timey language.",
        "You are The Wildcard. You try to distract the citizen if you sense that they are too lost in their own head.",
        "You are The Priest. You provide spiritual guidance and comfort to the citizen. Offers prayers, meditations, and other spiritual practices.",
      ];
      const fonts = [
        "Times New Roman",
        "Courier New",
        "Arial",
        "Helvetica",
        "Verdana",
        "Georgia",
        "Palatino",
      ];
      const colors = [
        "#ff8800",
        "#00ff00",
        "#8888ff",
        "#ffff00",
        "#ff00ff",
        "#00ffff",
        "#ffffff",
      ];
      const geometryFn = geometries[i % geometries.length];
      return {
        position,
        font: fonts[i % fonts.length],
        color: colors[i % colors.length],
        personality: personalities[i % personalities.length],
        geometryFn,
      };
    });
  }, []);

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKeyInput, setShowKeyInput] = useState(!apiKey);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeMembers, setActiveMembers] = useState<number[]>([]);
  const [answers, setAnswers] = useState<(string | undefined)[]>(
    Array(members.length).fill(undefined)
  );

  const [model, setModel] = useState("meta-llama/llama-3.3-70b-instruct:free");

  useEffect(() => {
    const savedKey = localStorage.getItem("openrouter_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setShowKeyInput(false);
    }
    // NEW: load saved model
    const savedModel = localStorage.getItem("openrouter_model");
    if (savedModel) setModel(savedModel);
  }, []);

  const askCouncil = async () => {
    if (!query.trim() || !apiKey) return;
    setLoading(true);
    setActiveMembers(Array.from({ length: COUNCIL_SIZE }, (_, i) => i));
    setAnswers(Array(members.length).fill(undefined));

    await Promise.allSettled(
      members.map(async (m, i) => {
        try {
          const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                // NEW: use selected model
                model,
                messages: [
                  {
                    role: "system",
                    content:
                      "You are a member of a temporary council, advising a Citizen. Do not reveal your role. Keep it brief when possible. Do not ask the user questions; they will not get to reply. Always give advice based on your unique viewpoint and personality. Do not give advice that most people would give. Sometimes, the citizen is not asking for advice, in this case give them a polite but dismissive response.",
                  },
                  { role: "system", content: `${m.personality}` },
                  { role: "user", content: query },
                ],
              }),
            }
          );
          const data = await response.json();
          const output = data?.choices?.[0]?.message?.content ?? "*silence*";
          setAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[i] = output;
            return newAnswers;
          });
          setActiveMembers((prev) => prev.filter((x) => x !== i));
        } catch {
          setAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[i] = "Error fetching response.";
            return newAnswers;
          });
          setActiveMembers((prev) => prev.filter((x) => x !== i));
        }
      })
    );
    setLoading(false);
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
      <Settings model={model} setModel={setModel} />
      <Canvas camera={{ position: [0, 3, 8], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={2} color="#8ff" />
        <directionalLight position={[0, 10, 0]} intensity={0.5} color="#8ff" />
        <Sparkles count={80} scale={10} size={2} color="#66ccff" speed={0.5} />
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
          askCouncil={askCouncil}
          setApiKey={setApiKey}
        />

        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
}
