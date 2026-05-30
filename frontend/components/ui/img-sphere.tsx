"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

export interface Position3D { x: number; y: number; z: number; }
export interface SphericalPosition { theta: number; phi: number; radius: number; }
export interface WorldPosition extends Position3D { scale: number; zIndex: number; isVisible: boolean; fadeOpacity: number; originalIndex: number; }
export interface ImageData { id: string; src: string; alt: string; title?: string; description?: string; label?: string; labelColor?: string; }
export interface SphereImageGridProps {
  images?: ImageData[];
  containerSize?: number;
  sphereRadius?: number;
  dragSensitivity?: number;
  momentumDecay?: number;
  maxRotationSpeed?: number;
  baseImageScale?: number;
  hoverScale?: number;
  perspective?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  className?: string;
}

const SPHERE_MATH = {
  degreesToRadians: (d: number) => d * (Math.PI / 180),
  normalizeAngle: (a: number) => { while (a > 180) a -= 360; while (a < -180) a += 360; return a; }
};

const SphereImageGrid: React.FC<SphereImageGridProps> = ({
  images = [], containerSize = 400, sphereRadius = 200,
  dragSensitivity = 0.5, momentumDecay = 0.95, maxRotationSpeed = 5,
  baseImageScale = 0.12, hoverScale = 1.2, perspective = 1000,
  autoRotate = false, autoRotateSpeed = 0.3, className = ''
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [rotation, setRotation] = useState({ x: 15, y: 15, z: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [imagePositions, setImagePositions] = useState<SphericalPosition[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);

  const actualSphereRadius = sphereRadius || containerSize * 0.5;
  const baseImageSize = containerSize * baseImageScale;

  const generateSpherePositions = useCallback((): SphericalPosition[] => {
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = 2 * Math.PI / goldenRatio;
    return images.map((_, i) => {
      const t = i / images.length;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;
      let phi = inclination * (180 / Math.PI);
      let theta = (azimuth * (180 / Math.PI)) % 360;
      const poleBonus = Math.pow(Math.abs(phi - 90) / 90, 0.6) * 35;
      phi = phi < 90 ? Math.max(5, phi - poleBonus) : Math.min(175, phi + poleBonus);
      phi = 15 + (phi / 180) * 150;
      theta = (theta + (Math.random() - 0.5) * 20) % 360;
      phi = Math.max(0, Math.min(180, phi + (Math.random() - 0.5) * 10));
      return { theta, phi, radius: actualSphereRadius };
    });
  }, [images.length, actualSphereRadius]);

  const calculateWorldPositions = useCallback(() => {
    return imagePositions.map((pos, index) => {
      const thetaRad = SPHERE_MATH.degreesToRadians(pos.theta);
      const phiRad = SPHERE_MATH.degreesToRadians(pos.phi);
      const rotXRad = SPHERE_MATH.degreesToRadians(rotation.x);
      const rotYRad = SPHERE_MATH.degreesToRadians(rotation.y);
      let x = pos.radius * Math.sin(phiRad) * Math.cos(thetaRad);
      let y = pos.radius * Math.cos(phiRad);
      let z = pos.radius * Math.sin(phiRad) * Math.sin(thetaRad);
      const x1 = x * Math.cos(rotYRad) + z * Math.sin(rotYRad);
      const z1 = -x * Math.sin(rotYRad) + z * Math.cos(rotYRad);
      x = x1; z = z1;
      const y2 = y * Math.cos(rotXRad) - z * Math.sin(rotXRad);
      const z2 = y * Math.sin(rotXRad) + z * Math.cos(rotXRad);
      y = y2; z = z2;
      const isVisible = z > -30;
      const fadeOpacity = z <= -10 ? Math.max(0, (z - (-30)) / (-10 - (-30))) : 1;
      const distanceFromCenter = Math.sqrt(x * x + y * y);
      const distanceRatio = Math.min(distanceFromCenter / actualSphereRadius, 1);
      const centerScale = Math.max(0.3, 1 - distanceRatio * 0.7);
      const depthScale = (z + actualSphereRadius) / (2 * actualSphereRadius);
      const scale = centerScale * Math.max(0.5, 0.8 + depthScale * 0.3);
      return { x, y, z, scale, zIndex: Math.round(1000 + z), isVisible, fadeOpacity, originalIndex: index };
    });
  }, [imagePositions, rotation, actualSphereRadius]);

  const clampSpeed = useCallback((s: number) => Math.max(-maxRotationSpeed, Math.min(maxRotationSpeed, s)), [maxRotationSpeed]);

  const updateMomentum = useCallback(() => {
    if (isDragging) return;
    setVelocity(prev => {
      const nv = { x: prev.x * momentumDecay, y: prev.y * momentumDecay };
      if (!autoRotate && Math.abs(nv.x) < 0.01 && Math.abs(nv.y) < 0.01) return { x: 0, y: 0 };
      return nv;
    });
    setRotation(prev => ({
      x: SPHERE_MATH.normalizeAngle(prev.x + clampSpeed(velocity.x)),
      y: SPHERE_MATH.normalizeAngle(prev.y + (autoRotate ? autoRotateSpeed : 0) + clampSpeed(velocity.y)),
      z: prev.z
    }));
  }, [isDragging, momentumDecay, velocity, clampSpeed, autoRotate, autoRotateSpeed]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => { e.preventDefault(); setIsDragging(true); setVelocity({ x: 0, y: 0 }); lastMousePos.current = { x: e.clientX, y: e.clientY }; }, []);
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setRotation(prev => ({ x: SPHERE_MATH.normalizeAngle(prev.x + clampSpeed(-dy * dragSensitivity)), y: SPHERE_MATH.normalizeAngle(prev.y + clampSpeed(dx * dragSensitivity)), z: prev.z }));
    setVelocity({ x: clampSpeed(-dy * dragSensitivity), y: clampSpeed(dx * dragSensitivity) });
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, [isDragging, dragSensitivity, clampSpeed]);
  const handleMouseUp = useCallback(() => setIsDragging(false), []);
  const handleTouchStart = useCallback((e: React.TouchEvent) => { e.preventDefault(); const t = e.touches[0]; setIsDragging(true); setVelocity({ x: 0, y: 0 }); lastMousePos.current = { x: t.clientX, y: t.clientY }; }, []);
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return; e.preventDefault();
    const t = e.touches[0];
    const dx = t.clientX - lastMousePos.current.x; const dy = t.clientY - lastMousePos.current.y;
    setRotation(prev => ({ x: SPHERE_MATH.normalizeAngle(prev.x + clampSpeed(-dy * dragSensitivity)), y: SPHERE_MATH.normalizeAngle(prev.y + clampSpeed(dx * dragSensitivity)), z: prev.z }));
    setVelocity({ x: clampSpeed(-dy * dragSensitivity), y: clampSpeed(dx * dragSensitivity) });
    lastMousePos.current = { x: t.clientX, y: t.clientY };
  }, [isDragging, dragSensitivity, clampSpeed]);
  const handleTouchEnd = useCallback(() => setIsDragging(false), []);

  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => { setImagePositions(generateSpherePositions()); }, [generateSpherePositions]);
  useEffect(() => {
    if (!isMounted) return;
    const animate = () => { updateMomentum(); animationFrame.current = requestAnimationFrame(animate); };
    animationFrame.current = requestAnimationFrame(animate);
    return () => { if (animationFrame.current) cancelAnimationFrame(animationFrame.current); };
  }, [isMounted, updateMomentum]);
  useEffect(() => {
    if (!isMounted) return;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMounted, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const worldPositions = calculateWorldPositions();

  if (!isMounted) return <div className="bg-gray-100 rounded-lg animate-pulse" style={{ width: containerSize, height: containerSize }} />;
  if (!images.length) return null;

  return (
    <>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes scaleIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
      <div ref={containerRef} className={`relative select-none cursor-grab active:cursor-grabbing ${className}`}
        style={{ width: containerSize, height: containerSize, perspective: `${perspective}px` }}
        onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>
        <div className="relative w-full h-full" style={{ zIndex: 10 }}>
          {images.map((image, index) => {
            const position = worldPositions[index];
            if (!position || !position.isVisible) return null;
            const imageSize = baseImageSize * position.scale;
            const isHovered = hoveredIndex === index;
            return (
              <div key={image.id} className="absolute cursor-pointer select-none transition-transform duration-200"
                style={{ width: `${imageSize * 1.4}px`, height: `${imageSize * 1.8}px`, left: `${containerSize/2 + position.x}px`, top: `${containerSize/2 + position.y}px`, opacity: position.fadeOpacity, transform: `translate(-50%, -50%) scale(${isHovered ? Math.min(1.2, hoverScale / position.scale) : 1})`, zIndex: position.zIndex }}
                onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} onClick={() => setSelectedImage(image)}>
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg border-2 border-white/20">
                  <img src={image.src} alt={image.alt} className="w-full h-full object-cover" draggable={false} />
                  {isHovered && (
                    <div className="absolute inset-0 flex items-center justify-center"
                      style={{ background: "rgba(0,0,0,0.35)" }}>
                      <span style={{ fontSize: Math.max(8, Math.min(13, imageSize * 0.14)) + "px" }}
                        className="text-white font-bold bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full whitespace-nowrap">
                        Виж профил
                      </span>
                    </div>
                  )}
                  {image.label && imageSize > 30 && (
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1.5 pt-4"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}>
                      <span style={{
                        fontSize: Math.max(7, Math.min(11, imageSize * 0.13)) + "px",
                        background: image.labelColor ?? "#1083BD",
                        lineHeight: 1,
                      }} className="text-white font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        {image.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30" onClick={() => setSelectedImage(null)} style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div className="bg-white rounded-xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()} style={{ animation: 'scaleIn 0.3s ease-out' }}>
            <div className="relative aspect-square">
              <img src={selectedImage.src} alt={selectedImage.alt} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full text-white flex items-center justify-center hover:bg-black/70 transition-all">
                <X size={16} />
              </button>
            </div>
            <div className="p-5">
              {selectedImage.title && <h3 className="text-lg font-bold text-gray-900 mb-1">{selectedImage.title}</h3>}
              {selectedImage.description && <p className="text-gray-500 text-sm mb-4">{selectedImage.description}</p>}
              <button className="w-full flex items-center justify-center gap-2 bg-[#1083BD] hover:bg-[#0d6fa0] text-white font-bold py-3 rounded-xl transition-colors text-sm">
                📅 Запази час
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SphereImageGrid;
