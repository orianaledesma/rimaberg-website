import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import { getAllProducts, getByCategory, getNew, type Product } from "@/data/products";
import { PRODUCT_CATEGORIES, type CategorySlug } from "@/data/categories";

export const metadata: Metadata = { title: "Catalogue" };

/** Editorial span pattern, cycled across the grid for visual rhythm. */
const SPAN_PATTERN: Array<{ c: number; r?: number }> = [
  { c: 5, r: 2 },
  { c: 3 },
  { c: 4 },
  { c: 4 },
  { c: 3 },
  { c: 4 },
  { c: 4 },
  { c: 4 },
];

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

  const items = resolveItems(category);
  const isAll = category === "all";
  const catKey = category === "new" ? "whatsNew" : category;
  const heading = isAll ? t("allTitle") : tCat(catKey);

  return (
    <div className="rb-screen" data-hover="reveal">
      <Cursor>
        <Header tone="light" />
        <CategoryNav active={isAll ? "all" : category} />

        {/* Heading row */}
        <section
          className="rb-collapse"
          style={{
            padding: "clamp(40px, 6vw, 64px) clamp(20px, 5vw, 64px) 32px",
            display: "grid",
            gridTemplateColumns: "minmax(180px, 280px) 1fr minmax(180px, 280px)",
            gap: 48,
            alignItems: "end",
          }}
        >
          <Reveal>
            <div className="rb-mono" style={{ fontSize: 11, opacity: 0.55 }}>
              {t("indexMark", { category: heading })}
            </div>
            <h1 style={{ fontSize: "clamp(40px, 7vw, 64px)", fontWeight: 200, marginTop: 16, letterSpacing: "-0.02em", lineHeight: 1 }}>
              {heading}
            </h1>
          </Reveal>
          <div className="rb-mono" style={{ fontSize: 11, opacity: 0.5, textAlign: "center", paddingBottom: 12 }}>
            — {t("pieces", { count: items.length })} —
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 20, alignItems: "center", paddingBottom: 12 }}>
            <button className="rb-eyebrow" style={{ opacity: 0.65, background: "none", border: "none", cursor: "pointer" }}>
              {t("filter")} ⊕
            </button>
            <button className="rb-eyebrow" style={{ background: "none", border: "none", cursor: "pointer" }}>
              {t("sort")} ↓
            </button>
          </div>
        </section>

        {/* Grid */}
        <section style={{ padding: "32px clamp(20px, 5vw, 64px) 96px" }}>
          {items.length === 0 ? (
            <p style={{ opacity: 0.6, fontSize: 14, padding: "48px 0" }}>{t("empty")}</p>
          ) : (
            <div className="rb-grid-12">
              {items.map((p, i) => {
                const span = SPAN_PATTERN[i % SPAN_PATTERN.length];
                return (
                  <Reveal
                    key={p.id}
                    delay={(i % 3) * 80}
                    style={{ gridColumn: `span ${span.c}`, gridRow: span.r ? `span ${span.r}` : undefined }}
                  >
                    <ProductCard product={p} height={span.r ? 560 : span.c >= 4 ? 340 : 270} />
                  </Reveal>
                );
              })}
            </div>
          )}
        </section>

        <Footer />
      </Cursor>
    </div>
  );
}
