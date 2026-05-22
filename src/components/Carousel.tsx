"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

export interface Slide {
  src?: string;
  caption?: string;
  placeholder?: string;
}

/**
 * Auto-advancing crossfade carousel with ken-burns drift, dot + arrow nav and
 * a mono counter. Pauses on hover. Ported from the Direction C prototype.
 */
export default function Carousel({
  slides,
  height = 480,
  interval = 4800,
  showNav = true,
  showCounter = true,
  priority = false,
}: {
  slides: Slide[];
  height?: number;
  interval?: number;
  showNav?: boolean;
  showCounter?: boolean;
  priority?: boolean;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setI((x) => (x + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setI((x) => (x - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setTimeout(next, interval);
    return () => clearTimeout(t);
  }, [i, paused, interval, next, slides.length]);

  return (
    <div
      className="rb-carousel"
      style={{ height }}
      role="group"
      aria-roledescription="carousel"
      aria-label="Atelier gallery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {slides.map((s, idx) => (
        <div key={idx} className={"rb-carousel-slide " + (idx === i ? "is-active" : "")}>
          {s.src ? (
            <Image
              src={s.src}
              alt={s.caption || ""}
              fill
              sizes="100vw"
              priority={priority && idx === 0}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="rb-placeholder" style={{ width: "100%", height: "100%" }}>
              {s.placeholder || s.caption || "image"}
            </div>
          )}
          {s.caption && <div className="rb-carousel-caption">{s.caption}</div>}
        </div>
      ))}

      {showCounter && slides.length > 1 && (
        <div className="rb-carousel-counter">
          {String(i + 1).padStart(2, "0")}
          <span style={{ opacity: 0.5, margin: "0 6px" }}>/</span>
          {String(slides.length).padStart(2, "0")}
        </div>
      )}

      {showNav && slides.length > 1 && (
        <>
          <button className="rb-carousel-nav rb-carousel-nav--prev" onClick={prev} aria-label="Previous slide">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
            </svg>
          </button>
          <button className="rb-carousel-nav rb-carousel-nav--next" onClick={next} aria-label="Next slide">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
            </svg>
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="rb-carousel-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={"rb-carousel-dot " + (idx === i ? "is-active" : "")}
              onClick={() => setI(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
