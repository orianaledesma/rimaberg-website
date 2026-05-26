"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface Props {
  images: string[];
  alt: string;
  /** Blur placeholders, parallel to `images` (computed server-side). */
  blurs?: (string | undefined)[];
}

/**
 * Product gallery with two zoom affordances:
 *  · desktop — hover the main image to magnify under the cursor (lens).
 *  · any device — click/tap to open a fullscreen lightbox with click-to-zoom
 *    and drag-to-pan.
 * Thumbnails switch the active photo in both the inline view and the lightbox.
 */
export default function ProductGallery({ images, alt, blurs = [] }: Props) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const src = images[active] ?? images[0];
  const blur = blurs[active];

  // ── inline hover magnifier (pointer: fine only) ──────────────────────────
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const box = e.currentTarget;
    const r = box.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const img = box.querySelector("img");
    if (img) {
      // Cap the lens so it never magnifies beyond the served resolution.
      const nw = mainNatRef.current.w;
      const max = nw ? Math.max(1.4, Math.min(2.2, nw / r.width)) : 2.2;
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = `scale(${max})`;
    }
  }, []);
  const onLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const img = e.currentTarget.querySelector("img");
    if (img) img.style.transform = "";
  }, []);

  // ── lightbox zoom + pan (imperative for smoothness) ──────────────────────
  const wrapRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number; moved: boolean } | null>(null);
  // Natural (served) pixel sizes, used to cap zoom so it never upscales past the
  // image's real resolution (prevents the pixelated look).
  const lbNatRef = useRef({ w: 0, h: 0 });
  const mainNatRef = useRef({ w: 0, h: 0 });
  // Focus management — close button on open, opener on close (a11y).
  const openerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const apply = useCallback((animate: boolean) => {
    const el = wrapRef.current;
    if (!el) return;
    let z = 1;
    if (zoomRef.current) {
      const r = el.getBoundingClientRect();
      const { w: nw, h: nh } = lbNatRef.current;
      if (nw && nh && r.width && r.height) {
        // Width the image actually occupies (object-fit: contain), then the
        // largest scale that still maps 1 source px ≥ 1 screen px.
        const containW = Math.min(r.width, r.height * (nw / nh));
        z = Math.max(1.4, Math.min(3, nw / containW));
      } else {
        z = 2.4;
      }
    }
    const { x, y } = offsetRef.current;
    el.style.transition = animate ? "transform .25s ease" : "none";
    el.style.transform = `translate(${x}px, ${y}px) scale(${z})`;
    el.style.cursor = zoomRef.current ? "grab" : "zoom-in";
  }, []);

  const reset = useCallback(() => {
    zoomRef.current = false;
    offsetRef.current = { x: 0, y: 0 };
    apply(false);
  }, [apply]);

  const openLightbox = () => {
    setOpen(true);
    requestAnimationFrame(reset);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!zoomRef.current) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, ox: offsetRef.current.x, oy: offsetRef.current.y, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.moved = true;
    offsetRef.current = { x: d.ox + dx, y: d.oy + dy };
    apply(false);
  };
  const onPointerUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d && d.moved) return; // it was a pan, not a tap
    zoomRef.current = !zoomRef.current;
    if (!zoomRef.current) offsetRef.current = { x: 0, y: 0 };
    apply(true);
  };
  const onWheel = (e: React.WheelEvent) => {
    const wantZoom = e.deltaY < 0;
    if (wantZoom === zoomRef.current) return;
    zoomRef.current = wantZoom;
    if (!wantZoom) offsetRef.current = { x: 0, y: 0 };
    apply(true);
  };

  // Esc to close, lock body scroll, and move focus to the close button while
  // open. On close we restore focus to the image that triggered the lightbox.
  useEffect(() => {
    if (!open) {
      openerRef.current?.focus();
      return;
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus the close button once the portal renders.
    const id = requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      cancelAnimationFrame(id);
    };
  }, [open]);

  // Switching photo inside the lightbox resets the zoom.
  useEffect(() => {
    if (open) requestAnimationFrame(reset);
  }, [active, open, reset]);

  return (
    <div>
      {/* Main image — hover to magnify, click to open lightbox */}
      <div
        ref={openerRef}
        className="rb-gallery-main"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={openLightbox}
        role="button"
        tabIndex={0}
        aria-label="Zoom"
        aria-haspopup="dialog"
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openLightbox()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          // Request ~2× the display size so the hover lens stays crisp.
          sizes="(max-width: 760px) 180vw, 110vw"
          placeholder={blur ? "blur" : "empty"}
          blurDataURL={blur}
          quality={90}
          onLoad={(e) => {
            const t = e.currentTarget;
            mainNatRef.current = { w: t.naturalWidth, h: t.naturalHeight };
          }}
          style={{ objectFit: "cover" }}
          priority
        />
        {/* Microcopy intentionally omitted — the cursor and lightbox affordance
            speak for themselves; "fig. 0X" felt too technical. */}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="rb-gallery-thumbs">
          {images.map((img, i) => (
            <button
              key={img + i}
              className={"rb-gallery-thumb" + (i === active ? " is-active" : "")}
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
            >
              <Image src={img} alt="" fill sizes="120px" placeholder={blurs[i] ? "blur" : "empty"} blurDataURL={blurs[i]} style={{ objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox — portaled to <body> so a transformed ancestor (Reveal) can't
          trap the position:fixed overlay. */}
      {open && createPortal(
        <div className="rb-lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={() => setOpen(false)}>
          <button
            ref={closeBtnRef}
            className="rb-lb-close"
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
          <div
            className="rb-lb-stage"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onWheel={onWheel}
          >
            <div className="rb-lb-imgwrap" ref={wrapRef}>
              <Image
                src={src}
                alt={alt}
                fill
                // Large hint so next/image serves the full-resolution source
                // (not a viewport-sized variant) — needed for crisp zoom.
                sizes="200vw"
                quality={95}
                draggable={false}
                onLoad={(e) => {
                  const t = e.currentTarget;
                  lbNatRef.current = { w: t.naturalWidth, h: t.naturalHeight };
                  apply(false);
                }}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
          {images.length > 1 && (
            <div className="rb-lb-thumbs" onClick={(e) => e.stopPropagation()}>
              {images.map((img, i) => (
                <button
                  key={img + i}
                  className={"rb-gallery-thumb" + (i === active ? " is-active" : "")}
                  onClick={() => setActive(i)}
                  aria-label={`View photo ${i + 1}`}
                >
                  <Image src={img} alt="" fill sizes="64px" style={{ objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
