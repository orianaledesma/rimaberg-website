"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Logo from "./Logo";
import { setLocale } from "@/i18n/actions";
import { LOCALES, LOCALE_SHORT, type Locale } from "@/i18n/locales";

type NavItem = { href: string; key: "catalogue" | "atelier" | "about" | "contact" };
const NAV: NavItem[] = [
  { href: "/catalogue", key: "catalogue" },
  { href: "/#atelier", key: "atelier" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
];

/**
 * Sticky split-nav header. Layout:
 *   [ Catalogue · Atelier · About · Contact ]  [ LOGO ]  [ EN / LT · Contact ]
 * On mobile the left nav collapses to a hamburger that opens a slide-in drawer.
 * Scrolling past the sentinel toggles `data-scrolled="true"` on <html>, which
 * the tokens use to shrink --rb-logo-h / --rb-header-h / --rb-header-pad-y.
 *
 * The component is client-side so it can:
 *   · observe the scroll sentinel without a scroll listener,
 *   · manage the drawer (open/close, focus trap, body scroll lock, Escape),
 *   · track the active link via `usePathname()` (including the /#atelier hash).
 */
export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Drawer state
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Shrink: sentinel + IntersectionObserver, no scroll listener.
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const root = document.documentElement;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          root.removeAttribute("data-scrolled");
        } else {
          root.setAttribute("data-scrolled", "true");
        }
      },
      { rootMargin: "0px", threshold: 0 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      root.removeAttribute("data-scrolled");
    };
  }, []);

  // Drawer side effects: lock scroll, Escape closes, focus management.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const hamburger = hamburgerRef.current; // capture for cleanup
    html.classList.add("rb-no-scroll");
    document.body.classList.add("rb-no-scroll");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // Move focus to the drawer's close button on the next frame.
    const id = window.requestAnimationFrame(() => {
      const closeBtn = drawerRef.current?.querySelector<HTMLButtonElement>(
        "[data-drawer-close]"
      );
      closeBtn?.focus();
    });
    return () => {
      html.classList.remove("rb-no-scroll");
      document.body.classList.remove("rb-no-scroll");
      document.removeEventListener("keydown", onKey);
      window.cancelAnimationFrame(id);
      hamburger?.focus();
    };
  }, [open]);

  const isActive = (item: NavItem): boolean => {
    if (item.key === "atelier") {
      // Atelier link points at the home anchor — active on the home route.
      return pathname === "/" || pathname === "";
    }
    if (item.href === "/catalogue") {
      return pathname.startsWith("/catalogue");
    }
    return pathname === item.href;
  };

  const changeLocale = (loc: Locale) =>
    startTransition(async () => {
      await setLocale(loc);
      router.refresh();
    });

  return (
    <>
      {/* The sentinel sits at the very top of the document; once it scrolls
          out of view the header switches to its "scrolled" state. */}
      <div ref={sentinelRef} className="rb-scroll-sentinel" aria-hidden="true" />

      <header className="rb-header">
        {/* Left: hamburger (mobile) + primary nav (desktop) */}
        <div className="rb-header-left">
          <button
            ref={hamburgerRef}
            type="button"
            className="rb-hamburger"
            aria-label={t("openMenu")}
            aria-expanded={open}
            aria-controls="rb-drawer"
            onClick={() => setOpen(true)}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
              <path
                d="M0 1h20M0 7h20M0 13h20"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <nav className="rb-header-nav" aria-label={t("primaryAria")}>
            {NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={isActive(item) ? "is-active" : undefined}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: wordmark */}
        <div className="rb-header-center">
          <Link href="/" aria-label={t("logoAria")}>
            <Logo />
          </Link>
        </div>

        {/* Right: lang switcher */}
        <div className="rb-header-right">
          <div
            role="group"
            aria-label="Language"
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              opacity: pending ? 0.5 : 1,
            }}
          >
            {LOCALES.map((loc) => {
              const active = loc === locale;
              const swKey = loc === "en" ? "langSwitchToEn" : "langSwitchToLt";
              return (
                <button
                  key={loc}
                  type="button"
                  className="rb-eyebrow"
                  aria-current={active ? "true" : undefined}
                  aria-pressed={active}
                  aria-label={t(swKey)}
                  onClick={() => changeLocale(loc)}
                  style={{
                    fontSize: 10,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "inherit",
                    opacity: active ? 1 : 0.5,
                    padding: 4,
                  }}
                >
                  {LOCALE_SHORT[loc]}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Drawer backdrop + panel — rendered always so the slide animation can
          run; visibility is driven by .is-open. */}
      <div
        className={"rb-drawer-backdrop" + (open ? " is-open" : "")}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        id="rb-drawer"
        ref={drawerRef}
        className={"rb-drawer" + (open ? " is-open" : "")}
        role="dialog"
        aria-modal="true"
        aria-label={t("drawerAria")}
        aria-hidden={!open}
      >
        <button
          type="button"
          data-drawer-close
          className="rb-drawer-close"
          aria-label={t("closeMenu")}
          onClick={() => setOpen(false)}
        >
          ✕
        </button>
        <nav className="rb-drawer-items" aria-label={t("primaryAria")}>
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={isActive(item) ? "is-active" : undefined}
              onClick={() => setOpen(false)}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <div className="rb-drawer-divider" />
        <div className="rb-drawer-lang">
          {LOCALES.map((loc) => {
            const active = loc === locale;
            const swKey = loc === "en" ? "langSwitchToEn" : "langSwitchToLt";
            return (
              <button
                key={loc}
                type="button"
                aria-current={active ? "true" : undefined}
                aria-pressed={active}
                aria-label={t(swKey)}
                onClick={() => changeLocale(loc)}
                className={active ? "is-active" : undefined}
              >
                {LOCALE_SHORT[loc]}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
