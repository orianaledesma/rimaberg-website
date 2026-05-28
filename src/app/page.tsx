import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/locales";
import Header from "@/components/layout/Header";
import CategoryNav from "@/components/layout/CategoryNav";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import HeroPieces, { type HeroPiece } from "@/components/sections/HeroPieces";
import FeaturedCarousel, { type CarouselItem } from "@/components/catalogue/FeaturedCarousel";
import CategoryGrid from "@/components/catalogue/CategoryGrid";
import AtelierSection from "@/components/sections/AtelierSection";
import StoreSection from "@/components/sections/StoreSection";
import { getFeatured } from "@/data/products";
import { MANUAL_PRODUCTS } from "@/data/products.manual";
import { blurFor } from "@/data/blur";
import { STORE_MAPS_URL } from "@/data/site";

export default async function HomePage() {
  const t = await getTranslations("home");
  const tStatus = await getTranslations("status");
  const locale = (await getLocale()) as Locale;

  const featured = getFeatured();

  // Hero pieces — six of the seven Carrousel entries, in the exact order Ori
  // confirmed for the launch. Each slide drives the h1 (name) and p (poetic
  // LT/EN caption) of the hero overlay; the carousel state lives in the
  // <HeroPieces /> client component so they stay in lockstep.
  const HERO_ORDER = [
    "fakturos",
    "naktine-zvaigzde",
    "pasirinkimai",
    "pavasario-zydejimas",
    "spalvos-jausmuose",
    "zibejimas",
  ];
  const piecesById = new Map(MANUAL_PRODUCTS.map((p) => [p.id, p]));
  const heroPieces: HeroPiece[] = HERO_ORDER.flatMap((id) => {
    const p = piecesById.get(id);
    if (!p) return [];
    return [{
      id: p.id,
      name: p.name[locale],
      description: p.description[locale],
      src: p.images[0],
      blurDataURL: blurFor(p.images[0]),
    }];
  });

  // One curated strip on the home — Rima's hand-picked `featured` pieces.
  // Shown below the category tiles so the page reads:
  //   hero → catalogue intro → categories → selection → atelier → coming soon.
  const carouselItems: CarouselItem[] = featured.map((p) => ({
    id: p.id,
    name: p.name[locale],
    image: p.images[0],
    blurDataURL: blurFor(p.images[0]),
    statusLabel: tStatus(p.status),
  }));

  return (
    <div className="rb-screen" data-hover="reveal">
      <Header />

      <HeroPieces
        pieces={heroPieces}
        ctaLabel={t("heroCta")}
        ctaHref="/#atelier"
      />


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

        <Reveal delay={120} style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 200, letterSpacing: "-0.01em" }}>
            {t("categoriesTitle")}
          </h3>
        </Reveal>
        <Reveal delay={160}>
          <CategoryGrid />
        </Reveal>

        {/* Single curated strip — Rima's selection, below the categories */}
        {carouselItems.length > 0 && (
          <>
            <Reveal delay={120} style={{ margin: "72px 0 24px" }}>
              <div className="rb-mono" style={{ fontSize: 11, opacity: 0.55 }}>
                {t("exploreMark")}
              </div>
              <h3 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 200, marginTop: 10, letterSpacing: "-0.01em" }}>
                {t("exploreTitle")}
              </h3>
            </Reveal>
            <Reveal delay={160}>
              <FeaturedCarousel
                items={carouselItems}
                viewMoreLabel={t("catViewMore")}
                ariaLabel={t("exploreTitle")}
              />
            </Reveal>
          </>
        )}
      </section>

      <AtelierSection />

      <StoreSection />

      <Footer />
    </div>
  );
}
