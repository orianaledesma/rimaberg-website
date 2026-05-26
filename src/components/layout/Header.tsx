import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Logo from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";

/**
 * Sticky black header — Atelier link · centred wordmark · language switch.
 * Always renders dark for a consistent brand anchor across light and dark
 * pages; the hairline border keeps a soft separation from the hero.
 */
export default async function Header() {
  const t = await getTranslations("header");

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px clamp(20px, 4vw, 56px)",
        color: "#fafafa",
        borderBottom: "1px solid rgba(255, 255, 255, 0.14)",
        boxShadow: "0 1px 0 rgba(0, 0, 0, 0.6)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "var(--rb-noir)",
      }}
    >
      <nav style={{ display: "flex", gap: 22, alignItems: "center", minWidth: 80 }}>
        <Link href="/about" className="rb-eyebrow" style={{ fontSize: 10, color: "#fafafa", opacity: 0.7 }}>
          {t("atelier")}
        </Link>
        <Link href="/ring-size" className="rb-eyebrow rb-nav-extra" style={{ fontSize: 10, color: "#fafafa", opacity: 0.7 }}>
          {t("ringSize")}
        </Link>
      </nav>

      <Link href="/" aria-label="Rima Berg — home">
        <Logo />
      </Link>

      <nav style={{ display: "flex", gap: 22, alignItems: "center", minWidth: 80, justifyContent: "flex-end" }}>
        <Link href="/contact" className="rb-eyebrow rb-nav-extra" style={{ fontSize: 10, color: "#fafafa", opacity: 0.7 }}>
          {t("contact")}
        </Link>
        <LocaleSwitcher tone="dark" />
      </nav>
    </header>
  );
}
