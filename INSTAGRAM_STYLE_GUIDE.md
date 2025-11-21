# Instagram-Style Multi-Image Display - Quick Reference

## 🎨 Instagram Layout Features

### Visual Design Patterns

1. **Carousel Container**
   - Full-width container
   - Rounded corners (8px)
   - Overflow hidden
   - Dark background for letterboxing

2. **Image Display**
   - Contained aspect ratio (not cropped)
   - Max height: 600px
   - Centered in container
   - Maintains original aspect ratio

3. **Navigation Controls**
   - **Arrows**: Left/right chevrons
     - Position: Absolute, vertically centered
     - Style: Semi-transparent background
     - Visibility: Only show if 2+ items
   
   - **Dots**: Bottom indicators
     - Position: Absolute bottom, centered
     - Style: Small circles
     - Active: Filled, Inactive: Outlined
     - Click to jump to image
   
   - **Counter**: "1/5" badge
     - Position: Top-right corner
     - Style: Dark semi-transparent badge
     - Shows: current/total

4. **Touch/Swipe Support**
   - Swipe left: Next image
   - Swipe right: Previous image
   - Smooth animation
   - Mobile-first approach

### Current Implementation

**File**: `/src/components/MediaCarousel.jsx`

```jsx
export function MediaCarousel({ media = [] }) {
  // Single item - no carousel UI
  if (media.length === 1) {
    return <SimpleImage />;
  }

  // Multiple items - full carousel
  return (
    <div className="relative">
      {/* Main carousel */}
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {media.map((item, index) => (
            <div key={index} className="embla__slide">
              {item.type === 'image' ? <Image /> : <Video />}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button onClick={scrollPrev}>
        <ChevronLeft />
      </Button>
      <Button onClick={scrollNext}>
        <ChevronRight />
      </Button>

      {/* Dot Indicators */}
      <div className="dots">
        {media.map((_, index) => (
          <button 
            className={index === selectedIndex ? 'active' : ''}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>

      {/* Counter Badge */}
      <div className="counter">
        {selectedIndex + 1}/{media.length}
      </div>
    </div>
  );
}
```

### Enhanced Instagram Features (Optional)

#### 1. Double-Tap to Like
```jsx
const handleDoubleTap = useCallback(() => {
  // Like the post
  handleLike();
  // Show heart animation
  showHeartAnimation();
}, []);

<div onDoubleClick={handleDoubleTap}>
  <MediaCarousel media={media} />
</div>
```

#### 2. Pinch to Zoom
```jsx
import Pinch from 'react-pinch-zoom';

<Pinch>
  <img src={media.url} />
</Pinch>
```

#### 3. Image Captions
```jsx
{media.map((item) => (
  <div>
    <img src={item.url} />
    {item.caption && (
      <div className="caption">{item.caption}</div>
    )}
  </div>
))}
```

#### 4. Slide Counter Animation
```jsx
const [isChanging, setIsChanging] = useState(false);

useEffect(() => {
  setIsChanging(true);
  const timer = setTimeout(() => setIsChanging(false), 300);
  return () => clearTimeout(timer);
}, [selectedIndex]);

<div className={`counter ${isChanging ? 'animate-pulse' : ''}`}>
  {selectedIndex + 1}/{media.length}
</div>
```

#### 5. Keyboard Navigation
```jsx
useEffect(() => {
  const handleKey = (e) => {
    if (e.key === 'ArrowLeft') scrollPrev();
    if (e.key === 'ArrowRight') scrollNext();
  };
  
  window.addEventListener('keydown', handleKey);
  return () => window.removeEventListener('keydown', handleKey);
}, [scrollPrev, scrollNext]);
```

#### 6. Auto-Play (Stories Style)
```jsx
const [isPlaying, setIsPlaying] = useState(false);

useEffect(() => {
  if (!isPlaying) return;
  
  const timer = setInterval(() => {
    if (selectedIndex < media.length - 1) {
      scrollNext();
    } else {
      setIsPlaying(false);
    }
  }, 3000);
  
  return () => clearInterval(timer);
}, [isPlaying, selectedIndex]);
```

### Styling Reference

