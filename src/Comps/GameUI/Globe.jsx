import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
// import { SphereBufferGeometry } from 'three';

const Globe = () => {
  const globeRef = useRef();

  // Animation loop
  const animateGlobe = () => {
    const globe = globeRef.current;
    if (globe) {
      globe.rotation.y += 0.001;
    }
  };

  return (
    <div className="globe-wrapper">

      <Canvas
        camera={{ position: [0, 0, 200] }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000');
        }}
        onBeforeRender={animateGlobe}
      >
        <ambientLight intensity={0.5} />
        <spotLight intensity={0.8} position={[300, 300, 400]} />

        <Stars />

        {/* <mesh ref={globeRef}>
          {/* <sphereBufferGeometry args={[1, 64, 64]} />
          <hemisphereLight intensity={0.15} groundColor="black" />
          <meshStandardMaterial color="#4488ee" />
        </mesh> */}
        <Box position={[0, 0, 0]} />

        <OrbitControls />
      </Canvas>
    </div>
  );
};



export default Globe;

function Box(props) {
   const mesh = useRef();
   useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));
   return (
      <mesh {...props} ref={mesh}>
         <boxGeometry args={[50, 50, 50]} />
         <meshStandardMaterial color={"#f1f1f1"} />
      </mesh>
   );
}