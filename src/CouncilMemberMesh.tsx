import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import {
  SCENE_CONFIG,
  MEMBER_ANIMATION,
  UI_TEXT,
  DIMENSIONS,
  Z_INDEX,
} from "./constants";
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
  const textBubbleRef = useRef<HTMLDivElement>(null);

  const initialRotationX = member.isTorus
    ? MEMBER_ANIMATION.torusInitialRotation
    : 0;

  // Create variation per member for more organic feel using memberId hash
  const idHash = member.id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const phaseOffset =
    (idHash * MEMBER_ANIMATION.variation.phaseMultiplier) % (Math.PI * 2);
  const speedVariation =
    MEMBER_ANIMATION.variation.speedBase +
    (idHash % 3) * (MEMBER_ANIMATION.variation.speedRange / 3);

  // Auto-scroll text bubble to bottom when answer changes
  useEffect(() => {
    if (textBubbleRef.current && answer) {
      textBubbleRef.current.scrollTop = textBubbleRef.current.scrollHeight;
    }
  }, [answer]);

  useFrame(() => {
    const t = clock.current.getElapsedTime();
    const material = mesh.current.material as THREE.MeshStandardMaterial;

    if (active) {
      // Base slow rotation with variation
      const rotationVariation =
        Math.sin(
          t * MEMBER_ANIMATION.rotationVariation.frequency + phaseOffset
        ) * MEMBER_ANIMATION.rotationVariation.amplitude;
      mesh.current.rotation.y +=
        MEMBER_ANIMATION.baseRotationSpeed + rotationVariation;

      // Subtle scale pulse with multiple overlapping waves for organic feel
      const scaleWave1 =
        Math.sin(
          t * MEMBER_ANIMATION.scale.wave1.frequency * speedVariation +
            phaseOffset
        ) * MEMBER_ANIMATION.scale.wave1.amplitude;
      const scaleWave2 =
        Math.sin(
          t * MEMBER_ANIMATION.scale.wave2.frequency * speedVariation +
            phaseOffset * 1.3
        ) * MEMBER_ANIMATION.scale.wave2.amplitude;
      const scale = 1 + scaleWave1 + scaleWave2;
      mesh.current.scale.set(scale, scale, scale);

      // Enhanced emissive intensity with rich variation
      const intensityWave1 =
        Math.sin(
          t * MEMBER_ANIMATION.emissive.wave1.frequency * speedVariation +
            phaseOffset
        ) * MEMBER_ANIMATION.emissive.wave1.amplitude;
      const intensityWave2 =
        Math.sin(
          t * MEMBER_ANIMATION.emissive.wave2.frequency * speedVariation +
            phaseOffset * 2
        ) * MEMBER_ANIMATION.emissive.wave2.amplitude;
      const intensity =
        MEMBER_ANIMATION.emissive.base + intensityWave1 + intensityWave2;
      material.emissiveIntensity = Math.max(
        MEMBER_ANIMATION.emissive.min,
        Math.min(MEMBER_ANIMATION.emissive.max, intensity)
      );

      // Subtle vertical bobbing
      const bobOffset =
        Math.sin(
          t * MEMBER_ANIMATION.bob.frequency * speedVariation +
            phaseOffset * 0.5
        ) * MEMBER_ANIMATION.bob.amplitude;
      mesh.current.position.y = basePosition.current.y + bobOffset;

      // Subtle rotation wobble on X and Z axes
      const wobbleX =
        Math.sin(
          t * MEMBER_ANIMATION.wobble.x.frequency * speedVariation + phaseOffset
        ) * MEMBER_ANIMATION.wobble.x.amplitude;
      const wobbleZ =
        Math.cos(
          t * MEMBER_ANIMATION.wobble.z.frequency * speedVariation +
            phaseOffset * 1.5
        ) * MEMBER_ANIMATION.wobble.z.amplitude;
      mesh.current.rotation.x = initialRotationX + wobbleX;
      mesh.current.rotation.z = wobbleZ;
    } else {
      // Reset to normal state when not active
      mesh.current.rotation.y += MEMBER_ANIMATION.baseRotationSpeed; // keep slow base spin
      mesh.current.scale.set(1, 1, 1);
      material.emissiveIntensity = MEMBER_ANIMATION.emissive.inactive;
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
          emissiveIntensity={
            active
              ? MEMBER_ANIMATION.emissive.activeDefault
              : MEMBER_ANIMATION.emissive.inactive
          }
          roughness={member.roughness ?? 0.3}
          metalness={0.8}
        />
      </mesh>
      <Html position={[0, 1, 1]} center zIndexRange={Z_INDEX.htmlOverlay}>
        <div
          ref={textBubbleRef}
          className="hide-scrollbar"
          style={{
            ...STYLES.textBubble,
            color: member.textColor,
            fontSize: TYPOGRAPHY.fontSize.md,
            fontFamily: member.font,
            width: DIMENSIONS.textBubble.width,
            textAlign: "center",
            maxHeight: DIMENSIONS.textBubble.maxHeight,
            overflowY: "scroll",
            display: answer || active ? "block" : "none",
            position: "relative",
            //make text unselectable
            userSelect: "none",
          }}
        >
          {answer ?? (active ? UI_TEXT.STATUS.thinking : "")}
          {answer === UI_TEXT.STATUS.silence && onRetry && (
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
                width: DIMENSIONS.retryButton.width,
                height: DIMENSIONS.retryButton.height,
              }}
              title="Retry"
            >
              <svg
                width={DIMENSIONS.retryButton.iconSize}
                height={DIMENSIONS.retryButton.iconSize}
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
