'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function SplashScreen() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4B0082, // Deep Indigo
      emissive: 0x4B0082,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.3,
    });
    const knot = new THREE.Mesh(geometry, material);
    scene.add(knot);

    const pointLight1 = new THREE.PointLight(0xff00ff, 50, 100); // Fuchsia
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x4B0082, 50, 100); // Deep Indigo
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      knot.rotation.x += 0.005;
      knot.rotation.y += 0.005;

      pointLight1.position.x = Math.sin(Date.now() * 0.001) * 5;
      pointLight1.position.y = Math.cos(Date.now() * 0.001) * 5;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
