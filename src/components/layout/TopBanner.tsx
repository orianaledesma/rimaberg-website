"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const COOKIE = "rb-atelier-banner";
const TTL_DAYS = 7;

function readDismissed(): boolean {
  try {
    if (typeof document !== "undefined") {
      const hit = document.cookie.split("; ").find((c) => c.startsWith(COOKIE + "="));
      if (hit) return true;
    }
    if (typeof sessionStorage !== "undefined") {
      return sessionStorage.getItem(COOKIE) === "1";
    }
  } catch {
    /* storage blocked — treat as not dismissed */
  }
  return false;
}

function writeDismissed(): void {
  const maxAge = TTL_DAYS * 24 * 60 * 60;
  try {
    if (typeof document !== "undefined") {
      document.cookie = `${COOKIE}=1; max-age=${maxAge}; path=/; samesite=lax`;
    }
  } catch {
    /* cookies blocked — fall through to session */
  }
  try {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(COOKIE, "1");
    }
  } catch {
    /* ignore */
  }
}

/**
 * Top banner announcing the new atelier in Kaunas. Click the banner area to
 * jump to #atelier; click the X to dismiss for seven days (cookie, with
 * sessionStorage as fallback). The component mounts client-side only — we
 * cannot read the dismiss cookie at build time, and avoiding SSR keeps the
 * markup out of the first paint when the visitor has already dismissed it.
 */
export default function TopBanner() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(true);
  const [closing, setClosing] = useState(false);
  const t = useTranslations("banner");

  useEffect(() => {
    setMounted(true);
    if (readDismissed()) setShow(false);
  }, []);

  if (!mounted || !show) return null;

  const onDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    writeDismissed();
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShow(false);
      return;
    }
    setClosing(true);
    window.setTimeout(() => setShow(false), 200);
  };

  return (
    <aside
      role="region"
      aria-label={t("ariaLabel")}
      className={"rb-banner" + (closing ? " is-closing" : "")}
    >
      <Link href="/#atelier" className="rb-banner-link">
        <span className="rb-banner-desktop">{t("atelierDesktop")}</span>
        <span className="rb-banner-mobile">{t("atelierMobile")}</span>
      </Link>
      <button
        type="button"
        className="rb-banner-dismiss"
        aria-label={t("dismissAria")}
        onClick={onDismiss}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path
            d="M1 1 L11 11 M11 1 L1 11"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </aside>
  );
}
