"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

/**
 * Fades + lifts children into view on scroll via IntersectionObserver. Mirrors
 * the prototype's `.rb-reveal`. `mask` switches to the clip-path wipe variant.
 */
export default function Reveal({
  children,
  delay = 0,
  distance = 28,
  mask = false,
  style,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  mask?: boolean;
  style?: CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let observer: IntersectionObserver | undefined;
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer?.disconnect();
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      observer.observe(el);
    } catch {
      setInView(true);
    }
    const t = setTimeout(() => setInView(true), 4000);
    return () => {
      observer?.disconnect();
      clearTimeout(t);
    };
  }, []);

  const cls = `rb-reveal ${mask ? "rb-reveal--mask" : ""} ${inView ? "is-in" : ""} ${className}`.trim();

  return (
    <div
      ref={ref}
      className={cls}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
        ...(mask ? {} : { transform: inView ? "none" : `translate3d(0, ${distance}px, 0)` }),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
