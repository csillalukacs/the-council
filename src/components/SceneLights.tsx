import { SCENE_CONFIG } from "../constants";

export default function SceneLights() {
  return (
    <>
      <ambientLight intensity={SCENE_CONFIG.LIGHTING.ambientIntensity} />
      <pointLight
        position={SCENE_CONFIG.LIGHTING.pointLight.position}
        intensity={SCENE_CONFIG.LIGHTING.pointLight.intensity}
        color={SCENE_CONFIG.LIGHTING.pointLight.color}
      />
      <directionalLight
        position={SCENE_CONFIG.LIGHTING.directionalLight.position}
        intensity={SCENE_CONFIG.LIGHTING.directionalLight.intensity}
        color={SCENE_CONFIG.LIGHTING.directionalLight.color}
      />
    </>
  );
}
