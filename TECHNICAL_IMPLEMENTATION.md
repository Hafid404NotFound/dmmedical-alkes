# Implementasi Teknis - Sistem Eksperimen 360° Viewer

## Architecture Overview

### File Structure
```
src/
├── app/experiment/
│   ├── page.tsx                    # Main experiment page
│   └── layout.tsx                  # Experiment-specific layout
├── components/
│   ├── ExperimentViewer360.tsx     # Experiment viewer component
│   ├── ImageViewer360.tsx          # Production viewer component
│   ├── PageContainer.tsx           # Layout wrapper
│   ├── PageTitle.tsx               # Title component
│   └── Button.tsx                  # Button component
└── utils/
    └── toast-helper.ts             # Toast notification helper
```

## Core Components

### 1. ExperimentPage (`page.tsx`)
**Purpose:** Main orchestrator untuk eksperimen 4-stage
**Key Features:**
- State management untuk progress eksperimen
- Data collection dan aggregation
- CSV export functionality
- Real-time analytics dashboard

**State Management:**
```typescript
interface ExperimentResult {
  imageCount: number;           // 10, 18, 24, or 36
  smoothnessRating: number;     // 1-5 Likert scale
  clarityRating: number;        // 1-5 Likert scale
  usabilityRating: number;      // 1-5 Likert scale
  overallRating: number;        // 1-5 Likert scale
  loadTime: number;             // milliseconds
  comments: string;             // qualitative feedback
  timestamp: Date;              // when experiment was conducted
  interactionTime: number;      // total interaction time (ms)
  rotationCount: number;        // number of full rotations
}
```

### 2. ExperimentViewer360 (`ExperimentViewer360.tsx`)
**Purpose:** 360° viewer component dengan measurement capabilities
**Key Features:**
- Mouse/touch interaction handling
- Performance monitoring
- User behavior tracking
- Rating collection interface

**Core Algorithm:**
```typescript
// Mouse movement to image index calculation
const handleMouseMove = (e: MouseEvent) => {
  const deltaX = e.clientX - startX;
  const sensitivity = 2; // pixels per frame transition
  const indexChange = Math.floor(Math.abs(deltaX) / sensitivity);
  
  if (indexChange > 0) {
    const newIndex = deltaX > 0 
      ? (currentIndex + indexChange) % images.length
      : (currentIndex - indexChange + images.length) % images.length;
    
    setCurrentIndex(newIndex);
    setStartX(e.clientX);
    
    // Track full rotations for UX metrics
    if (Math.abs(newIndex - lastIndexRef.current) > images.length / 2) {
      setRotationCount(prev => prev + 1);
    }
  }
};
```

## Data Flow

### Experiment Lifecycle
```
1. User visits /experiment
2. ExperimentPage loads with config for 4 stages
3. For each stage (10, 18, 24, 36 images):
   a. ExperimentViewer360 renders with specific imageCount
   b. User interacts with viewer (drag to rotate)
   c. Performance metrics collected automatically
   d. User provides subjective ratings
   e. Data aggregated in ExperimentResult
4. All results compiled and analyzed
5. Export functionality available
```

### Data Collection Points
```typescript
// Automatic Metrics (Quantitative)
const automaticMetrics = {
  loadTime: measureImageLoadTime(),
  interactionTime: trackUserEngagement(),
  rotationCount: countFullRotations(),
  frameTransitions: logImageIndexChanges()
};

// User Input Metrics (Qualitative)
const userMetrics = {
  smoothnessRating: getUserRating('smoothness'),
  clarityRating: getUserRating('clarity'),
  usabilityRating: getUserRating('usability'),
  overallRating: getUserRating('overall'),
  comments: getUserFeedback()
};
```

## Performance Optimizations

### 1. Image Loading Strategy
```typescript
// Progressive loading for better perceived performance
const loadImages = async (imageCount: number) => {
  const images = Array.from({length: imageCount}, (_, i) => 
    `/gambar 360/${i + 1}.png`
  );
  
  // Load critical images first (every 90 degrees)
  const criticalIndexes = [0, Math.floor(imageCount/4), 
                          Math.floor(imageCount/2), 
                          Math.floor(imageCount*3/4)];
  
  // Preload critical images
  await Promise.all(criticalIndexes.map(i => preloadImage(images[i])));
  
  // Load remaining images in background
  const remaining = images.filter((_, i) => !criticalIndexes.includes(i));
  remaining.forEach(src => preloadImage(src));
};
```

### 2. Event Handling Optimization
```typescript
// Debounced mouse handling to prevent excessive updates
const debouncedMouseMove = useCallback(
  debounce((e: MouseEvent) => handleMouseMove(e), 16), // ~60fps
  [handleMouseMove]
);

// Touch event optimization for mobile
const optimizedTouchMove = useCallback((e: TouchEvent) => {
  e.preventDefault(); // Prevent scrolling
  handleTouchMove(e);
}, [handleTouchMove]);
```

### 3. Memory Management
```typescript
// Cleanup function to prevent memory leaks
useEffect(() => {
  return () => {
    // Cleanup event listeners
    document.removeEventListener('mousemove', debouncedMouseMove);
    document.removeEventListener('touchmove', optimizedTouchMove);
    
    // Clear image cache if needed
    if (images.length > 24) { // Only for large image sets
      images.forEach(src => {
        const img = document.querySelector(`img[src="${src}"]`);
        if (img) img.remove();
      });
    }
  };
}, []);
```

