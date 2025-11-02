import { useMemo } from "react";
import * as THREE from "three";
import type { JSX } from "react";
import {
  COUNCIL_SIZE,
  COLORS,
  PERSONALITIES,
  FONTS,
  SCENE_CONFIG,
} from "../constants";
import { GEOMETRIES } from "../geometries";

export type CouncilMemberData = {
  position: THREE.Vector3;
  color: string;
  personality: string;
  geometryFn: (size: number) => JSX.Element;
  font: string;
};

export function useCouncilMembers(): CouncilMemberData[] {
  return useMemo(() => {
    return Array.from({ length: COUNCIL_SIZE }).map((_, i) => {
      const angle = (i / COUNCIL_SIZE) * Math.PI * 2;
      const position = new THREE.Vector3(
        Math.cos(angle) * SCENE_CONFIG.MEMBER.radius,
        0,
        Math.sin(angle) * SCENE_CONFIG.MEMBER.radius
      );

      return {
        position,
        font: FONTS[i % FONTS.length],
        color: COLORS[i % COLORS.length],
        personality: PERSONALITIES[i % PERSONALITIES.length],
        geometryFn: GEOMETRIES[i % GEOMETRIES.length],
      };
    });
  }, []);
}

