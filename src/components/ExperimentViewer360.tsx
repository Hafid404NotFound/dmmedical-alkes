'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Button from './Button'
import { toast } from 'react-hot-toast'

interface ExperimentData {
  imageCount: number
  timestamp: number
  interactionTime: number
  rotationCount: number
  smoothnessRating: number
  usabilityRating: number
  performanceRating: number
  overallRating: number
  comments: string
}

interface ExperimentViewer360Props {
  imageCount: number
  onExperimentComplete: (data: ExperimentData) => void
}

export default function ExperimentViewer360({ imageCount, onExperimentComplete }: ExperimentViewer360Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [rotationCount, setRotationCount] = useState(0)
  const [interactionTime, setInteractionTime] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [isExperimentActive, setIsExperimentActive] = useState(false)
  const [showRatingForm, setShowRatingForm] = useState(false)
  
  // Rating states
  const [smoothnessRating, setSmoothnessRating] = useState(0)
  const [usabilityRating, setUsabilityRating] = useState(0)
  const [performanceRating, setPerformanceRating] = useState(0)
  const [overallRating, setOverallRating] = useState(0)
  const [comments, setComments] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const lastIndexRef = useRef(0)

  // Generate image paths based on imageCount from specific folders
  const getImagePaths = (count: number): string[] => {
    switch (count) {
      case 10:
        return [
          '/gambar 360/10gambar/1.png',
          '/gambar 360/10gambar/8.png',
          '/gambar 360/10gambar/14.png',
          '/gambar 360/10gambar/21.png',
          '/gambar 360/10gambar/26.png',
          '/gambar 360/10gambar/29.png',
          '/gambar 360/10gambar/32.png',
          '/gambar 360/10gambar/34.png',
          '/gambar 360/10gambar/36.png',
          '/gambar 360/10gambar/37.png'
        ];      case 18:
        return [
          '/gambar 360/18gambar/1.png',
          '/gambar 360/18gambar/4.png',
          '/gambar 360/18gambar/6.png',
          '/gambar 360/18gambar/8.png',
          '/gambar 360/18gambar/10.png',
          '/gambar 360/18gambar/12.png',
          '/gambar 360/18gambar/14.png',
          '/gambar 360/18gambar/16.png',
          '/gambar 360/18gambar/18.png',
          '/gambar 360/18gambar/20.png',
          '/gambar 360/18gambar/22.png',
          '/gambar 360/18gambar/24.png',
          '/gambar 360/18gambar/27.png',
          '/gambar 360/18gambar/29.png',
          '/gambar 360/18gambar/31.png',
          '/gambar 360/18gambar/34.png',
          '/gambar 360/18gambar/37.png',
          '/gambar 360/18gambar/1.png' // Kembali ke awal untuk melengkapi 18
        ];
      case 24:
        return [
          '/gambar 360/24gambar/1.png',
          '/gambar 360/24gambar/3.png',
          '/gambar 360/24gambar/5.png',
          '/gambar 360/24gambar/7.png',
          '/gambar 360/24gambar/9.png',
          '/gambar 360/24gambar/11.png',
          '/gambar 360/24gambar/13.png',
          '/gambar 360/24gambar/15.png',
          '/gambar 360/24gambar/17.png',
          '/gambar 360/24gambar/19.png',
          '/gambar 360/24gambar/21.png',
          '/gambar 360/24gambar/23.png',
          '/gambar 360/24gambar/24.png',
          '/gambar 360/24gambar/27.png',
          '/gambar 360/24gambar/28.png',
          '/gambar 360/24gambar/29.png',
          '/gambar 360/24gambar/30.png',
          '/gambar 360/24gambar/31.png',
          '/gambar 360/24gambar/32.png',
          '/gambar 360/24gambar/33.png',
          '/gambar 360/24gambar/34.png',
          '/gambar 360/24gambar/35.png',
          '/gambar 360/24gambar/36.png',
          '/gambar 360/24gambar/37.png'
        ];
      case 36:
        return [
          '/gambar 360/36gambar/1.png',
          '/gambar 360/36gambar/2.png',
          '/gambar 360/36gambar/3.png',
          '/gambar 360/36gambar/4.png',
          '/gambar 360/36gambar/5.png',
          '/gambar 360/36gambar/6.png',
          '/gambar 360/36gambar/7.png',
          '/gambar 360/36gambar/8.png',
          '/gambar 360/36gambar/9.png',
          '/gambar 360/36gambar/10.png',
          '/gambar 360/36gambar/11.png',
          '/gambar 360/36gambar/12.png',
          '/gambar 360/36gambar/13.png',
          '/gambar 360/36gambar/14.png',
          '/gambar 360/36gambar/15.png',
          '/gambar 360/36gambar/16.png',
          '/gambar 360/36gambar/17.png',
          '/gambar 360/36gambar/18.png',
          '/gambar 360/36gambar/19.png',
          '/gambar 360/36gambar/20.png',
          '/gambar 360/36gambar/21.png',
          '/gambar 360/36gambar/22.png',
          '/gambar 360/36gambar/23.png',
          '/gambar 360/36gambar/24.png',
          '/gambar 360/36gambar/26.png',
          '/gambar 360/36gambar/27.png',
          '/gambar 360/36gambar/28.png',
          '/gambar 360/36gambar/29.png',
          '/gambar 360/36gambar/30.png',
          '/gambar 360/36gambar/31.png',
          '/gambar 360/36gambar/32.png',
          '/gambar 360/36gambar/33.png',
          '/gambar 360/36gambar/34.png',
          '/gambar 360/36gambar/35.png',
          '/gambar 360/36gambar/36.png',
          '/gambar 360/36gambar/37.png'
        ];
      default:
        return Array.from({ length: imageCount }, (_, i) => `/gambar 360/${i + 1}.png`);
    }
  };
  const images = getImagePaths(imageCount);

  // Preload images for better performance
  useEffect(() => {
    const preloadImages = async () => {
      const loadStartTime = performance.now();
      
      // Load first few images immediately for quick start
      const priorityImages = images.slice(0, Math.min(4, images.length));
      await Promise.all(priorityImages.map(src => {
        return new Promise((resolve, reject) => {
          const img = document.createElement('img');
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      }));

      // Load remaining images in background
      const remainingImages = images.slice(4);
      remainingImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
      });

      const loadEndTime = performance.now();
      console.log(`Loaded ${imageCount} images in ${(loadEndTime - loadStartTime).toFixed(2)}ms`);
    };

    preloadImages();
  }, [images, imageCount]);

  useEffect(() => {
    if (isExperimentActive && startTime === null) {
      setStartTime(Date.now())
    }
  }, [isExperimentActive, startTime])

  const startExperiment = () => {
    setIsExperimentActive(true)
    setStartTime(Date.now())
    setRotationCount(0)
    setInteractionTime(0)
    toast.success(`Experiment dimulai dengan ${imageCount} gambar`)
  }

  const endExperiment = () => {
    if (startTime) {
      const totalTime = Date.now() - startTime
      setInteractionTime(totalTime)
    }
    setIsExperimentActive(false)
    setShowRatingForm(true)
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isExperimentActive) return
    setIsDragging(true)
    setStartX(e.clientX)
  }, [isExperimentActive])
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !isExperimentActive) return

    const deltaX = e.clientX - startX
    const sensitivity = 2.5 // Slightly more sensitive for desktop
    const indexChange = Math.floor(Math.abs(deltaX) / sensitivity)

    if (indexChange > 0) {
      const newIndex = deltaX > 0 
        ? (currentIndex + indexChange) % images.length
        : (currentIndex - indexChange + images.length) % images.length

      setCurrentIndex(newIndex)
      setStartX(e.clientX)

      // Count full rotations
      if (Math.abs(newIndex - lastIndexRef.current) > images.length / 2) {
        setRotationCount(prev => prev + 1)
      }
      lastIndexRef.current = newIndex
    }
  }, [isDragging, startX, currentIndex, images.length, isExperimentActive])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isExperimentActive) return
    e.preventDefault(); // Prevent scrolling on mobile
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
  }, [isExperimentActive])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !isExperimentActive) return
    e.preventDefault(); // Prevent scrolling on mobile

    const deltaX = e.touches[0].clientX - startX
    const sensitivity = window.innerWidth > 768 ? 2 : 1.5 // More sensitive on mobile
    const indexChange = Math.floor(Math.abs(deltaX) / sensitivity)

    if (indexChange > 0) {
      const newIndex = deltaX > 0 
        ? (currentIndex + indexChange) % images.length
        : (currentIndex - indexChange + images.length) % images.length

      setCurrentIndex(newIndex)
      setStartX(e.touches[0].clientX)

      if (Math.abs(newIndex - lastIndexRef.current) > images.length / 2) {
        setRotationCount(prev => prev + 1)
      }
      lastIndexRef.current = newIndex
    }
  }, [isDragging, startX, currentIndex, images.length, isExperimentActive])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const submitRating = () => {
    if (!smoothnessRating || !usabilityRating || !performanceRating || !overallRating) {
      toast.error('Mohon berikan rating untuk semua kategori')
      return
    }

    const experimentData: ExperimentData = {
      imageCount,
      timestamp: Date.now(),
      interactionTime,
      rotationCount,
      smoothnessRating,
      usabilityRating,
      performanceRating,
      overallRating,
      comments
    }

    onExperimentComplete(experimentData)
    setShowRatingForm(false)
    
    // Reset for next experiment
    setSmoothnessRating(0)
    setUsabilityRating(0)
    setPerformanceRating(0)
    setOverallRating(0)
    setComments('')
  }
  const RatingStars = ({ rating, setRating, label }: { rating: number, setRating: (rating: number) => void, label: string }) => (
    <div className="mb-3 md:mb-4">
      <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">{label}</label>
      <div className="flex space-x-1 justify-center md:justify-start">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-xl md:text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors touch-manipulation`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-2xl mx-auto">      {/* Experiment Info */}
      <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 rounded-lg">
        <h3 className="text-base md:text-lg font-semibold mb-2">Experiment: {imageCount} Gambar 360°</h3>
        <p className="text-xs md:text-sm text-gray-600 mb-2">
          Menggunakan gambar dari folder: <code className="bg-gray-200 px-1 rounded text-xs">/gambar 360/{imageCount}gambar/</code>
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
          <div>Status: <span className={isExperimentActive ? 'text-green-600 font-semibold' : 'text-gray-600'}>{isExperimentActive ? 'Aktif' : 'Standby'}</span></div>
          <div>Waktu: {Math.round(interactionTime / 1000)}s</div>
          <div>Rotasi: {rotationCount}</div>
          <div>Gambar: {currentIndex + 1}/{imageCount}</div>
          <div>Sudut: {Math.round(360 / imageCount)}°</div>
          <div className="hidden md:block">Total: {images.length} files</div>
        </div>
      </div>      {/* 360° Viewer */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing select-none touch-pan-x"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[currentIndex]}
          alt={`360° view ${currentIndex + 1}`}
          fill
          className="object-contain pointer-events-none"
          priority
          draggable={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlay info */}
        <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-black bg-opacity-70 text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm">
          {currentIndex + 1} / {imageCount}
        </div>
        
        {/* Mobile instruction overlay */}
        {!isExperimentActive && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="text-white text-center max-w-xs md:max-w-none">
              <p className="mb-3 md:mb-4 text-sm md:text-base">Siap untuk memulai experiment?</p>
              <p className="mb-4 text-xs md:text-sm text-gray-300 md:hidden">
                Gunakan gesture swipe atau drag untuk memutar
              </p>
              <Button 
                onClick={startExperiment} 
                className="bg-blue-600 hover:bg-blue-700 text-sm md:text-base px-4 md:px-6 py-2"
              >
                Mulai Experiment
              </Button>
            </div>
          </div>
        )}
      </div>      {/* Experiment Controls */}
      {isExperimentActive && (
        <div className="mt-3 md:mt-4 text-center px-2">
          <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
            <span className="md:hidden">Swipe untuk memutar gambar 360°</span>
            <span className="hidden md:inline">Drag atau swipe untuk memutar gambar 360°</span>
            <br className="md:hidden" />
            <span className="text-xs">Rasakan smoothness dan responsivitas.</span>
          </p>
          <Button 
            onClick={endExperiment} 
            className="bg-red-600 hover:bg-red-700 text-sm md:text-base px-4 md:px-6 py-2"
          >
            Selesai Experiment
          </Button>
        </div>
      )}

      {/* Rating Form Modal */}
      {showRatingForm && (        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-lg w-full max-w-sm md:max-w-md max-h-[90vh] overflow-y-auto p-4 md:p-6 mx-2">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Rating Experiment ({imageCount} Gambar)</h3>
            
            <RatingStars 
              rating={smoothnessRating} 
              setRating={setSmoothnessRating} 
              label="Smoothness (Kelancaran Rotasi)" 
            />
            
            <RatingStars 
              rating={usabilityRating} 
              setRating={setUsabilityRating} 
              label="Usability (Kemudahan Penggunaan)" 
            />
            
            <RatingStars 
              rating={performanceRating} 
              setRating={setPerformanceRating} 
              label="Performance (Kecepatan Loading)" 
            />
            
            <RatingStars 
              rating={overallRating} 
              setRating={setOverallRating} 
              label="Overall Experience (Pengalaman Keseluruhan)" 
            />            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium mb-2">Komentar Tambahan</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-2 md:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                rows={3}
                placeholder="Berikan feedback tentang pengalaman menggunakan viewer dengan jumlah gambar ini..."
              />
            </div>

            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
              <Button 
                onClick={submitRating}
                className="flex-1 bg-green-600 hover:bg-green-700 text-sm md:text-base py-2 md:py-3"
              >
                Submit Rating
              </Button>              <Button 
                onClick={() => setShowRatingForm(false)}
                variant="secondary"
                className="flex-1 text-sm md:text-base py-2 md:py-3"
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <h4 className="font-semibold mb-2">Instruksi Experiment:</h4>
        <ul className="space-y-1">
          <li>1. Klik "Mulai Experiment" untuk memulai</li>
          <li>2. Drag/swipe gambar untuk merasakan smoothness rotasi</li>
          <li>3. Coba berbagai kecepatan dan arah rotasi</li>
          <li>4. Perhatikan loading time dan responsivitas</li>
          <li>5. Klik "Selesai Experiment" dan berikan rating</li>
        </ul>
      </div>
    </div>
  )
}
