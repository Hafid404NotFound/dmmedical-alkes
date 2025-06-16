"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";

interface ProductImageViewerProps {
  imageFilenames: string[];
  basePath?: string; // e.g., "/gambar 360/"
}

export default function ProductImageViewer({
  imageFilenames,
  basePath = "/gambar 360/",
}: ProductImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for interaction state (unified for mouse and touch)
  const interactionStartXRef = useRef<number | null>(null);
  const imageIndexAtInteractionStartRef = useRef<number>(0);
  const isInteractingRef = useRef<boolean>(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const sensitivity = 15; // Adjusted for smoother movement

  const imagePaths = useMemo(() => {
    if (!imageFilenames) return [];
    return imageFilenames.map((name) => `${basePath}${name}`);
  }, [imageFilenames, basePath]);
  useEffect(() => {
    if (imagePaths && imagePaths.length > 0) {
      setIsLoading(true);
      // Preload all images for smoother experience
      const imagesToPreload = imagePaths.length;
      let loadedCount = 0;

      if (imagesToPreload === 0) {
        setCurrentIndex(0);
        setIsLoading(false);
        return;
      }

      // Preload images
      imagePaths.forEach((imagePath, index) => {
        const img = new window.Image();
        img.src = imagePath;
        const onFinishLoad = () => {
          loadedCount++;
          if (loadedCount === imagesToPreload) {
            setCurrentIndex(0);
            setIsLoading(false);
          }
        };
        img.onload = onFinishLoad;
        img.onerror = () => {
          console.error("Error preloading image:", imagePath);
          onFinishLoad();
        };
      });
    }
  }, [imagePaths]);

  // --- Unified Interaction Start ---
  const handleInteractionStart = (clientX: number) => {
    if (viewerRef.current) {
      viewerRef.current.style.cursor = "grabbing";
    }
    isInteractingRef.current = true;
    interactionStartXRef.current = clientX;
    imageIndexAtInteractionStartRef.current = currentIndex;
    document.body.style.userSelect = "none";
  };
  // --- Unified Interaction Move ---
  const handleInteractionMove = (clientX: number) => {
    if (
      !isInteractingRef.current ||
      interactionStartXRef.current === null ||
      imagePaths.length === 0
    )
      return;

    // Throttle updates for smoother performance
    const now = Date.now();
    if (now - lastUpdateTimeRef.current < 16) return; // ~60fps
    lastUpdateTimeRef.current = now;

    const dx = clientX - interactionStartXRef.current;
    const imageChange = Math.round(dx / sensitivity);

    if (imageChange !== 0) {
      let newIndex = imageIndexAtInteractionStartRef.current - imageChange;
      newIndex =
        ((newIndex % imagePaths.length) + imagePaths.length) %
        imagePaths.length;

      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        // Don't reset the interaction start position to maintain continuous movement
      }
    }
  };

  // --- Unified Interaction End ---
  const handleInteractionEnd = () => {
    if (viewerRef.current) {
      viewerRef.current.style.cursor = "grab";
    }
    isInteractingRef.current = false;
    interactionStartXRef.current = null;
    document.body.style.userSelect = "";
  };

  // --- Mouse Event Handlers ---
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleInteractionStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isInteractingRef.current) {
      handleInteractionMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (isInteractingRef.current) {
      handleInteractionEnd();
    }
  };

  const handleMouseLeave = () => {
    if (isInteractingRef.current) {
      handleInteractionEnd();
    }
    if (viewerRef.current) {
      viewerRef.current.style.cursor = "grab";
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewerRef.current) {
      viewerRef.current.style.cursor = "grab";
    }
  };

  // --- Touch Event Handlers ---
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    handleInteractionStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    handleInteractionMove(e.touches[0].clientX);
  };

  const handleTouchEndOrCancel = () => {
    handleInteractionEnd();
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, []);
  if (!imagePaths || imagePaths.length === 0) {
    return (
      <div className="w-full aspect-[16/9] sm:aspect-[4/3] lg:aspect-[3/2] xl:aspect-[16/10] 2xl:aspect-[16/9] flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">No images available.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full aspect-[16/9] sm:aspect-[4/3] lg:aspect-[3/2] xl:aspect-[16/10] 2xl:aspect-[16/9] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  const currentImageSrc = imagePaths[currentIndex];
  const rotationAngle =
    imagePaths.length > 0 ? (currentIndex / imagePaths.length) * 360 : 0;
  return (
    <div
      ref={viewerRef}
      className="relative w-full aspect-[16/9] sm:aspect-[4/3] lg:aspect-[3/2] xl:aspect-[16/10] 2xl:aspect-[16/9] overflow-hidden rounded-lg shadow-lg group select-none touch-pan-y"
      style={{ cursor: "grab" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEndOrCancel}
      onTouchCancel={handleTouchEndOrCancel}
    >
      {" "}
      {currentImageSrc && (
        <div className="relative w-full h-full">
          <Image
            key={`360-image-${currentIndex}`}
            src={currentImageSrc}
            alt={`View 360 - Image ${currentIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "contain" }}
            className="pointer-events-none select-none"
            priority={currentIndex < 5}
            draggable={false}
            unoptimized={false}
          />
        </div>
      )}{" "}
      {/* 360 Icon */}
      {imagePaths.length > 1 && (
        <div className="absolute bottom-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: `rotate(${rotationAngle}deg)` }}
            className="text-white/80 transition-transform duration-100 ease-linear will-change-transform"
          >
            {" "}
            {/* Main rotating arrow circle */}
            <path
              d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 10.3431 3.49657 8.80134 4.36803 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Arrow head */}
            <path
              d="M4.36803 7.5L2.5 6M4.36803 7.5L6 5.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* 360 text */}
            <text
              x="12"
              y="9"
              textAnchor="middle"
              className="text-[6px] font-bold fill-current"
              style={{ fontSize: "6px", fontFamily: "system-ui, sans-serif" }}
            >
              360
            </text>
            {/* Degree symbol */}
            <circle cx="15" cy="15" r="0.8" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  );
}
