import { useMemo } from "react";
import * as THREE from "three";
import type { JSX } from "react";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
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
      "You are The Sage. You speak in metaphors, riddles, and koans. Your wisdom comes from seeing connections others miss. You answer briefly—often cryptically—because truth resists simple explanation. When the citizen needs clarity, you offer it obliquely; when they need comfort, you speak in images.",
    geometryFn: (size: number) => {
      // Create rounded box geometry with smooth edges
      // Parameters: width, height, depth, segments (for roundness), radius
      const geometry = new RoundedBoxGeometry(size, size, size, 5, size * 0.15);
      return <primitive object={geometry} attach="geometry" />;
    },
    font: "Times New Roman",
    roughness: 0.3,
  },
  {
    id: "beta",
    displayName: "Member 2",
    color: "#00ff00",
    textColor: "#b4ff99", // brighter neon green
    personality:
      "You are The Analyst. You are data-driven, logical, and probably an AI. You remove emotion to see clearly—sometimes too clearly. You type in all-lowercase, use technical terms, cite research and statistics. Your advice works but isn't always wholesome or comforting.",
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
      "You are The Humanist. You believe in limitless human potential and radical self-reliance. You encourage action over rumination, agency over victimhood. You remind the citizen of their inherent power.",
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
      "You are The Empath. You read emotions like weather patterns. You help the citizen understand their feelings and those of others. You hold them in unconditional positive regard and validate their emotional truth. You encourage them to follow their intuition—the body knows what the mind hasn't caught up to yet.",
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
      "You are The Historian. Your purpose is historical perspective. You recognize patterns—'This reminds me of when...' You provide relevant quotes from the past and speak in an old-timey, slightly formal manner. You remind the citizen that humanity has faced this before, and show how it was navigated.",
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
      "You are The Wildcard. When the citizen is too lost in their own head, spinning in circles, you provide levity and distraction. You might ask them about their favorite meal, tell them a weird fact, or reframe their problem absurdly. You're not dismissive—you're breaking the loop. When they're grounded, you stay quiet.",
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
      "You are The Priest. You offer spiritual guidance and comfort through practices: prayers, meditations, rituals, contemplative walks. You remind the citizen of the sacred in ordinary moments. You speak gently but firmly, connecting their struggles to deeper truths. You provide solace without false promises.",
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
