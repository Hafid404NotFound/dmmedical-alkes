"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  MdPlayCircle,
  MdPause,
  MdSkipNext,
  MdSkipPrevious,
  MdRotateRight,
} from "react-icons/md";

interface ImageViewer360Props {
  images: string[];
  productName?: string;
  autoRotate?: boolean;
  rotationSpeed?: number; // milliseconds between frames
}

export default function ImageViewer360({
  images,
  productName = "Product",
  autoRotate = false,
  rotationSpeed = 150, // lebih cepat untuk efek yang lebih smooth
}: ImageViewer360Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartIndex, setDragStartIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto rotation effect
  useEffect(() => {
    if (isAutoRotating && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, rotationSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoRotating, images.length, rotationSpeed]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (images.length <= 1) return;

    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartIndex(currentIndex);
    setIsAutoRotating(false);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || images.length <= 1) return;

    const deltaX = e.clientX - dragStartX;
    const sensitivity = 5; // lebih sensitive untuk putaran yang lebih smooth
    const frameDelta = Math.floor(deltaX / sensitivity);

    // Putaran tanpa batas - bisa terus berputar
    let newIndex = (dragStartIndex - frameDelta) % images.length;
    if (newIndex < 0) newIndex += images.length;

    setCurrentIndex(newIndex);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (images.length <= 1) return;

    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragStartIndex(currentIndex);
    setIsAutoRotating(false);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || images.length <= 1) return;

    const deltaX = e.touches[0].clientX - dragStartX;
    const sensitivity = 5; // lebih sensitive untuk mobile
    const frameDelta = Math.floor(deltaX / sensitivity);

    // Putaran tanpa batas - bisa terus berputar
    let newIndex = (dragStartIndex - frameDelta) % images.length;
    if (newIndex < 0) newIndex += images.length;

    setCurrentIndex(newIndex);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const nextFrame = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoRotating(false);
  };

  const prevFrame = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoRotating(false);
  };

  const toggleAutoRotate = () => {
    setIsAutoRotating((prev) => !prev);
  };

  const quickRotate = () => {
    setIsAutoRotating(false);
    let count = 0;
    const quickInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      count++;
      if (count >= images.length) {
        clearInterval(quickInterval);
      }
    }, 100);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MdRotateRight className="text-6xl mx-auto mb-4 opacity-50" />
          <p>Tidak ada gambar 360° tersedia</p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full">
      {/* Main 360° Viewer */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-lg cursor-grab active:cursor-grabbing mb-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <Image
          src={images[currentIndex]}
          alt={`${productName} - 360° view`}
          fill
          className="object-contain transition-none"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
          priority
          draggable={false}
        />{" "}
        {/* Overlay Info */}
        <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          360° View
        </div>
        {/* Rotation Indicator */}
        {isAutoRotating && (
          <div className="absolute bottom-4 left-4 bg-primary-main/80 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
            <MdRotateRight className="animate-spin" />
            Auto Rotating
          </div>
        )}
        {/* Drag Instruction */}
        {!isDragging && !isAutoRotating && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
            Drag untuk memutar 360°
          </div>
        )}
      </div>
      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={prevFrame}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          title="Frame sebelumnya"
          disabled={images.length <= 1}
        >
          <MdSkipPrevious className="text-lg" />
        </button>
        <button
          onClick={toggleAutoRotate}
          className={`p-2 rounded-full transition-colors ${
            isAutoRotating
              ? "bg-primary-main text-white hover:bg-primary-main/90"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          title={isAutoRotating ? "Stop auto rotate" : "Start auto rotate"}
          disabled={images.length <= 1}
        >
          {isAutoRotating ? (
            <MdPause className="text-lg" />
          ) : (
            <MdPlayCircle className="text-lg" />
          )}
        </button>
        <button
          onClick={nextFrame}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          title="Frame selanjutnya"
          disabled={images.length <= 1}
        >
          <MdSkipNext className="text-lg" />
        </button>{" "}
        <button
          onClick={quickRotate}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          title="Putar cepat satu kali"
          disabled={images.length <= 1}
        >
          <MdRotateRight className="text-lg" />
        </button>
      </div>
    </div>
  );
}