## Measurement Accuracy

### 1. Timing Precision
```typescript
// High-resolution timing for accurate measurements
const startTime = performance.now();
const endTime = performance.now();
const loadTime = endTime - startTime; // Microsecond precision
```

### 2. User Interaction Tracking
```typescript
// Comprehensive interaction logging
const interactionLog = {
  startTime: Date.now(),
  mouseEvents: [],
  touchEvents: [],
  keyboardEvents: [],
  rotationEvents: [],
  durationMs: 0
};

// Log every significant interaction
const logInteraction = (type: string, data: any) => {
  interactionLog[`${type}Events`].push({
    timestamp: Date.now(),
    ...data
  });
};
```

### 3. Statistical Validity
```typescript
// Ensure minimum interaction time for valid data
const MIN_INTERACTION_TIME = 10000; // 10 seconds
const MIN_ROTATIONS = 1; // At least one full rotation

const isValidExperiment = (data: ExperimentData) => {
  return data.interactionTime >= MIN_INTERACTION_TIME &&
         data.rotationCount >= MIN_ROTATIONS;
};
```

## Export and Analysis

### 1. CSV Export Format
```csv
Jumlah Gambar,Rating Kelancaran,Rating Kejelasan,Rating Kemudahan,Rating Keseluruhan,Waktu Loading (ms),Waktu Interaksi (s),Jumlah Rotasi,Komentar,Timestamp
10,4,3,4,3,1200,15.5,2,"Agak choppy tapi cukup jelas",2024-06-17T10:30:00.000Z
18,4,4,4,4,1800,18.2,3,"Lebih smooth dari yang 10",2024-06-17T10:35:00.000Z
24,5,4,5,4,2100,20.1,2,"Sangat smooth, detail bagus",2024-06-17T10:40:00.000Z
36,5,5,5,5,2800,22.8,4,"Perfect! Sangat halus dan detail",2024-06-17T10:45:00.000Z
```

### 2. Statistical Analysis Support
```typescript
// Data structure optimized for statistical analysis
const exportForSPSS = (results: ExperimentResult[]) => {
  const processedData = results.map(result => ({
    // Independent variables
    imageCount: result.imageCount,
    
    // Dependent variables (continuous)
    smoothness: result.smoothnessRating,
    clarity: result.clarityRating,
    usability: result.usabilityRating,
    overall: result.overallRating,
    
    // Performance metrics
    loadTime: result.loadTime,
    interactionTime: result.interactionTime / 1000, // Convert to seconds
    rotationCount: result.rotationCount,
    
    // Categorical encoding for analysis
    imageCategory: categorizeImageCount(result.imageCount),
    satisfactionLevel: categorizeSatisfaction(result.overallRating)
  }));
  
  return processedData;
};
```

## Browser Compatibility

### Supported Features
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Support:** iOS Safari 14+, Chrome Mobile 90+
- **Touch Events:** Full touch and gesture support
- **Performance API:** High-resolution timing measurements

### Fallback Strategies
```typescript
// Feature detection and fallbacks
const hasTouch = 'ontouchstart' in window;
const hasPointerEvents = 'onpointerdown' in window;
const hasPerformanceAPI = 'performance' in window && 'now' in performance;

// Graceful degradation for older browsers
if (!hasPerformanceAPI) {
  // Fallback to Date.now() for timing
  window.performance = { now: () => Date.now() };
}
```

## Security Considerations

### 1. Data Privacy
- No personal information collected
- All data stored locally (localStorage)
- Optional CSV export under user control
- No external API calls for sensitive data

### 2. Input Validation
```typescript
// Validate user ratings
const validateRating = (rating: number): boolean => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

// Sanitize comments
const sanitizeComment = (comment: string): string => {
  return comment.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .substring(0, 500); // Limit length
};
```

## Debugging and Monitoring

### Development Mode
```typescript
// Debug mode with URL parameter ?debug=true
const isDebugMode = new URLSearchParams(window.location.search).get('debug') === 'true';

if (isDebugMode) {
  // Log all interactions
  console.log('Interaction logged:', interactionData);
  
  // Show performance metrics overlay
  showPerformanceOverlay();
  
  // Enable verbose error logging
  window.addEventListener('error', logDetailedError);
}
```

### Production Monitoring
```typescript
// Basic error tracking without external dependencies
const logError = (error: Error, context: string) => {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  // Store locally for later analysis
  const errors = JSON.parse(localStorage.getItem('experiment_errors') || '[]');
  errors.push(errorLog);
  localStorage.setItem('experiment_errors', JSON.stringify(errors.slice(-10))); // Keep last 10
};
```

## Future Enhancements

### 1. Advanced Analytics
- Eye tracking integration
- Mouse movement heatmaps
- A/B testing framework
- Real-time user behavior analysis

### 2. Machine Learning Integration
- Automatic image count optimization
- Predictive user satisfaction modeling
- Anomaly detection in user interactions
- Personalized viewer configurations

### 3. Enhanced Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Reduced motion preferences
- Voice control integration
