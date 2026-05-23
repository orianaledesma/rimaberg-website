import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Header from "@/components/layout/Header";
import CategoryNav from "@/components/layout/CategoryNav";
import Footer from "@/components/layout/Footer";
import Carousel, { type Slide } from "@/components/ui/Carousel";
import Reveal from "@/components/ui/Reveal";
import FeaturedCarousel, { type CarouselItem } from "@/components/catalogue/FeaturedCarousel";
import CategoryGrid from "@/components/catalogue/CategoryGrid";
import AtelierSection from "@/components/sections/AtelierSection";
import ComingSoon from "@/components/sections/ComingSoon";
import { getFeatured } from "@/data/products";
import { blurFor } from "@/data/blur";
import { STORE_MAPS_URL } from "@/data/site";

export default async function HomePage() {
  const t = await getTranslations("home");
  const tStatus = await getTranslations("status");

  const featured = getFeatured();

  const heroSlides: Slide[] = featured
    .slice(0, 4)
    .map((p) => ({ src: p.images[0], blurDataURL: blurFor(p.images[0]) }));

  const carouselItems: CarouselItem[] = featured.map((p) => ({
    id: p.id,
    name: p.name,
    image: p.images[0],
    blurDataURL: blurFor(p.images[0]),
    statusLabel: tStatus(p.status),
  }));

  return (
    <div className="rb-screen" data-hover="reveal">
      <Header tone="light" />

      {/* Black hero with full-bleed atelier carousel + overlay copy */}
      <section
        style={{
          position: "relative",
          height: "min(760px, 86vh)",
          background: "var(--rb-noir)",
          overflow: "hidden",
          color: "#fafafa",
        }}
      >
        <Carousel slides={heroSlides} height={760} interval={5200} showCounter={false} priority />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(110deg, rgba(0,0,0,0.72), rgba(0,0,0,0.15) 55%, transparent 80%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="rb-hero-overlay"
          style={{
            position: "absolute",
            inset: 0,
            padding: "clamp(56px, 9vw, 110px) clamp(20px, 5vw, 64px) clamp(48px, 8vw, 100px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pointerEvents: "none",
          }}
        >
          <Reveal className="rb-hero-head" style={{ maxWidth: 720 }}>
            <div className="rb-eyebrow" style={{ opacity: 0.75 }}>
              {t("heroEyebrow")}
            </div>
            <h1
              style={{
                fontSize: "clamp(48px, 8vw, 96px)",
                fontWeight: 200,
                lineHeight: 0.94,
                letterSpacing: "-0.025em",
                marginTop: 28,
                textWrap: "pretty",
              }}
            >
              {t("heroLine1")}{" "}
              <em style={{ fontStyle: "italic", fontWeight: 200 }}>{t("heroEm")}</em>
              <br />
              {t("heroLine2")}
            </h1>
          </Reveal>
          <Reveal
            delay={200}
            className="rb-hero-foot"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              pointerEvents: "auto",
              gap: 64,
              flexWrap: "wrap",
            }}
          >
            <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.78, maxWidth: 360 }}>
              {t("heroLead")}
            </p>
            <Link
              href="/catalogue"
              style={{
                color: "#fafafa",
                borderBottom: "1px solid #fafafa",
                paddingBottom: 4,
                fontSize: 12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {t("heroCta")}
            </Link>
          </Reveal>
        </div>
      </section>

      <CategoryNav active="all" />

      {/* Catalogue: section intro → featured carousel → tile grid */}
      <section style={{ padding: "clamp(56px, 9vw, 96px) clamp(20px, 5vw, 64px) clamp(64px, 9vw, 120px)" }}>
        <Reveal
          className="rb-collapse"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(180px, 280px) 1fr auto",
            gap: 64,
            marginBottom: 56,
          }}
        >
          <div>
            <div className="rb-mono" style={{ fontSize: 11, opacity: 0.55 }}>
              {t("catMark")}
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 200, marginTop: 12, letterSpacing: "-0.015em" }}>
              {t("catTitle")}
            </h2>
          </div>
          <div style={{ alignSelf: "center", maxWidth: 520 }}>
            <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.7 }}>{t("catLead")}</p>
            <a
              href={STORE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rb-btn"
              style={{ marginTop: 18 }}
            >
              {t("catVisit")}
            </a>
          </div>
          <Link href="/catalogue" className="rb-btn" style={{ alignSelf: "end", whiteSpace: "nowrap" }}>
            {t("allPieces")}
          </Link>
        </Reveal>

        <Reveal style={{ marginBottom: 64 }}>
          <FeaturedCarousel
            items={carouselItems}
            viewMoreLabel={t("catViewMore")}
            ariaLabel={t("catTitle")}
          />
        </Reveal>

        <Reveal delay={120} style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 200, letterSpacing: "-0.01em" }}>
            {t("categoriesTitle")}
          </h3>
        </Reveal>
        <Reveal delay={160}>
          <CategoryGrid />
        </Reveal>
      </section>

      <AtelierSection />

      <ComingSoon />

      <Footer />
    </div>
  );
}
