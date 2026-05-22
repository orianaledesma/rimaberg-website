import { getTranslations } from "next-intl/server";
import { STORE_MAPS_URL } from "@/data/site";

/**
 * "Coming soon" band announcing the physical studio-store in central Kaunas.
 * Centred on paper to contrast with the dark Atelier band above it.
 */
export default async function ComingSoon() {
  const t = await getTranslations("comingSoon");
  const tc = await getTranslations("contact");

  return (
    <section
      style={{
        padding: "clamp(72px, 11vw, 140px) clamp(20px, 5vw, 64px)",
        borderTop: "1px solid var(--rb-line)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 20,
      }}
    >
      <div className="rb-mono" style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.55 }}>
        {t("eyebrow")}
      </div>
      <h2
        style={{
          fontSize: "clamp(32px, 5vw, 52px)",
          fontWeight: 200,
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          maxWidth: 640,
          textWrap: "pretty",
        }}
      >
        {t("title")}
      </h2>
      <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.7, maxWidth: 460 }}>{t("text")}</p>
      <div className="rb-mono" style={{ fontSize: 12, opacity: 0.55, marginTop: 4 }}>
        {tc("addressLine1")} · {tc("addressLine2")}
      </div>
      <a
        href={STORE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rb-eyebrow"
        style={{ marginTop: 8, borderBottom: "1px solid var(--rb-ink)", paddingBottom: 6 }}
      >
        {t("cta")}
      </a>
    </section>
  );
}
