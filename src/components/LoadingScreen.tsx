"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadComplete?: () => void;
}

export default function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    // Tampilkan loading selama 3 detik
    const timer = setTimeout(() => {
      setIsCompleting(true);
      setTimeout(() => {
        onLoadComplete?.();
      }, 500);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onLoadComplete]);
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-main via-primary-main to-secondary-main transition-opacity duration-500 ${
        isCompleting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Medical cross patterns */}
        <div className="absolute top-10 left-10 w-8 h-8 opacity-10">
          <div className="w-full h-1 bg-white absolute top-1/2 -translate-y-1/2"></div>
          <div className="h-full w-1 bg-white absolute left-1/2 -translate-x-1/2"></div>
        </div>
        <div className="absolute top-20 right-20 w-6 h-6 opacity-10">
          <div className="w-full h-1 bg-white absolute top-1/2 -translate-y-1/2"></div>
          <div className="h-full w-1 bg-white absolute left-1/2 -translate-x-1/2"></div>
        </div>
        <div className="absolute bottom-20 left-20 w-10 h-10 opacity-10">
          <div className="w-full h-1 bg-white absolute top-1/2 -translate-y-1/2"></div>
          <div className="h-full w-1 bg-white absolute left-1/2 -translate-x-1/2"></div>
        </div>
        <div className="absolute bottom-10 right-10 w-4 h-4 opacity-10">
          <div className="w-full h-1 bg-white absolute top-1/2 -translate-y-1/2"></div>
          <div className="h-full w-1 bg-white absolute left-1/2 -translate-x-1/2"></div>
        </div>

        {/* Medical equipment shapes */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 border-2 border-white/10 rotate-45 animate-bounce"></div>

        {/* Heartbeat line */}
        <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent">
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-8 h-4 bg-white/10 clip-path-polygon animate-pulse"></div>
        </div>
      </div>{" "}
      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center space-y-6 px-8">
        {/* Logo container */}
        <div className="relative">
          {/* Rotating ring */}
          <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-white/30 border-r-white/20 rounded-full animate-spin"></div>
          <div className="absolute inset-2 w-28 h-28 border-2 border-transparent border-b-white/20 border-l-white/10 rounded-full animate-spin-reverse"></div>

          {/* Logo */}
          <div className="relative w-32 h-32 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-2xl">
            <div className="w-20 h-20 relative">
              <Image
                src="/logo.png"
                alt="DM Medical Alkes"
                width={80}
                height={80}
                className="w-full h-full object-contain filter brightness-0 invert"
                priority
              />
            </div>
          </div>

          {/* Pulse effect */}
          <div className="absolute inset-0 w-32 h-32 bg-white/10 rounded-full animate-ping opacity-20"></div>
        </div>{" "}
        {/* Company name */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-wide">
            DM Medical Alkes
          </h1>
          <p className="text-white/80 text-sm sm:text-base font-medium">
            Peralatan Medis Berkualitas Tinggi
          </p>
        </div>
        {/* Loading dots */}
        <div className="flex space-x-2">
          <div
            className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
