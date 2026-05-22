import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Cursor from "@/components/Cursor";
import Reveal from "@/components/Reveal";
import Carousel, { type Slide } from "@/components/Carousel";
import { getFeatured } from "@/data/products";
import { blurFor } from "@/data/blur";

export const metadata: Metadata = { title: "About + Contact" };

export default async function AboutPage() {
  const t = await getTranslations("about");
  const tc = await getTranslations("contact");
  const featured = getFeatured();

  // CONTENT TODO (Rima): replace these atelier/process photos and the portrait
  // below with real studio + portrait photography.
  const atelierSlides: Slide[] = featured.slice(0, 4).map((p, i) => ({
    src: p.images[0],
    caption: `fig. 0${i + 1}`,
    blurDataURL: blurFor(p.images[0]),
  }));
  const portrait = featured[0]?.images[0] ?? "/products/ADDI7571.JPG";

  return (
    <div className="rb-screen">
      <Cursor>
        <Header tone="light" />
        <CategoryNav active="all" />

        {/* Intro split */}
        <section
          className="rb-collapse"
          style={{
            padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 64px) 80px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          <Reveal>
            <div className="rb-eyebrow" style={{ opacity: 0.55 }}>
              {t("eyebrow")}
            </div>
            <h1
              style={{
                fontSize: "clamp(44px, 8vw, 72px)",
                fontWeight: 200,
                marginTop: 24,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                textWrap: "pretty",
              }}
            >
              {t("titleLine1")}
              <br />
              {t("titleLine2In")} <em style={{ fontWeight: 200 }}>{t("titleEm")}</em>.
            </h1>
            <div className="rb-script" style={{ fontSize: "clamp(48px, 8vw, 64px)", marginTop: 36, opacity: 0.85 }}>
              Rima Berg
            </div>
          </Reveal>
          <Reveal delay={120} style={{ paddingTop: 80 }}>
            <p style={{ fontSize: 16, lineHeight: 1.65, opacity: 0.78, textWrap: "pretty" }}>{t("p1")}</p>
            <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.6, marginTop: 24 }}>{t("p2")}</p>
          </Reveal>
        </section>

        {/* Atelier carousel */}
        <section style={{ padding: "0 clamp(20px, 5vw, 64px) 96px" }}>
          <Reveal style={{ height: "min(640px, 70vh)" }}>
            <Carousel slides={atelierSlides} height={640} interval={5200} />
          </Reveal>
        </section>

        {/* Portrait */}
        <section
          className="rb-collapse"
          style={{
            padding: "0 clamp(20px, 5vw, 64px) 96px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          <Reveal>
            <div className="rb-eyebrow" style={{ opacity: 0.55 }}>
              {t("artistEyebrow")}
            </div>
            <h2 style={{ fontSize: "clamp(32px, 5vw, 42px)", fontWeight: 200, marginTop: 16, lineHeight: 1.05, letterSpacing: "-0.015em" }}>
              {t("artistTitle")}
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.7, marginTop: 24, maxWidth: 360 }}>
              {t("artistText")}
            </p>
          </Reveal>
          <Reveal delay={140} style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", background: "var(--rb-paper-2)" }}>
            <Image
              src={portrait}
              alt={t("artistTitle")}
              fill
              sizes="(max-width: 760px) 100vw, 45vw"
              placeholder={blurFor(portrait) ? "blur" : "empty"}
              blurDataURL={blurFor(portrait)}
              style={{ objectFit: "cover" }}
            />
          </Reveal>
        </section>

        {/* Dark contact band */}
        <section
          className="rb-collapse"
          style={{
            background: "var(--rb-noir)",
            color: "#fafafa",
            padding: "96px clamp(20px, 5vw, 64px)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 64,
          }}
        >
          <Reveal>
            <div className="rb-eyebrow" style={{ opacity: 0.5 }}>
              {tc("contactLabel")}
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.6, marginTop: 16 }}>
              <a href={`mailto:${tc("email")}`}>{tc("email")}</a>
              <br />
              <a href={`tel:${tc("phone").replace(/\s/g, "")}`}>{tc("phone")}</a>
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div className="rb-eyebrow" style={{ opacity: 0.5 }}>
              {tc("atelierLabel")}
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.6, marginTop: 16 }}>
              {tc("addressLine1")}
              <br />
              {tc("addressLine2")}
            </p>
          </Reveal>
          <Reveal delay={160}>
            <div className="rb-eyebrow" style={{ opacity: 0.5 }}>
              {tc("hoursLabel")}
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.6, marginTop: 16 }}>
              {tc("hoursLine1")}
              <br />
              {tc("hoursLine2")}
            </p>
          </Reveal>
        </section>
      </Cursor>
    </div>
  );
}
