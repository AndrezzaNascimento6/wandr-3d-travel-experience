import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Planet() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => { if (mesh.current) mesh.current.rotation.y += delta * 0.065; });
  return <group rotation={[0.22, 0, -0.18]}>
    <Sphere ref={mesh} args={[1.65, 64, 64]}>
      <meshStandardMaterial color="#466bd9" roughness={0.7} metalness={0.05} />
      <meshStandardMaterial attach="material" color="#466bd9" />
      <meshStandardMaterial attach="material" color="#466bd9" />
    </Sphere>
    <mesh rotation={[0.3,0,0]}><torusGeometry args={[2.06, 0.025, 10, 140]}/><meshBasicMaterial color="#fdf0b7"/></mesh>
    <mesh rotation={[-0.7,0.4,0.3]}><torusGeometry args={[2.17, 0.012, 8, 140]}/><meshBasicMaterial color="#fc9b70"/></mesh>
  </group>;
}
export default function Globe() {
 return <Canvas camera={{position:[0,0,6],fov:42}} dpr={[1,1.7]} gl={{alpha:true}} style={{touchAction:"pan-y"}}>
   <ambientLight intensity={2}/><directionalLight position={[3,5,5]} intensity={2.8}/>
   <Stars radius={40} depth={20} count={170} factor={2} saturation={0} fade speed={0.5}/>
   <Planet/><OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.45}/>
 </Canvas>;
}