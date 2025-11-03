import { useMemo } from "react";
import { SCENE_CONFIG } from "../constants";

export default function StarField() {
  const stars = useMemo(() => {
    const starsArray = [];
    for (let i = 0; i < SCENE_CONFIG.STARS.count; i++) {
      const radius = SCENE_CONFIG.STARS.radius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      starsArray.push(
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial
            color="#66ccff"
            emissive="#66ccff"
            emissiveIntensity={0.8}
          />
        </mesh>
      );
    }
    return starsArray;
  }, []);

  return <>{stars}</>;
}
