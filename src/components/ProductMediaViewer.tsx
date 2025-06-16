"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ImageViewer360 from "./ImageViewer360";
import {
  MdPhotoLibrary,
  MdRotateRight,
  MdNavigateBefore,
  MdNavigateNext,
  MdFullscreen,
} from "react-icons/md";

interface ProductMediaViewerProps {
  images360?: string[];
  mainImageUrl?: string;
  galleryImages?: string[];
  productName?: string;
}

export default function ProductMediaViewer({
  images360 = [],
  mainImageUrl,
  galleryImages = [],
  productName = "Product",
}: ProductMediaViewerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Combine main image with gallery images
  const allImages = mainImageUrl
    ? [mainImageUrl, ...galleryImages.filter((img) => img !== mainImageUrl)]
    : galleryImages;

  const has360Images = images360.length > 0;
  const hasGalleryImages = allImages.length > 0;

  // Smart default: 360° if available, otherwise gallery
  const getDefaultTab = (): "360" | "gallery" => {
    if (has360Images) return "360";
    if (hasGalleryImages) return "gallery";
    return "360"; // fallback
  };

  const [activeTab, setActiveTab] = useState<"360" | "gallery">(
    getDefaultTab()
  );

  // Update active tab when available media changes
  useEffect(() => {
    const newDefaultTab = getDefaultTab();
    if (
      (activeTab === "360" && !has360Images) ||
      (activeTab === "gallery" && !hasGalleryImages)
    ) {
      setActiveTab(newDefaultTab);
    }
  }, [has360Images, hasGalleryImages]);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreen && activeTab === "gallery") {
        switch (event.key) {
          case "Escape":
            setIsFullscreen(false);
            break;
          case "ArrowLeft":
            event.preventDefault();
            prevImage();
            break;
          case "ArrowRight":
            event.preventDefault();
            nextImage();
            break;
        }
      }
    };

    // Add event listener when component mounts or fullscreen state changes
    if (isFullscreen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when in fullscreen
      document.body.style.overflow = "hidden";
    }

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isFullscreen, activeTab, allImages.length]); // Dependencies

  if (!has360Images && !hasGalleryImages) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MdPhotoLibrary className="text-6xl mx-auto mb-4 opacity-50" />
          <p>Tidak ada media tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {" "}
      {/* Tab Switcher */}
      {has360Images && hasGalleryImages && (
        <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("360")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "360"
                ? "bg-white shadow-sm text-primary-main"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <MdRotateRight className="text-lg" />
            <span className="text-sm font-medium">360° View</span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "gallery"
                ? "bg-white shadow-sm text-primary-main"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <MdPhotoLibrary className="text-lg" />
            <span className="text-sm font-medium">
              Foto ({allImages.length})
            </span>
          </button>
        </div>
      )}{" "}
      {/* Main Media Display */}
      <div className="relative w-full overflow-hidden bg-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
        {activeTab === "360" && has360Images ? (
          <div className="p-6">
            <ImageViewer360
              images={images360}
              productName={productName}
              autoRotate={false}
            />
          </div>
        ) : activeTab === "gallery" && hasGalleryImages ? (
          <div className="relative w-full aspect-video bg-gray-50 flex items-center justify-center p-6">
            {allImages.length > 0 && (
              <div className="relative flex items-center justify-center w-full h-full">
                <Image
                  src={allImages[currentImageIndex]}
                  alt={`${productName} - Image ${currentImageIndex + 1}`}
                  width={800}
                  height={600}
                  className="object-contain cursor-pointer rounded-lg transition-transform duration-200 hover:scale-[1.02]"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "auto",
                    height: "auto",
                  }}
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  onClick={() => setIsFullscreen(true)}
                />
              </div>
            )}

            {/* Navigation Arrows for Gallery */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm z-10"
                  aria-label="Previous image"
                >
                  <MdNavigateBefore className="text-xl" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm z-10"
                  aria-label="Next image"
                >
                  <MdNavigateNext className="text-xl" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {currentImageIndex + 1} / {allImages.length}
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
                  aria-label="View fullscreen"
                >
                  <MdFullscreen className="text-lg" />
                </button>
              </>
            )}

            {/* Tab Indicator for Single Tab */}
            {(!has360Images || !hasGalleryImages) && (
              <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
                <MdPhotoLibrary className="text-sm" />
                Foto Produk
              </div>
            )}
          </div>
        ) : (
          // Fallback jika tidak ada gallery maupun 360°
          <div className="relative w-full aspect-video bg-gray-50 flex items-center justify-center p-6">
            <div className="text-center text-gray-500">
              <MdPhotoLibrary className="text-6xl mx-auto mb-4 opacity-50" />
              <p>Tidak ada media produk tersedia</p>
            </div>
          </div>
        )}
      </div>{" "}
      {/* Thumbnail Gallery - hanya untuk gallery tab */}
      {activeTab === "gallery" && allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentImageIndex
                  ? "border-primary-main shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
                sizes="80px"
              />

              {index === currentImageIndex && (
                <div className="absolute inset-0 bg-primary-main/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary-main rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      {/* Fullscreen Modal - hanya untuk gallery */}
      {isFullscreen && activeTab === "gallery" && allImages.length > 0 && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 z-10"
              aria-label="Close fullscreen"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Fullscreen Image */}
            <div className="relative flex items-center justify-center max-w-full max-h-full p-8">
              <Image
                src={allImages[currentImageIndex]}
                alt={`${productName} - Image ${currentImageIndex + 1}`}
                width={1200}
                height={800}
                className="object-contain rounded-lg shadow-2xl"
                style={{
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  width: "auto",
                  height: "auto",
                }}
                sizes="90vw"
              />
            </div>

            {/* Navigation in Fullscreen */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200"
                  aria-label="Previous image"
                >
                  <MdNavigateBefore className="text-2xl" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200"
                  aria-label="Next image"
                >
                  <MdNavigateNext className="text-2xl" />
                </button>

                {/* Image Counter in Fullscreen */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                  {currentImageIndex + 1} / {allImages.length}
                </div>

                {/* Keyboard Hint */}
                <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-2 rounded-full text-xs backdrop-blur-sm">
                  ← → untuk navigasi • ESC untuk tutup
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
