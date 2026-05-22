"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export interface CarouselItem {
  id: string;
  name: string;
  image: string;
  blurDataURL?: string;
  /** Pre-translated status (rendered where a price would go). */
  statusLabel: string;
}

/**
 * Horizontal product strip. On mobile it's a native scroll-snap carousel the
 * user swipes through; on desktop the same track gains prev/next arrows.
 * Receives pre-translated strings so it can stay a client component.
 */
export default function FeaturedCarousel({
  items,
  viewMoreLabel,
  ariaLabel = "Selected pieces",
}: {
  items: CarouselItem[];
  viewMoreLabel: string;
  ariaLabel?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div className="rb-hcar" role="group" aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="rb-hcar-track" ref={trackRef}>
        {items.map((p) => (
          <article key={p.id} className="rb-hcar-card">
            <Link href={`/catalogue/${p.id}`} className="rb-hcar-media" aria-label={p.name}>
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 760px) 78vw, 300px"
                placeholder={p.blurDataURL ? "blur" : "empty"}
                blurDataURL={p.blurDataURL}
                style={{ objectFit: "cover" }}
              />
            </Link>
            <div className="rb-hcar-body">
              <Link href={`/catalogue/${p.id}`} className="rb-hcar-name">
                {p.name}
              </Link>
              <div className="rb-hcar-status rb-mono">{p.statusLabel}</div>
              <Link href={`/catalogue/${p.id}`} className="rb-hcar-cta rb-eyebrow">
                {viewMoreLabel}
              </Link>
            </div>
          </article>
        ))}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            className="rb-hcar-nav rb-hcar-nav--prev"
            onClick={() => scrollByCards(-1)}
            aria-label="Previous"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            className="rb-hcar-nav rb-hcar-nav--next"
            onClick={() => scrollByCards(1)}
            aria-label="Next"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
