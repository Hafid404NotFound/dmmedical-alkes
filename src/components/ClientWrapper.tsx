"use client";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
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
      </div>{" "}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "12px",
            padding: "16px",
            fontSize: "14px",
            maxWidth: "500px",
          },
          success: {
            style: {
              background: "#22c55e",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#22c55e",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#ef4444",
            },
          },
        }}
        containerStyle={{
          zIndex: 9999,
        }}
      />
    </>
  );
}
