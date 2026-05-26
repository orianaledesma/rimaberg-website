"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const KEY = "rb-cookie-ack";

/**
 * Minimal cookie notice — informational only (no tracking, no analytics).
 * The single cookie set by the site is `rb-locale` for language, which is a
 * strictly-necessary functional cookie. We still show a one-time microbar so
 * visitors know what's stored and where to read the policy.
 */
export default function CookieNotice() {
  const [show, setShow] = useState(false);
  const t = useTranslations("cookieNotice");

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) !== "1") setShow(true);
    } catch {
      /* localStorage blocked — silently skip the notice */
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <div
      role="region"
      aria-label={t("aria")}
      className="rb-cookie"
    >
      <p className="rb-cookie-text">
        {t("body")} <Link href="/privacy" className="rb-cookie-link">{t("learnMore")}</Link>
      </p>
      <button type="button" className="rb-cookie-btn" onClick={dismiss}>
        {t("ok")}
      </button>
    </div>
  );
}
