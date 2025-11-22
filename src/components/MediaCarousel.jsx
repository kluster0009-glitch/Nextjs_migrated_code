"use client";

import { useCallback, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Instagram-style media carousel for posts
 * Supports images and videos with navigation dots
 */
export function MediaCarousel({ media = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  if (!media || media.length === 0) {
    return null;
  }

  // Single media - no carousel needed
  if (media.length === 1) {
    const item = media[0];
    return (
      <div className="relative w-full bg-black">
        {item.type === "image" ? (
          <img
            src={item.url}
            alt="Post media"
            className="w-full h-auto max-h-[600px] object-contain"
          />
        ) : (
          <video
            src={item.url}
            controls
            className="w-full h-auto max-h-[600px] object-contain"
          />
        )}
      </div>
    );
  }

  // Multiple media - show carousel
  return (
    <div className="relative w-full bg-black">
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {media.map((item, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative"
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={`Media ${index + 1}`}
                  className="w-full h-auto max-h-[600px] object-contain"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              ) : (
                <video
                  src={item.url}
                  controls
                  className="w-full h-auto max-h-[600px] object-contain"
                  preload={index === 0 ? "auto" : "metadata"}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {selectedIndex > 0 && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white/90 hover:bg-white shadow-lg border-0"
          onClick={scrollPrev}
        >
          <ChevronLeft className="w-5 h-5 text-gray-900" />
        </Button>
      )}

      {selectedIndex < media.length - 1 && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white/90 hover:bg-white shadow-lg border-0"
          onClick={scrollNext}
        >
          <ChevronRight className="w-5 h-5 text-gray-900" />
        </Button>
      )}

      {/* Dots Indicator - Instagram style */}
      {media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {media.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === selectedIndex
                  ? "bg-blue-500 w-1.5"
                  : "bg-white/60 hover:bg-white/80 w-1.5"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
