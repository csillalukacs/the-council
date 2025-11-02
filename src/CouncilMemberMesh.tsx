import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, type JSX } from "react";
import type { Vector3 } from "three";
import * as THREE from "three";
import { SCENE_CONFIG } from "./constants";

export const CouncilMemberMesh = ({
  position,
  color,
  textColor,
  geometryFn,
  active,
  answer,
  font,
  onRetry,
}: {
  position: Vector3;
  color: string;
  textColor: string;
  geometryFn: (size: number) => JSX.Element;
  active: boolean;
  answer?: string;
  font: string;
  onRetry?: () => void;
}) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const clock = useRef(new THREE.Clock());

  useFrame(() => {
    const t = clock.current.getElapsedTime();
    mesh.current.rotation.y += 0.002; // keep slow spin

    // Pulse when active
    const scale = active ? 1 + Math.sin(t * 4) * 0.02 : 1;
    mesh.current.scale.set(scale, scale, scale);
    const intensity = active ? 0.3 + Math.sin(t * 4) * 0.2 : 0.1;
    (mesh.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      intensity;
  });

  return (
    <group position={position}>
      <mesh ref={mesh}>
        {geometryFn(SCENE_CONFIG.MEMBER.size)}
        <meshStandardMaterial
          color={color}
          emissive={active ? color : "gray"}
          emissiveIntensity={active ? 0.3 : 0.1}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      <Html position={[0, 1, 1]} center zIndexRange={[0, 100]}>
        <div
          className="hide-scrollbar"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            padding: "4px 8px",
            borderRadius: "6px",
            color: textColor,
            fontSize: "13px",
            fontFamily: font,
            backdropFilter: "blur(4px)",
            width: "300px",
            textAlign: "center",
            maxHeight: "200px",
            overflowY: "scroll",
            display: answer || active ? "block" : "none",
            position: "relative",
          }}
        >
          {answer ?? (active ? "Thinking..." : "")}
          {(answer === "Error fetching response." || answer === "*silence*") &&
            onRetry && (
              <button
                onClick={onRetry}
                style={{
                  position: "absolute",
                  bottom: "4px",
                  right: "4px",
                  padding: "4px",
                  background: "rgba(102, 204, 255, 0.15)",
                  border: "1px solid rgba(102, 204, 255, 0.4)",
                  borderRadius: "4px",
                  color: "#ccf6ff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "20px",
                  height: "20px",
                  transition: "all 0.2s ease",
                }}
                title="Retry"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              </button>
            )}
        </div>
      </Html>
    </group>
  );
};
