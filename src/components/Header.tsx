import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Logo from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";

/**
 * Sticky header: search affordance · centred wordmark · language switch.
 * `tone` flips the colour scheme for the rare dark-background page.
 */
export default async function Header({ tone = "light" }: { tone?: "light" | "dark" }) {
  const t = await getTranslations("header");
  const ink = tone === "dark" ? "#fafafa" : "var(--rb-ink)";
  const line = tone === "dark" ? "var(--rb-line-dark)" : "var(--rb-line)";
  const bg = tone === "dark" ? "var(--rb-noir)" : "var(--rb-bg)";

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "22px clamp(20px, 4vw, 56px)",
        color: ink,
        borderBottom: `1px solid ${line}`,
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: bg,
      }}
    >
      <div style={{ display: "flex", gap: 24, alignItems: "center", minWidth: 80 }}>
        <button
          type="button"
          aria-label={t("search")}
          style={{ display: "flex", alignItems: "center", gap: 8, color: ink, opacity: 0.7, background: "none", border: "none", cursor: "pointer" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" />
            <path d="M9.5 9.5l3 3" stroke="currentColor" strokeLinecap="round" />
          </svg>
          <span className="rb-eyebrow" style={{ fontSize: 10 }}>
            {t("search")}
          </span>
        </button>
      </div>

      <Link href="/" aria-label="Rima Berg — home">
        <Logo tone={tone === "dark" ? "light" : "dark"} size={14} />
      </Link>

      <div style={{ display: "flex", minWidth: 80, justifyContent: "flex-end" }}>
        <LocaleSwitcher tone={tone} />
      </div>
    </header>
  );
}
