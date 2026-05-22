import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Carousel, { type Slide } from "@/components/Carousel";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import AtelierSection from "@/components/AtelierSection";
import { getFeatured, getAllProducts } from "@/data/products";

export default async function HomePage() {
  const t = await getTranslations("home");
  const featured = getFeatured();
  const grid = getAllProducts().slice(0, 5);

  const heroSlides: Slide[] = featured.slice(0, 4).map((p) => ({ src: p.images[0] }));

  return (
    <div className="rb-screen" data-hover="reveal">
      <Cursor>
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
            <Reveal style={{ maxWidth: 720 }}>
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

        {/* Asymmetric editorial catalogue teaser (Direction C) */}
        <section style={{ padding: "clamp(56px, 9vw, 96px) clamp(20px, 5vw, 64px) 120px" }}>
          <Reveal
            className="rb-collapse"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(180px, 280px) 1fr auto",
              gap: 64,
              marginBottom: 64,
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
            <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.7, maxWidth: 520, alignSelf: "center" }}>
              {t("catLead")}
            </p>
            <Link
              href="/catalogue"
              className="rb-eyebrow"
              style={{
                alignSelf: "end",
                whiteSpace: "nowrap",
                borderBottom: "1px solid var(--rb-ink)",
                paddingBottom: 6,
              }}
            >
              {t("allPieces")}
            </Link>
          </Reveal>

          <div className="rb-grid-12">
            <Reveal style={{ gridColumn: "span 5", gridRow: "span 2" }}>
              <ProductCard product={grid[0]} height={560} />
            </Reveal>
            <Reveal delay={80} style={{ gridColumn: "span 3" }}>
              <ProductCard product={grid[1]} height={270} />
            </Reveal>
            <Reveal delay={160} style={{ gridColumn: "span 4" }}>
              <ProductCard product={grid[2]} height={270} />
            </Reveal>
            <Reveal delay={120} style={{ gridColumn: "span 4" }}>
              <ProductCard product={grid[3]} height={270} />
            </Reveal>
            <Reveal delay={200} style={{ gridColumn: "span 3" }}>
              <ProductCard product={grid[4]} height={270} />
            </Reveal>
          </div>
        </section>

        <AtelierSection />

        <Footer />
      </Cursor>
    </div>
  );
}
