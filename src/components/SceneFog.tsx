import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SCENE_CONFIG } from "../constants";

export default function SceneFog() {
  const { scene } = useThree();

  useEffect(() => {
    const fog = new THREE.Fog(
      SCENE_CONFIG.FOG.color,
      SCENE_CONFIG.FOG.near,
      SCENE_CONFIG.FOG.far
    );
    scene.fog = fog;

    return () => {
      scene.fog = null;
    };
  }, [scene]);

  return null;
}