```css
/* Container */
.embla {
  overflow: hidden;
  border-radius: 8px;
  background: #000;
}

.embla__container {
  display: flex;
}

.embla__slide {
  flex: 0 0 100%;
  min-width: 0;
}

/* Navigation Arrows */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.carousel-arrow:hover {
  background: rgba(0, 0, 0, 0.7);
}

.carousel-arrow-left {
  left: 16px;
}

.carousel-arrow-right {
  right: 16px;
}

/* Dot Indicators */
.dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.dot.active {
  background: rgba(255, 255, 255, 1);
}

/* Counter Badge */
.counter {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

/* Image */
.carousel-image {
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: contain;
  display: block;
}

/* Video */
.carousel-video {
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: contain;
}
```

### Accessibility Considerations

```jsx
// Add ARIA labels
<button 
  aria-label="Previous image"
  onClick={scrollPrev}
>
  <ChevronLeft />
</button>

<button 
  aria-label="Next image"
  onClick={scrollNext}
>
  <ChevronRight />
</button>

// Add image alt text
<img 
  src={item.url} 
  alt={item.alt || `Image ${index + 1} of ${media.length}`}
/>

// Add role and labels
<div 
  role="region" 
  aria-label="Image carousel"
  aria-live="polite"
>
  {/* Carousel content */}
</div>
```

### Performance Optimizations

```jsx
// 1. Lazy load images not in view
<img 
  src={item.url} 
  loading="lazy"
  decoding="async"
/>

// 2. Preload adjacent images
useEffect(() => {
  if (!emblaApi) return;
  
  const preloadAdjacent = () => {
    const current = emblaApi.selectedScrollSnap();
    const prev = current - 1;
    const next = current + 1;
    
    if (prev >= 0) preloadImage(media[prev].url);
    if (next < media.length) preloadImage(media[next].url);
  };
  
  preloadAdjacent();
  emblaApi.on('select', preloadAdjacent);
}, [emblaApi]);

// 3. Use intersection observer
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => setIsVisible(entry.isIntersecting),
    { threshold: 0.1 }
  );
  
  if (containerRef.current) {
    observer.observe(containerRef.current);
  }
  
  return () => observer.disconnect();
}, []);

// Only load carousel when visible
{isVisible && <MediaCarousel media={media} />}
```

### Mobile Optimizations

```jsx
// 1. Detect touch device
const isTouchDevice = 'ontouchstart' in window;

// 2. Adjust arrow visibility
{!isTouchDevice && (
  <>
    <Button onClick={scrollPrev}>←</Button>
    <Button onClick={scrollNext}>→</Button>
  </>
)}

// 3. Increase touch target size
.carousel-arrow {
  width: 48px;  /* Larger for touch */
  height: 48px;
}

// 4. Prevent pull-to-refresh interference
.embla {
  overscroll-behavior: contain;
  touch-action: pan-y pinch-zoom;
}
```

### Testing Checklist

- [ ] Single image displays correctly (no carousel UI)
- [ ] Multiple images show carousel
- [ ] Left arrow goes to previous
- [ ] Right arrow goes to next
- [ ] Dots show active state
- [ ] Clicking dot jumps to that image
- [ ] Counter updates on slide change
- [ ] Swipe left/right works on mobile
- [ ] First image: left arrow disabled/hidden
- [ ] Last image: right arrow disabled/hidden
- [ ] Videos play inline
- [ ] Keyboard arrows work
- [ ] Images maintain aspect ratio
- [ ] No layout shift on load
- [ ] Smooth animations

---

## 🎨 Design Variations

### Variation 1: Full Bleed (Instagram Feed)
```jsx
// No rounded corners, full width
<div className="w-full overflow-hidden">
  <MediaCarousel media={media} />
</div>
```

### Variation 2: Square Grid (Instagram Profile)
```jsx
// Force square aspect ratio
<div className="aspect-square overflow-hidden">
  <img className="object-cover w-full h-full" />
</div>
```

### Variation 3: Story Style (Vertical, Auto-advance)
```jsx
<div className="h-screen w-full">
  <MediaCarousel 
    media={media} 
    autoPlay={true}
    interval={5000}
    vertical={true}
  />
</div>
```

---

**Instagram-style carousel implemented! 🎉**
