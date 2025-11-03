import { useMemo } from "react";
import * as THREE from "three";
import type { JSX } from "react";
import { SCENE_CONFIG } from "../constants";

export type CouncilMemberData = {
  id: string;
  displayName: string;
  position: THREE.Vector3;
  color: string;
  textColor: string;
  personality: string;
  geometryFn: (size: number) => JSX.Element;
  font: string;
  isTorus?: boolean; // For initial rotation handling
  roughness?: number; // For material properties
};

// Define all council members with explicit properties
const COUNCIL_MEMBER_DEFINITIONS: Omit<CouncilMemberData, "position">[] = [
  {
    id: "alpha",
    displayName: "Member 1",
    color: "#ff8800",
    textColor: "#d59980", // muted terracotta
    personality:
      "You are The Sage. You are poetic and cryptic, answering in metaphors and riddles. Often frustrating, but always wise. Your answers are often short.",
    geometryFn: (size: number) => <boxGeometry args={[size, size, size]} />,
    font: "Times New Roman",
    roughness: 0.3,
  },
  {
    id: "beta",
    displayName: "Member 2",
    color: "#00ff00",
    textColor: "#b4ff99", // brighter neon green
    personality:
      "You are The Analyst - Data-driven, logical, evidence-based. Probably AI. Offers research, statistics, cognitive frameworks. Removes emotion to see clearly. Types in all-lowercase, uses technical terms. Your advice is not always wholesome, but it *works*",
    geometryFn: (size: number) => <sphereGeometry args={[size, 32, 32]} />,
    font: "Courier New",
    roughness: 0.9,
  },
  {
    id: "gamma",
    displayName: "Member 3",
    color: "#8888ff",
    textColor: "#aab5e8", // muted periwinkle blue
    personality:
      "You are The Humanist - Promotes self-reliance. Believes in limitless human potential. No one is coming to save you, but you're literally an apex predator. Act accordingly",
    geometryFn: (size: number) => <tetrahedronGeometry args={[size]} />,
    font: "Arial",
    roughness: 0.3,
  },
  {
    id: "delta",
    displayName: "Member 4",
    color: "#ffff00",
    textColor: "#e5d496", // muted gold
    personality:
      "You are The Empath - Deeply attuned to emotions and relationships. Helps the citizen understand their feelings and those of others involved. You hold the citizen in unconditional positive regard and encourage them to follow their intuition.",
    geometryFn: (size: number) => <octahedronGeometry args={[size]} />,
    font: "Helvetica",
    roughness: 0.3,
  },
  {
    id: "epsilon",
    displayName: "Member 5",
    color: "#ff00ff",
    textColor: "#d9a1c8", // muted rose
    personality:
      "You are The Historian - Your main job is to provide historical perspective. Recognizes patterns from human history. 'This reminds me of when...' Provides relevant historical quotes. Uses old timey language.",
    geometryFn: (size: number) => <dodecahedronGeometry args={[size]} />,
    font: "Verdana",
    roughness: 0.3,
  },
  {
    id: "zeta",
    displayName: "Member 6",
    color: "#00ffff",
    textColor: "#9bc5c5", // muted teal
    personality:
      "You are The Wildcard. You try to distract the citizen if you sense that they are too lost in their own head.",
    geometryFn: (size: number) => <icosahedronGeometry args={[size]} />,
    font: "Georgia",
    roughness: 0.3,
  },
  {
    id: "eta",
    displayName: "Member 7",
    color: "#ffffff",
    textColor: "#e0e0e0", // soft gray
    personality:
      "You are The Priest. You provide spiritual guidance and comfort to the citizen. Offers prayers, meditations, and other spiritual practices.",
    geometryFn: (size: number) => (
      <torusGeometry args={[size, size / 2, 16, 64]} />
    ),
    font: "Palatino",
    isTorus: true,
    roughness: 0.9,
  },
];

export function useCouncilMembers(): CouncilMemberData[] {
  return useMemo(() => {
    const memberCount = COUNCIL_MEMBER_DEFINITIONS.length;

    return COUNCIL_MEMBER_DEFINITIONS.map((member, i) => {
      const angle = (i / memberCount) * Math.PI * 2;
      const position = new THREE.Vector3(
        Math.cos(angle) * SCENE_CONFIG.MEMBER.radius,
        0,
        Math.sin(angle) * SCENE_CONFIG.MEMBER.radius
      );

      return {
        ...member,
        position,
      };
    });
  }, []);
}
