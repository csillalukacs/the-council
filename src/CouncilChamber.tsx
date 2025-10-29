import { Canvas, useFrame, type Vector3 } from "@react-three/fiber";
import { Html, Float, Sparkles, OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState, type JSX } from "react";
import * as THREE from "three";

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

const CouncilMemberMesh = ({
  position,
  color,
  geometryFn,
  active,
  answer,
  font,
}: {
  position: Vector3;
  color: string;
  geometryFn: (size: number) => JSX.Element;
  active: boolean;
  answer?: string;
  font: string;
}) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const clock = useRef(new THREE.Clock());

  useFrame(() => {
    const t = clock.current.getElapsedTime();
    mesh.current.rotation.y += 0.002; // keep slow spin

    // Pulse when active
    const scale = active ? 1 + Math.sin(t * 4) * 0.1 : 1;
    mesh.current.scale.set(scale, scale, scale);
  });

  return (
    <group position={position}>
      <mesh ref={mesh}>
        {geometryFn(0.8)}
        <meshStandardMaterial
          color={color}
          emissive={active ? color : "gray"}
          emissiveIntensity={active ? 0.3 : 0.1}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      <Html position={[0, 1, 1]} center>
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            padding: "4px 8px",
            borderRadius: "6px",
            color: color,
            fontSize: "13px",
            fontFamily: font,
            backdropFilter: "blur(4px)",
            width: "300px",
            textAlign: "center",
            maxHeight: "200px",
            overflow: "scroll",
            display: answer || active ? "block" : "none",
          }}
        >
          {answer ?? (active ? "Thinking..." : "")}
        </div>
      </Html>
    </group>
  );
};

export default function CouncilChamber() {
  const members: CouncilMemberData[] = useMemo(
    () =>
      Array.from({ length: COUNCIL_SIZE }).map((_, i) => {
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
          "You are The Challenger - Plays devil's advocate, questions assumptions, pushes back on self-deception. Sometimes uncomfortable but catalyzes growth. 'Are you sure that's really the problem?'",
          "You are The Empath - Deeply attuned to emotions and relationships. Helps the citizen understand their feelings and those of others involved. The emotional translator.",
          "You are The Historian - Your main job is to provide historical perspective. Recognizes patterns from human history. 'This reminds me of when...'  Provides relevant historical quotes. Uses old timey language.",
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
        ]

        const colors = ['#ff8800', '#00ff00', '#8888ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];

        const geometryFn = geometries[i % geometries.length];

        return {
          position,
          font: fonts[i % fonts.length],
          color: colors[i % colors.length],
          personality: personalities[i % personalities.length],
          geometryFn,
        };
      }),
    []
  );

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeMembers, setActiveMembers] = useState<number[]>([]);
  const [answers, setAnswers] = useState<(string | undefined)[]>(
    Array(members.length).fill(undefined)
  );

  const askCouncil = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setActiveMembers(Array.from({ length: COUNCIL_SIZE }, (_, i) => i));
    setAnswers(Array(members.length).fill(undefined));
  
    // Launch all fetches simultaneously
    await Promise.allSettled(
      members.map(async (m, i) => {
        try {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "meta-llama/llama-3.3-70b-instruct:free",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a member of a temporary council, advising a Citizen. Do not reveal your role. Keep it brief when possible. Do not ask the user questions; they will not get to reply. Always give advice based on your unique viewpoint and personality. Do not give advice that most people would give.",
                },
                { role: "system", content: `${m.personality}` },
                { role: "user", content: query },
              ],
            }),
          });
  
          const data = await response.json();
          const output =
            data?.choices?.[0]?.message?.content ?? "*silence*";
  
          // Update this member’s answer immediately
          setAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[i] = output;
            return newAnswers;
          });
  
          // Mark this member as done
          setActiveMembers(prev => prev.filter(x => x !== i));
        } catch (error) {
          console.error(error);
          setAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[i] = "Error fetching response.";
            return newAnswers;
          });
          setActiveMembers(prev => prev.filter(x => x !== i));
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
      }}
    >
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

        <Html center position={[0, -1, 0]}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
              style={{
                padding: "8px 16px",
                background: "rgba(102, 204, 255, 0.15)",
                border: "1px solid rgba(102, 204, 255, 0.4)",
                borderRadius: "6px",
                minWidth: "300px",
                color: "#ccf6ff",
                fontSize: "14px",
                letterSpacing: "0.5px",
                backdropFilter: "blur(6px)",
                boxShadow: "0 0 12px rgba(102, 204, 255, 0.3)",
              }}
            >
              <textarea
                placeholder="the council is listening. what ails you, citizen?"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);

                  // auto-expand logic
                  const target = e.target;
                  target.style.height = "auto"; // reset height
                  target.style.height =
                    Math.min(target.scrollHeight, window.innerHeight * 0.6) +
                    "px"; // max 60vh
                }}
                style={{
                  width: "500px",
                  background: "transparent",
                  border: "none",
                  color: "white",
                  outline: "none",
                  textAlign: "center",
                  fontSize: "16px",
                  overflow: "scroll",
                  resize: "none", // prevent manual resizing
                }}
              />
            </div>
            <button
              disabled={loading}
              onClick={askCouncil}
              style={{
                marginTop: "12px",
                padding: "8px 16px",
                background: loading
                  ? "rgba(102, 204, 255, 0.05)"
                  : "rgba(102, 204, 255, 0.15)",
                border: "1px solid rgba(102, 204, 255, 0.4)",
                borderRadius: "6px",
                color: "#ccf6ff",
                fontSize: "14px",
                letterSpacing: "0.5px",
                cursor: loading ? "not-allowed" : "pointer",
                backdropFilter: "blur(6px)",
                boxShadow: "0 0 12px rgba(102, 204, 255, 0.3)",
                transition: "all 0.2s ease",
              }}
            >
              {loading ? "the council is deliberating..." : "ask the council"}
            </button>
          </div>
        </Html>
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
}
