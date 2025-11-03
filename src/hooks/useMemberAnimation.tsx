import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { MEMBER_ANIMATION } from "../constants";

interface UseMemberAnimationProps {
  meshRef: React.RefObject<THREE.Mesh>;
  active: boolean;
  memberId: string;
  isTorus: boolean;
}

export function useMemberAnimation({
  meshRef,
  active,
  memberId,
  isTorus,
}: UseMemberAnimationProps) {
  const clock = useRef(new THREE.Clock());
  const basePosition = useRef(new THREE.Vector3(0, 0, 0));

  const initialRotationX = isTorus ? MEMBER_ANIMATION.torusInitialRotation : 0;

  // Create variation per member for more organic feel using memberId hash
  const idHash = memberId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const phaseOffset =
    (idHash * MEMBER_ANIMATION.variation.phaseMultiplier) % (Math.PI * 2);
  const speedVariation =
    MEMBER_ANIMATION.variation.speedBase +
    (idHash % 3) * (MEMBER_ANIMATION.variation.speedRange / 3);

  // Store initial position when mesh is first created
  useFrame(() => {
    if (!meshRef.current) return;

    if (
      basePosition.current.x === 0 &&
      basePosition.current.y === 0 &&
      basePosition.current.z === 0
    ) {
      basePosition.current.copy(meshRef.current.position);
    }

    const t = clock.current.getElapsedTime();
    const material = meshRef.current.material as THREE.MeshStandardMaterial;

    if (active) {
      // Base slow rotation with variation
      const rotationVariation =
        Math.sin(
          t * MEMBER_ANIMATION.rotationVariation.frequency + phaseOffset
        ) * MEMBER_ANIMATION.rotationVariation.amplitude;
      meshRef.current.rotation.y +=
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
      meshRef.current.scale.set(scale, scale, scale);

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
      meshRef.current.position.y = basePosition.current.y + bobOffset;

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
      meshRef.current.rotation.x = initialRotationX + wobbleX;
      meshRef.current.rotation.z = wobbleZ;
    } else {
      // Reset to normal state when not active
      meshRef.current.rotation.y += MEMBER_ANIMATION.baseRotationSpeed; // keep slow base spin
      meshRef.current.scale.set(1, 1, 1);
      material.emissiveIntensity = MEMBER_ANIMATION.emissive.inactive;
      meshRef.current.position.y = basePosition.current.y;
      meshRef.current.rotation.x = initialRotationX;
      meshRef.current.rotation.z = 0;
    }
  });

  return { initialRotationX };
}
