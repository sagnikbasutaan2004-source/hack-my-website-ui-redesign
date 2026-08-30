"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeAmbientCanvasProps {
  className?: string;
  particleColor1?: string;
  particleColor2?: string;
}

export function ThreeAmbientCanvas({
  className = "",
  particleColor1 = "#10b981", // Emerald
  particleColor2 = "#f59e0b", // Amber
}: ThreeAmbientCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 40;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Floating Particle Dust System (Emerald & Amber Embers)
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(particleColor1);
    const color2 = new THREE.Color(particleColor2);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      // Mix between emerald and amber
      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle texture point material
    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 4. Background Wireframe Geodesic Spheres (As seen in reference design)
    const sphereGeo1 = new THREE.IcosahedronGeometry(12, 2);
    const wireframeMat1 = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const sphereMesh1 = new THREE.Mesh(sphereGeo1, wireframeMat1);
    sphereMesh1.position.set(-28, 8, -20);
    scene.add(sphereMesh1);

    const sphereGeo2 = new THREE.IcosahedronGeometry(8, 1);
    const wireframeMat2 = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const sphereMesh2 = new THREE.Mesh(sphereGeo2, wireframeMat2);
    sphereMesh2.position.set(30, 14, -15);
    scene.add(sphereMesh2);

    // 5. Parallax Mouse Tracker
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (event.clientX - windowHalfX) * 0.005;
      mouseY = (event.clientY - windowHalfY) * 0.005;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 6. Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // 7. Animation Frame Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Slow organic rotation
      particles.rotation.y += 0.0006;
      particles.rotation.x += 0.0003;

      sphereMesh1.rotation.x += 0.002;
      sphereMesh1.rotation.y += 0.003;

      sphereMesh2.rotation.x -= 0.003;
      sphereMesh2.rotation.y += 0.002;

      // Parallax effect on camera
      camera.position.x = targetX * 12;
      camera.position.y = -targetY * 12;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      geometry.dispose();
      material.dispose();
      sphereGeo1.dispose();
      wireframeMat1.dispose();
      sphereGeo2.dispose();
      wireframeMat2.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [particleColor1, particleColor2]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
    />
  );
}
