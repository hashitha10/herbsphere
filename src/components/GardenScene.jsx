import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

/* simple placeholder scene with clickable geometric markers.
   You can replace markers with GLTF model loads via <primitive object={gltf.scene} /> */
export default function GardenScene({ onPlantSelect, visiblePlants = [] }) {
  return (
    <div className="h-[520px] rounded-2xl overflow-hidden shadow-lg">
      <Canvas camera={{ position: [6, 4, 8], fov: 50 }}>
        <color attach="background" args={["#f0fff4"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 7]} intensity={1} />
        <Suspense fallback={<Html center>Loading...</Html>}>
          {/* ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#e9f7ee" />
          </mesh>

          {/* Example clickable markers (replace with plant models) */}
          {visiblePlants.map((p, i) => (
            <mesh key={p.id} position={[i * 2 - 4, 0.5, (i % 3) * 1.8 - 2]}>
              <sphereGeometry args={[0.6, 32, 32]} />
              <meshStandardMaterial color="#16a34a" />
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  onPlantSelect(p.id);
                }}
                // invisible clickable collider
              />
            </mesh>
          ))}
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
