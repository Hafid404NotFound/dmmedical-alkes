"use client";
import { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if this is the first visit in this session
    const hasVisited = sessionStorage.getItem("dm-medical-visited");

    if (hasVisited) {
      // If already visited in this session, skip loading
      setIsLoading(false);
      setShowContent(true);
    }
  }, []);

  const handleLoadComplete = () => {
    // Mark as visited in this session
    sessionStorage.setItem("dm-medical-visited", "true");
    setIsLoading(false);

    // Show content with a slight delay for smooth transition
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  return (
    <>
      {isLoading && <LoadingScreen onLoadComplete={handleLoadComplete} />}
      <div
        className={`transition-opacity duration-500 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>
    </>
  );
}
