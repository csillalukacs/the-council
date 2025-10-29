import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, type JSX } from "react";
import type { Vector3 } from "three";
import * as THREE from "three";

export const CouncilMemberMesh = ({
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
    const scale = active ? 1 + Math.sin(t * 4) * 0.02 : 1;
    mesh.current.scale.set(scale, scale, scale);
    const intensity = active ? 0.3 + Math.sin(t * 4) * 0.2 : 0.1;
    (mesh.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      intensity;
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
          className="hide-scrollbar"
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
            overflowY: "scroll",
            display: answer || active ? "block" : "none",
          }}
        >
          {answer ?? (active ? "Thinking..." : "")}
        </div>
      </Html>
    </group>
  );
};
