// Geometry functions for 3D shapes
export const GEOMETRIES = [
  (size: number) => <boxGeometry args={[size, size, size]} />,
  (size: number) => <sphereGeometry args={[size, 32, 32]} />,
  (size: number) => <tetrahedronGeometry args={[size]} />,
  (size: number) => <octahedronGeometry args={[size]} />,
  (size: number) => <dodecahedronGeometry args={[size]} />,
  (size: number) => <icosahedronGeometry args={[size]} />,
  (size: number) => <torusGeometry args={[size, size / 2, 16, 64]}/>,
] as const;
