"use client";

import React, { useEffect, useRef, useState } from "react";

export default function ParallaxScrollScrubVideo(props: IProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startDragX, setStartDragX] = useState(0);
  const [currentTimeBeforeDrag, setCurrentTimeBeforeDrag] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [targetTime, setTargetTime] = useState<number | null>(null);
  const [seekSpeed, setSeekSpeed] = useState(3); // Speed multiplier for smooth seeking

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.duration && video.duration !== Infinity) {
        setDuration(video.duration);
        setIsLoading(false);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    // Add event listeners
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("durationchange", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);

    // Check if video already has metadata
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("durationchange", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);

      // Cleanup animation frame if component unmounts during seeking
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Smooth seeking animation function
  const animateSeek = () => {
    const video = videoRef.current;
    if (!video || targetTime === null) return;

    const currentVideoTime = video.currentTime;
    const difference = targetTime - currentVideoTime;
    const isForward = difference > 0;

    // If we're close enough to the target or reached target, stop seeking
    if (Math.abs(difference) < 0.1) {
      video.currentTime = targetTime;
      setIsSeeking(false);
      setTargetTime(null);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    // Calculate how much to move in this frame - faster when far from target, slower when close
    const adjustedSpeed = Math.min(
      seekSpeed,
      Math.max(1, Math.abs(difference) * 0.5)
    );
    const step = isForward
      ? Math.min(difference, adjustedSpeed / 30)
      : Math.max(difference, -adjustedSpeed / 30);

    // Update video time
    video.currentTime = currentVideoTime + step;

    // Continue animation
    animationRef.current = requestAnimationFrame(animateSeek);
  };

  // Effect to handle seeking when targetTime changes
  useEffect(() => {
    if (targetTime !== null && !animationRef.current) {
      setIsSeeking(true);
      animationRef.current = requestAnimationFrame(animateSeek);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [targetTime]);

  // Handler for mouse down - starts drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!videoRef.current || duration <= 0 || isSeeking) return;

    setIsDragging(true);
    setStartDragX(e.clientX);
    setCurrentTimeBeforeDrag(videoRef.current.currentTime);

    // Prevent default behaviors like text highlighting
    e.preventDefault();
  };

  // Handler for mouse move - updates video position during drag
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !videoRef.current || isSeeking) return;

    // Calculate mouse movement relative to the start of the drag
    const deltaX = e.clientX - startDragX;

    // Convert movement to time change (sensitivity can be adjusted)
    const timeChange = deltaX * 0.05;

    // Calculate new target time
    let newTime = currentTimeBeforeDrag + timeChange;

    // Limit time within video duration range
    newTime = Math.max(0, Math.min(newTime, duration - 0.01));

    // Update video position directly (no smooth seek for dragging)
    videoRef.current.currentTime = newTime;
  };

  // Handler for mouse up - ends drag
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handler for mouse leave - ends drag if mouse leaves the area
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Function to handle 20% timeline jumps with smooth seeking
  const handleJump = (direction: "forward" | "backward") => {
    if (!videoRef.current || duration <= 0 || isSeeking) return;

    const jumpSize = duration * 0.2; // 20% of total duration
    let newTargetTime = videoRef.current.currentTime;

    if (direction === "forward") {
      newTargetTime += jumpSize;
    } else {
      newTargetTime -= jumpSize;
    }

    // Ensure new time is within valid range
    newTargetTime = Math.max(0, Math.min(newTargetTime, duration - 0.01));

    // Start smooth seeking to this time
    setTargetTime(newTargetTime);
  };

  // Function to jump to specific percentage of the video with smooth seeking
  const jumpToPercentage = (percentage: number) => {
    if (!videoRef.current || duration <= 0 || isSeeking) return;

    // Calculate time based on percentage (0-100)
    const newTargetTime = (percentage / 100) * duration;

    // Ensure new time is within valid range
    const clampedTime = Math.max(0, Math.min(newTargetTime, duration - 0.01));

    // Start smooth seeking to this time
    setTargetTime(clampedTime);
  };

  // Calculate current percentage for display and active button highlighting
  const currentPercentage = Math.round((currentTime / duration) * 100);

  return (
    <div className="w-full h-fit  aspect-video relative overflow-hidden bg-transparent rounded-lg">
      <div
        className="absolute inset-0 z-0 flex items-start justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}>
        <video
          ref={videoRef}
          src={props.value}
          className="w-full h-auto aspect-video top-1/2 cursor-pointer object-cover "
          muted
          playsInline
          preload="auto"
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-xl">
            Memuat data...
          </div>
        )}

        {!isLoading && (
          <>
            {/* Left button (backward) */}
            <button
              onClick={() => handleJump("backward")}
              disabled={isSeeking}
              className={`absolute lg:left-[40%] lg:bottom-4 left-4 bottom-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full w-10 h-10 flex items-center justify-center z-20 transition-all ${
                isSeeking ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Kembali 20%">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Right button (forward) */}
            <button
              onClick={() => handleJump("forward")}
              disabled={isSeeking}
              className={`absolute lg:right-[40%] lg:bottom-4 right-4 bottom-1/2 cursor-pointer transform -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full w-10 h-10 flex items-center justify-center z-20 transition-all ${
                isSeeking ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Maju 20%">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Status indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
              {/* Seeking indicator */}
              {isSeeking && (
                <div className="bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  loading...
                </div>
              )}

              {/* Percentage indicator */}
              <div className="bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm ml-auto">
                {currentPercentage}%
              </div>
            </div>
          </>
        )}

        <style jsx global>{`
          ${isDragging ? "body { cursor: ew-resize !important; }" : ""}
        `}</style>
      </div>
    </div>
  );
}

interface IProps {
  value: string;
}
