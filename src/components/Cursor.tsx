"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps a screen and draws a small mix-blend dot that follows the pointer,
 * hiding the native cursor inside the surface. Mirrors the prototype's Cursor.
 */
export default function Cursor({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const dot = dotRef.current;
    if (!el || !dot) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      dot.style.left = `${e.clientX - r.left}px`;
      dot.style.top = `${e.clientY - r.top}px`;
      dot.style.opacity = "1";
    };
    const onLeave = () => {
      dot.style.opacity = "0";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="rb-canvas-cursor" style={{ position: "relative" }}>
      {children}
      <div ref={dotRef} className="rb-cursor" style={{ opacity: 0, color: "currentColor", position: "fixed" }} />
    </div>
  );
}
