"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const CustomMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#C9A96E") }, // Gold
    uColor2: { value: new THREE.Color("#2A241A") }, // Dark bronze shadow
  },
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vPosition = position;
      float noiseFreq = 0.4;
      float noiseAmp = 0.3;
      vec3 noisePos = vec3(position.x * noiseFreq + uTime * 0.2, position.y * noiseFreq + uTime * 0.3, position.z * noiseFreq);
      vec3 newPos = position;
      float displacement = snoise(noisePos) * noiseAmp;
      newPos += normal * displacement;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      float mixFactor = (vPosition.y + 1.0) * 0.5 + sin(uTime * 0.5 + vPosition.x) * 0.2;
      vec3 finalColor = mix(uColor1, uColor2, clamp(mixFactor, 0.0, 1.0));
      float scanline = sin(vUv.y * 100.0 + uTime * 5.0) * 0.04;
      float alpha = smoothstep(-1.0, 1.0, vPosition.z) * 0.6 + 0.1;
      gl_FragColor = vec4(finalColor + scanline, alpha);
    }
  `,
  transparent: true,
  wireframe: true,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

function GeometricNexus() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const scrollData = useRef({ y: 0, targetY: 0 });
  const mouseData = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;
    materialRef.current.uniforms.uTime.value += delta;
    const { pointer } = state;
    mouseData.current.targetX = pointer.x;
    mouseData.current.targetY = pointer.y;
    mouseData.current.x += (mouseData.current.targetX - mouseData.current.x) * 0.05;
    mouseData.current.y += (mouseData.current.targetY - mouseData.current.y) * 0.05;
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
    scrollData.current.targetY = scrollPercent;
    scrollData.current.y += (scrollData.current.targetY - scrollData.current.y) * 0.05;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1 + mouseData.current.x * 0.5 + scrollData.current.y * Math.PI * 2;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.05 - mouseData.current.y * 0.5 + scrollData.current.y * Math.PI;
    const baseScale = 0.6;
    const scaleBreath = baseScale + Math.sin(state.clock.elapsedTime) * 0.05;
    meshRef.current.scale.set(scaleBreath, scaleBreath, scaleBreath);
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.5, 0.4, 256, 32]} />
      <primitive object={CustomMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particlesCount = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particlesCount} 
          array={positions} 
          itemSize={3} 
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#C9A96E" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

export default function ThreeCanvas() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <GeometricNexus />
        <ParticleField />
      </Canvas>
    </div>
  );
}
