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
        <Link href="/about" className="rb-eyebrow" style={{ fontSize: 10, color: ink, opacity: 0.7 }}>
          {t("atelier")}
        </Link>
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
