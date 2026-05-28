"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export interface HeroPiece {
  id: string;
  name: string;
  description: string;
  src: string;
  blurDataURL?: string;
}

interface Props {
  pieces: HeroPiece[];
  /** Already-localised CTA label (e.g. "Find us" / "Kur mus rasti"). */
  ctaLabel: string;
  /** Where the CTA points — in this iteration the atelier anchor. */
  ctaHref: string;
  /** ms between auto-advance. Defaults to 5200. */
  interval?: number;
}

/**
 * Hero band — full-bleed crossfade carousel of the Carrousel pieces, with the
 * piece's name as h1 and its poetic LT/EN caption as the lead. The carousel
 * state lives here so the overlay text and the background photo advance in
 * lockstep. Pauses on hover/focus and honours prefers-reduced-motion (the
 * crossfade itself is handled by the existing .rb-carousel-* styles).
 */
export default function HeroPieces({
  pieces,
  ctaLabel,
  ctaHref,
  interval = 5200,
}: Props) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setI((x) => (x + 1) % pieces.length),
    [pieces.length],
  );
  const prev = useCallback(
    () => setI((x) => (x - 1 + pieces.length) % pieces.length),
    [pieces.length],
  );

  useEffect(() => {
    if (paused || pieces.length < 2) return;
    const t = window.setTimeout(next, interval);
    return () => window.clearTimeout(t);
  }, [i, paused, interval, next, pieces.length]);

  const active = pieces[i];

  return (
    <section
      style={{
        position: "relative",
        height: "min(760px, 86vh)",
        background: "var(--rb-noir)",
        overflow: "hidden",
        color: "#fafafa",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Background carousel — slides cross-fade, ken-burns drift from rb-carousel */}
      <div
        className="rb-carousel"
        style={{ position: "absolute", inset: 0 }}
        role="group"
        aria-roledescription="carousel"
        aria-label="Carrousel pieces"
      >
        {pieces.map((p, idx) => (
          <div
            key={p.id}
            className={"rb-carousel-slide " + (idx === i ? "is-active" : "")}
            aria-hidden={idx !== i}
          >
            <Image
              src={p.src}
              alt={p.name}
              fill
              sizes="100vw"
              priority={idx === 0}
              placeholder={p.blurDataURL ? "blur" : "empty"}
              blurDataURL={p.blurDataURL}
              quality={90}
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      {/* Dark scrim to keep the type legible over light pieces too. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(110deg, rgba(0,0,0,0.72), rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.45) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Counter top-right */}
      {pieces.length > 1 && (
        <div className="rb-carousel-counter" style={{ zIndex: 2 }}>
          {String(i + 1).padStart(2, "0")}
          <span style={{ opacity: 0.5, margin: "0 6px" }}>/</span>
          {String(pieces.length).padStart(2, "0")}
        </div>
      )}

      {/* Overlay — h1 = piece name, p = caption. Crossfade keyed on i so the
          text settles in lockstep with the background. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding:
            "clamp(56px, 9vw, 110px) clamp(20px, 5vw, 64px) clamp(48px, 8vw, 100px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        <div style={{ maxWidth: 820, pointerEvents: "auto" }}>
          <div
            className="rb-eyebrow"
            style={{ opacity: 0.7, marginBottom: 24 }}
          >
            — Carrousel · {String(i + 1).padStart(2, "0")}
          </div>
          <h1
            key={`name-${active.id}`}
            className="rb-hero-h1"
            style={{
              fontSize: "clamp(48px, 7vw, 88px)",
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              fontStyle: "italic",
              textWrap: "pretty",
              animation: "rb-hero-fadein 700ms ease both",
            }}
          >
            {active.name}
          </h1>
          <p
            key={`desc-${active.id}`}
            style={{
              fontSize: "clamp(15px, 1.4vw, 18px)",
              lineHeight: 1.6,
              opacity: 0.85,
              maxWidth: 520,
              marginTop: 24,
              animation: "rb-hero-fadein 700ms ease both 80ms",
            }}
          >
            {active.description}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            pointerEvents: "auto",
            gap: 32,
            flexWrap: "wrap",
          }}
        >
          {/* Dots — clickable indicators that double as a slide picker. */}
          <div
            className="rb-carousel-dots"
            style={{ position: "static", display: "flex", gap: 10 }}
          >
            {pieces.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                className={"rb-carousel-dot " + (idx === i ? "is-active" : "")}
                onClick={() => setI(idx)}
                aria-label={`Go to slide ${idx + 1} — ${p.name}`}
                aria-current={idx === i ? "true" : undefined}
              />
            ))}
          </div>

          <Link
            href={ctaHref}
            style={{
              color: "#fafafa",
              borderBottom: "1px solid #fafafa",
              paddingBottom: 4,
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <path
                d="M7 1.5c-2.2 0-4 1.7-4 3.8 0 2.9 4 7.2 4 7.2s4-4.3 4-7.2c0-2.1-1.8-3.8-4-3.8z"
                stroke="currentColor"
                strokeWidth="1.1"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="7"
                cy="5.4"
                r="1.4"
                stroke="currentColor"
                strokeWidth="1.1"
                fill="none"
              />
            </svg>
            {ctaLabel}
          </Link>
        </div>
      </div>

      {/* Prev / next arrows — desktop only, mobile uses the dots */}
      {pieces.length > 1 && (
        <>
          <button
            type="button"
            className="rb-carousel-nav rb-carousel-nav--prev"
            onClick={prev}
            aria-label="Previous piece"
            style={{ zIndex: 4 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M9 2L4 7l5 5"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="rb-carousel-nav rb-carousel-nav--next"
            onClick={next}
            aria-label="Next piece"
            style={{ zIndex: 4 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M5 2l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}
