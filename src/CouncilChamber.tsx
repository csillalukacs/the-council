import { Canvas, useFrame, type Vector3 } from "@react-three/fiber";
import { Html, Float, Sparkles } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

type CouncilMemberData = {
  position: THREE.Vector3;
  color: string;
  personality: string; // their unique prompt or personality description
};


const CouncilMemberMesh = ({
  position,
  color,
  active,
}: {
  position: Vector3;
  color: string;
  active: boolean;
}) => {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    mesh.current.rotation.y += delta * 0.2;
  });

  return (
    <group position={position}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={active ? color : "blue"}
          emissiveIntensity={active ? 1.5 : 0.2}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      {active && (
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
            }}
          >
            “Opinion incoming...”
          </div>
        </Html>
      )}
    </group>
  );
};

export default function CouncilChamber() {
  const members: CouncilMemberData[] = Array.from({ length: 8 }).map((_, i) => {
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
  
    return {
      position,
      color: `hsl(${(i / 8) * 360}, 80%, 60%)`,
      personality: personalities[i % personalities.length],
    };
  });

  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const askMember = async function (member: number) {
    console.log("askMember", member);
    const m = members[member];
    setLoading(true);
    // setResult(""); // clear previous result
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.3-8b-instruct:free",
            messages: [
              {
                role: "system",
                content: `You are ${m.personality}`,
              },
              {
                role: "user",
                content: query,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const output = data?.choices?.[0]?.message?.content ?? "No response.";

      console.log(output);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
              color={`hsl(${(i / 8) * 360}, 80%, 60%)`}
              active={i === 0} // simulate one "speaking"
            />
          ))}
        </Float>

        {/* Central altar / input placeholder */}
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
              style={{
                marginTop: "12px",
                padding: "8px 16px",
                background: "rgba(102, 204, 255, 0.15)",
                border: "1px solid rgba(102, 204, 255, 0.4)",
                borderRadius: "6px",
                color: "#ccf6ff",
                fontSize: "14px",
                letterSpacing: "0.5px",
                cursor: "pointer",
                backdropFilter: "blur(6px)",
                boxShadow: "0 0 12px rgba(102, 204, 255, 0.3)",
                transition:
                  "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget.style.background =
                  "rgba(102, 204, 255, 0.25)"),
                  (e.currentTarget.style.boxShadow =
                    "0 0 16px rgba(102, 204, 255, 0.6)"),
                  (e.currentTarget.style.transform = "translateY(-1px)");
              }}
              onMouseLeave={(e) => {
                (e.currentTarget.style.background =
                  "rgba(102, 204, 255, 0.15)"),
                  (e.currentTarget.style.boxShadow =
                    "0 0 12px rgba(102, 204, 255, 0.3)"),
                  (e.currentTarget.style.transform = "translateY(0)");
              }}
              onClick={() => askMember(0)}
            >
              ask the council
            </button>
          </div>
        </Html>

        {/* <OrbitControls enablePan={false} /> */}
      </Canvas>
    </div>
  );
}
