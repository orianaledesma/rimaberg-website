import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Carousel, { type Slide } from "./Carousel";
import Reveal from "./Reveal";
import { getFeatured } from "@/data/products";

/**
 * Dark "Atelier" band for the home page: studio copy on the left, an
 * auto-advancing carousel on the right, and the primary route into /about.
 * Ported from the seccion.html handoff.
 */
export default async function AtelierSection() {
  const t = await getTranslations("home");
  const slides: Slide[] = getFeatured()
    .slice(0, 4)
    .map((p, i) => ({ src: p.images[0], caption: `fig. 0${i + 1}` }));

  return (
    <section
      className="rb-collapse"
      style={{
        background: "var(--rb-noir)",
        color: "#fafafa",
        padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 64px)",
        display: "grid",
        gridTemplateColumns: "1fr 1.1fr",
        gap: 80,
        alignItems: "center",
      }}
    >
      <Reveal>
        <div className="rb-eyebrow" style={{ opacity: 0.5 }}>
          {t("atelierEyebrow")}
        </div>
        <h2
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 200,
            lineHeight: 1.04,
            letterSpacing: "-0.018em",
            marginTop: 32,
            textWrap: "pretty",
          }}
        >
          {t("atelierTitle")}
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.7, maxWidth: 440, marginTop: 28 }}>
          {t("atelierText")}
        </p>
        <div style={{ marginTop: 44, display: "flex", gap: 32, alignItems: "center" }}>
          <Link
            href="/about"
            style={{
              color: "#fafafa",
              fontSize: 11,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              borderBottom: "1px solid #fafafa",
              paddingBottom: 6,
            }}
          >
            {t("aboutCta")}
          </Link>
          <Link
            href="/about"
            style={{
              color: "#fafafa",
              opacity: 0.5,
              fontSize: 11,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            {t("processCta")}
          </Link>
        </div>
      </Reveal>

      <Reveal delay={150} style={{ height: "min(520px, 70vh)" }}>
        <Carousel slides={slides} height={520} interval={4400} showNav={false} />
      </Reveal>
    </section>
  );
}
