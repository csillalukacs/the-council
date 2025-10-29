import { Canvas, useFrame, type Vector3 } from "@react-three/fiber";
import { Html, Float, Sparkles } from "@react-three/drei";
import { useMemo, useRef, useState, type JSX } from "react";
import * as THREE from "three";

type CouncilMemberData = {
  position: THREE.Vector3;
  color: string;
  personality: string;
  geometryFn: (size: number) => JSX.Element;
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
}: {
  position: Vector3;
  color: string;
  geometryFn: (size: number) => JSX.Element;
  active: boolean;
  answer?: string;
}) => {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    mesh.current.rotation.y += delta * 0.2;
  });

  return (
    <group position={position}>
      <mesh ref={mesh}>
        {geometryFn(0.4)}
        <meshStandardMaterial
          color={color}
          emissive={active ? color : "gray"}
          emissiveIntensity={active ? 1.5 : 0.2}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      <Html position={[0, 0.8, 0]} center>
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            padding: "4px 8px",
            borderRadius: "6px",
            color: "white",
            fontSize: "12px",
            backdropFilter: "blur(4px)",
            minWidth: "80px",
            textAlign: "center",
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
      Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 4;
        const position = new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        );
        const personalities = [
          "You are poetic and cryptic, answering in metaphors.",
          "You are logical and concise, answering like a scientist.",
          "You are mischievous and ironic, answering playfully.",
          "You are empathetic and kind, offering reassurance.",
          "You are philosophical, pondering the question deeply.",
          "You are skeptical and contrarian.",
          "You are optimistic and cheerful.",
          "You are ancient and wise, speaking in riddles.",
        ];

        const geometryFn = geometries[i % geometries.length];

        return {
          position,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`, // random color
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
    setActiveMembers(Array.from({ length: 8 }, (_, i) => i));
    setAnswers(Array(members.length).fill(undefined));

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      try {
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${
                import.meta.env.VITE_OPENROUTER_API_KEY
              }`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "meta-llama/llama-3.3-8b-instruct:free",
              messages: [
                { role: "system", content: `${m.personality}` },
                { role: "user", content: query },
              ],
            }),
          }
        );
        const data = await response.json();
        const output = data?.choices?.[0]?.message?.content ?? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

        // Update answer for this member immediately
        setAnswers((prev) => {
          const newAnswers = [...prev];
          newAnswers[i] = output;
          return newAnswers;
        });
        setActiveMembers((prev) => prev.filter((x) => x !== i));
      } catch (error) {
        console.error(error);
        setAnswers((prev) => {
          const newAnswers = [...prev];
          newAnswers[i] = "Error fetching response.";
          return newAnswers;
        });
      }
    }

    setActiveMembers([]);
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
                placeholder="Ask the council..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  color: "white",
                  outline: "none",
                  textAlign: "center",
                  fontSize: "16px",
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
      </Canvas>
    </div>
  );
}
