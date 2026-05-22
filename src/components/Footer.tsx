import Link from "next/link";
import { getTranslations } from "next-intl/server";

/** Site footer: copyright + social/contact links. */
export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer
      style={{
        padding: "48px clamp(20px, 4vw, 64px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
        borderTop: "1px solid var(--rb-line)",
      }}
    >
      <span className="rb-mono" style={{ fontSize: 11, opacity: 0.5 }}>
        {t("copyright")}
      </span>
      <div style={{ display: "flex", gap: 24 }}>
        <a className="rb-eyebrow" style={{ opacity: 0.55 }} href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          {t("instagram")}
        </a>
        <a className="rb-eyebrow" style={{ opacity: 0.55 }} href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          {t("facebook")}
        </a>
        <Link className="rb-eyebrow" style={{ opacity: 0.55 }} href="/about">
          {t("contact")}
        </Link>
      </div>
    </footer>
  );
}
