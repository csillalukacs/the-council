import { useRef } from "react";
import * as THREE from "three";
import { SCENE_CONFIG, MEMBER_ANIMATION } from "./constants";
import type { CouncilMemberData } from "./hooks/useCouncilMembers";
import { useMemberAnimation } from "./hooks/useMemberAnimation";
import TextBubble from "./components/TextBubble";

export const CouncilMember = ({
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

  const { initialRotationX } = useMemberAnimation({
    meshRef: mesh,
    active,
    memberId: member.id,
    isTorus: member.isTorus ?? false,
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
      <TextBubble
        text={answer}
        active={active}
        textColor={member.textColor}
        font={member.font}
        onRetry={onRetry}
      />
    </group>
  );
};
