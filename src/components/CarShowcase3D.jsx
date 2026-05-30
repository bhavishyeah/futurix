import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  OrbitControls,
  ScrollControls,
  useGLTF,
  useScroll,
} from "@react-three/drei";
import { Suspense, useRef } from "react";

function CarModel() {
  const group = useRef();
  const { scene } = useGLTF("/models/nissangtr.glb");
  const scroll = useScroll();

  useFrame(() => {
    const progress = scroll.offset;
    if (group.current) {
      group.current.rotation.y = progress * Math.PI * 2;
      group.current.position.y = -0.2 + progress * 0.2;
    }
  });

  return (
    <group ref={group} position={[0, -0.5, 0]} scale={1.2}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/nissangtr.glb");

export default function CarShowcase3D() {
  return (
    <section style={{ width: "100%", height: "300vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
        }}
      >
        <Canvas
          camera={{ position: [0, 1.5, 5], fov: 35 }}
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 5, 5]} intensity={2} />
            <directionalLight position={[-5, 3, -2]} intensity={1} />

            <Environment preset="city" />
            <ScrollControls pages={3} damping={0.15}>
              <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.12}>
                <CarModel />
              </Float>
            </ScrollControls>

            <OrbitControls enableZoom={false} enablePan={false} />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}