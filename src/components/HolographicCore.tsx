import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { playHoloClick } from '../utils/soundEffects';

interface HolographicCoreProps {
  colorScheme?: 'cyan' | 'blue' | 'purple' | 'emerald' | 'amber';
  interactive?: boolean;
  className?: string;
  onCoreClick?: () => void;
}

const COLOR_MAP = {
  cyan: {
    primary: 0x06b6d4,
    secondary: 0x0284c7,
    ambient: 0x083344,
    points: 0x38bdf8,
    glow: 'rgba(6, 182, 212, 0.4)',
  },
  blue: {
    primary: 0x3b82f6,
    secondary: 0x1d4ed8,
    ambient: 0x172554,
    points: 0x60a5fa,
    glow: 'rgba(59, 130, 246, 0.4)',
  },
  purple: {
    primary: 0xa855f7,
    secondary: 0x7e22ce,
    ambient: 0x3b0764,
    points: 0xc084fc,
    glow: 'rgba(168, 85, 247, 0.4)',
  },
  emerald: {
    primary: 0x10b981,
    secondary: 0x047857,
    ambient: 0x022c22,
    points: 0x34d399,
    glow: 'rgba(16, 185, 129, 0.4)',
  },
  amber: {
    primary: 0xf59e0b,
    secondary: 0xd97706,
    ambient: 0x451a03,
    points: 0xfcd34d,
    glow: 'rgba(245, 158, 11, 0.4)',
  },
};

export const HolographicCore: React.FC<HolographicCoreProps> = ({
  colorScheme = 'cyan',
  interactive = true,
  className = '',
  onCoreClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 600;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 8.5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const activeColor = COLOR_MAP[colorScheme];

    // Master Group for mouse lerp
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Central Quantum Core Wireframe Sphere
    const innerGeometry = new THREE.IcosahedronGeometry(1.6, 2);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: activeColor.primary,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
    coreGroup.add(innerCore);

    // 2. High-Density Nucleus Point Cloud
    const nucleusGeo = new THREE.BufferGeometry();
    const nucleusCount = 380;
    const nucleusPositions = new Float32Array(nucleusCount * 3);
    for (let i = 0; i < nucleusCount; i++) {
      const radius = 0.8 + Math.random() * 0.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      nucleusPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      nucleusPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      nucleusPositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    nucleusGeo.setAttribute('position', new THREE.BufferAttribute(nucleusPositions, 3));
    const nucleusMat = new THREE.PointsMaterial({
      color: activeColor.points,
      size: 0.05,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const nucleusCloud = new THREE.Points(nucleusGeo, nucleusMat);
    coreGroup.add(nucleusCloud);

    // 3. Orbiting Holographic Rings
    const ringGroup = new THREE.Group();
    coreGroup.add(ringGroup);

    const createHoloRing = (radius: number, tube: number, radialSegments: number, tubularSegments: number, rotX: number, rotY: number) => {
      const ringGeo = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
      const ringMat = new THREE.MeshBasicMaterial({
        color: activeColor.secondary,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = rotX;
      ringMesh.rotation.y = rotY;
      return ringMesh;
    };

    const ring1 = createHoloRing(2.4, 0.02, 16, 64, Math.PI / 3, 0);
    const ring2 = createHoloRing(3.1, 0.02, 16, 80, -Math.PI / 4, Math.PI / 6);
    const ring3 = createHoloRing(3.7, 0.025, 16, 96, Math.PI / 2.2, -Math.PI / 4);
    ringGroup.add(ring1);
    ringGroup.add(ring2);
    ringGroup.add(ring3);

    // 4. Ambient Holographic Data Dust / Swarm
    const particleCount = 1200;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: activeColor.primary,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particleSwarm = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSwarm);

    // Mouse Tracking for subtle parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.45;
      targetY = y * 0.45;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      coreGroup.rotation.y = elapsedTime * 0.25 + mouseX;
      coreGroup.rotation.x = mouseY * 0.5;

      // Rotation choreography
      innerCore.rotation.x = elapsedTime * 0.3;
      innerCore.rotation.z = elapsedTime * 0.2;

      ring1.rotation.z = elapsedTime * 0.4;
      ring2.rotation.z = -elapsedTime * 0.35;
      ring3.rotation.z = elapsedTime * 0.25;
      ring3.rotation.x = Math.PI / 2.2 + Math.sin(elapsedTime * 0.8) * 0.1;

      // Pulse scaling
      const pulse = 1 + Math.sin(elapsedTime * 2.2) * 0.04;
      innerCore.scale.set(pulse, pulse, pulse);
      nucleusCloud.scale.set(pulse, pulse, pulse);

      // Particle background slow drift
      particleSwarm.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Context loss safeguards
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animationFrameId);
    };
    const handleContextRestored = () => {
      animate();
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      cancelAnimationFrame(animationFrameId);
      innerGeometry.dispose();
      innerMaterial.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [colorScheme, interactive]);

  const handleClick = () => {
    setPulseCount((prev) => prev + 1);
    playHoloClick(1400, 0.08);
    if (onCoreClick) onCoreClick();
  };

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Interactive 3D Holographic AI Core. Click to ping system."
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-pointer" />

      {/* Holographic Concentric Ambient Rings Overlay (DOM) */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-[85%] h-[85%] rounded-full border border-cyan-500/10 animate-pulse-ring" />
        <div className="w-[65%] h-[65%] rounded-full border border-blue-500/20" />
        <div className="w-[45%] h-[45%] rounded-full border border-cyan-400/25 border-dashed animate-spin [animation-duration:45s]" />
      </div>

      {/* Floating Holographic Telemetry Marker */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-black/60 border border-cyan-500/30 backdrop-blur-md text-[11px] font-mono text-cyan-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>CORE ONLINE · 3.8 GHZ NEURAL FLUX</span>
        {pulseCount > 0 && <span className="text-cyan-400">· PINGS: {pulseCount}</span>}
      </div>
    </div>
  );
};
