import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { SCENE_CONFIG } from "./constants";
import { STYLES, SPACING, TYPOGRAPHY } from "./theme";
import type { CouncilMemberData } from "./hooks/useCouncilMembers";

export const CouncilMemberMesh = ({
  member,
  active,
  answer,
  onRetry,
}: {
  member: CouncilMemberData;
  active: boolean;
  answer?: string;
  onRetry?: () => void;
}) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const clock = useRef(new THREE.Clock());
  const basePosition = useRef(new THREE.Vector3(0, 0, 0));

  const initialRotationX = member.isTorus ? Math.PI / 2 : 0;

  // Create variation per member for more organic feel using memberId hash
  const idHash = member.id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const phaseOffset = (idHash * 0.7) % (Math.PI * 2);
  const speedVariation = 0.8 + (idHash % 3) * 0.2; // Vary between 0.8 and 1.2

  useFrame(() => {
    const t = clock.current.getElapsedTime();
    const material = mesh.current.material as THREE.MeshStandardMaterial;

    if (active) {
      // Base slow rotation with variation
      const rotationVariation = Math.sin(t * 1.5 + phaseOffset) * 0.001;
      mesh.current.rotation.y += 0.002 + rotationVariation;

      // Subtle scale pulse with multiple overlapping waves for organic feel
      const scaleWave1 = Math.sin(t * 3 * speedVariation + phaseOffset) * 0.03;
      const scaleWave2 =
        Math.sin(t * 1.8 * speedVariation + phaseOffset * 1.3) * 0.015;
      const scale = 1 + scaleWave1 + scaleWave2;
      mesh.current.scale.set(scale, scale, scale);

      // Enhanced emissive intensity with rich variation
      const intensityWave1 =
        Math.sin(t * 3.5 * speedVariation + phaseOffset) * 0.25;
      const intensityWave2 =
        Math.sin(t * 1.2 * speedVariation + phaseOffset * 2) * 0.15;
      const intensity = 0.4 + intensityWave1 + intensityWave2;
      material.emissiveIntensity = Math.max(0.2, Math.min(0.8, intensity));

      // Subtle vertical bobbing
      const bobOffset =
        Math.sin(t * 1.5 * speedVariation + phaseOffset * 0.5) * 0.04;
      mesh.current.position.y = basePosition.current.y + bobOffset;

      // Subtle rotation wobble on X and Z axes
      const wobbleX = Math.sin(t * 2.1 * speedVariation + phaseOffset) * 0.02;
      const wobbleZ =
        Math.cos(t * 1.7 * speedVariation + phaseOffset * 1.5) * 0.015;
      mesh.current.rotation.x = initialRotationX + wobbleX;
      mesh.current.rotation.z = wobbleZ;
    } else {
      // Reset to normal state when not active
      mesh.current.rotation.y += 0.002; // keep slow base spin
      mesh.current.scale.set(1, 1, 1);
      material.emissiveIntensity = 0.1;
      mesh.current.position.y = basePosition.current.y;
      mesh.current.rotation.x = initialRotationX;
      mesh.current.rotation.z = 0;
    }
  });

  return (
    <group position={member.position}>
      <mesh ref={mesh} rotation-x={initialRotationX}>
        {member.geometryFn(SCENE_CONFIG.MEMBER.size)}
        <meshStandardMaterial
          color={member.color}
          emissive={active ? member.color : "gray"}
          emissiveIntensity={active ? 0.3 : 0.1}
          roughness={member.roughness ?? 0.3}
          metalness={0.8}
        />
      </mesh>
      <Html position={[0, 1, 1]} center zIndexRange={[0, 100]}>
        <div
          className="hide-scrollbar"
          style={{
            ...STYLES.textBubble,
            color: member.textColor,
            fontSize: TYPOGRAPHY.fontSize.md,
            fontFamily: member.font,
            width: "300px",
            textAlign: "center",
            maxHeight: "200px",
            overflowY: "scroll",
            display: answer || active ? "block" : "none",
            position: "relative",
            //make text unselectable
            userSelect: "none",
          }}
        >
          {answer ?? (active ? "Thinking..." : "")}
          {(answer === "Error fetching response." || answer === "*silence*") &&
            onRetry && (
              <button
                onClick={onRetry}
                style={{
                  position: "absolute",
                  bottom: SPACING.xs,
                  right: SPACING.xs,
                  padding: SPACING.xs,
                  ...STYLES.glassMedium,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "20px",
                  height: "20px",
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
