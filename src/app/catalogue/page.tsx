import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/locales";
import Header from "@/components/layout/Header";
import CategoryNav from "@/components/layout/CategoryNav";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import FeaturedCarousel, { type CarouselItem } from "@/components/catalogue/FeaturedCarousel";
import ProductTileGrid from "@/components/catalogue/ProductTileGrid";
import {
  getAllProducts,
  getByCategory,
  getNew,
  getFeatured,
  type Product,
} from "@/data/products";
import { PRODUCT_CATEGORIES, type CategorySlug } from "@/data/categories";
import { blurFor } from "@/data/blur";

export const metadata: Metadata = { title: "Catalogue" };

function resolveItems(category: string): Product[] {
  if (category === "new") return getNew();
  if (PRODUCT_CATEGORIES.includes(category as CategorySlug)) {
    return getByCategory(category as CategorySlug);
  }
  return getAllProducts();
}

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = "all" } = await searchParams;
  const t = await getTranslations("catalogue");
  const tCat = await getTranslations("categories");
  const locale = (await getLocale()) as Locale;

  const items = resolveItems(category);
  const isAll = category === "all";
  const catKey = category === "new" ? "whatsNew" : category;
  const heading = isAll ? t("allTitle") : tCat(catKey);

  // Curated strip, tied to the active category nav: on "all" it highlights the
  // featured set; on a category it highlights that category's featured pieces,
  // falling back to all pieces in scope so the strip always mirrors the grid.
  const carouselSource = (() => {
    if (isAll) {
      const featured = getFeatured();
      return featured.length > 1 ? featured : getAllProducts().slice(0, 8);
    }
    const featuredInCategory = items.filter((p) => p.featured);
    return featuredInCategory.length > 0 ? featuredInCategory : items;
  })();
  const carouselItems: CarouselItem[] = carouselSource.map((p) => ({
    id: p.id,
    name: p.name[locale],
    image: p.images[0],
    blurDataURL: blurFor(p.images[0]),
  }));

  return (
    <div className="rb-screen" data-hover="reveal">
        <Header />
        <CategoryNav active={isAll ? "all" : category} />

        {/* Heading */}
        <section style={{ padding: "clamp(40px, 6vw, 64px) clamp(20px, 5vw, 64px) 32px" }}>
          <Reveal>
            <h1
              style={{
                fontSize: "clamp(40px, 7vw, 64px)",
                fontWeight: 200,
                marginTop: 16,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              {heading}
              <span className="rb-mono" style={{ fontSize: 12, opacity: 0.4, letterSpacing: "0.04em", fontWeight: 400 }}>
                {t("pieces", { count: items.length })}
              </span>
            </h1>
          </Reveal>
        </section>

        {/* Curated horizontal carousel — swipeable on mobile */}
        {carouselItems.length > 0 && (
          <section style={{ padding: "8px clamp(20px, 5vw, 64px) 64px" }}>
            <Reveal delay={120}>
              <FeaturedCarousel
                items={carouselItems}
                viewMoreLabel={t("viewMore")}
                ariaLabel={t("featuredTitle")}
              />
            </Reveal>
          </section>
        )}

        {/* Product tile grid — labelled tiles, three-up / two-up on mobile */}
        <section style={{ padding: "16px clamp(20px, 5vw, 64px) 96px" }}>
          {items.length === 0 ? (
            <p style={{ opacity: 0.6, fontSize: 14, padding: "48px 0" }}>{t("empty")}</p>
          ) : (
            <Reveal>
              <ProductTileGrid products={items} />
            </Reveal>
          )}
        </section>

        <Footer />
    </div>
  );
}
