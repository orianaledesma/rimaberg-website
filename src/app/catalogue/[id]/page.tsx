import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Header from "@/components/layout/Header";
import CategoryNav from "@/components/layout/CategoryNav";
import Reveal from "@/components/ui/Reveal";
import ProductCard from "@/components/catalogue/ProductCard";
import ProductGallery from "@/components/catalogue/ProductGallery";
import { getAllProducts, getProductById, getRelated, isPublishable } from "@/data/products";
import { blurFor } from "@/data/blur";
import type { Locale } from "@/i18n/locales";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Not found" };
  const locale = (await getLocale()) as Locale;
  return { title: product.name[locale] };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product || !isPublishable(product)) notFound();

  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("detail");
  const tCat = await getTranslations("categories");
  const tAbout = await getTranslations("about");

  const related = getRelated(id);
  // The gallery shows the piece's own photos (first is primary).
  const galleryImages = product.images;

  const name = product.name[locale];
  const subject = t("enquireSubject", { name, code: product.code });
  const mailto = `mailto:info@rimaberg.com?subject=${encodeURIComponent(subject)}`;

  return (
    <div className="rb-screen">
        <Header />
        <CategoryNav active={product.category} />

        <div
          className="rb-mono"
          style={{ padding: "24px clamp(20px, 5vw, 64px) 0", fontSize: 11, opacity: 0.55, letterSpacing: "0.1em" }}
        >
          {t("breadcrumbHome")} / {tCat(product.category)} / {name}
        </div>

        <section
          className="rb-collapse rb-detail-grid"
          style={{
            padding: "32px clamp(20px, 5vw, 64px) 80px",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 64,
            alignItems: "start",
          }}
        >
          {/* Gallery — hover to magnify, click for fullscreen zoom */}
          <div>
            <ProductGallery
              images={galleryImages}
              alt={name}
              blurs={galleryImages.map((src) => blurFor(src))}
            />
          </div>

          {/* Detail aside */}
          <aside className="rb-detail-aside" style={{ position: "sticky", top: 96, display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="rb-mono" style={{ fontSize: 11, opacity: 0.55 }}>
              — {product.code}
            </div>
            <h1 style={{ fontSize: "clamp(40px, 6vw, 56px)", fontWeight: 200, lineHeight: 1, letterSpacing: "-0.02em" }}>
              {name}
            </h1>
            {product.description[locale]?.trim() && (
              <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.78, marginTop: 8 }}>
                {product.description[locale]}
              </p>
            )}

            <div
              className="rb-mono"
              style={{ marginTop: 4, fontSize: 11, opacity: 0.6, letterSpacing: "0.12em", textTransform: "uppercase" }}
            >
              {tAbout("uniqueLine")}
            </div>

            <dl
              style={{
                marginTop: 8,
                paddingTop: 24,
                borderTop: "1px solid var(--rb-line)",
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                rowGap: 14,
                fontSize: 13,
                margin: 0,
              }}
            >
              {product.material[locale]?.trim() && (
                <>
                  <dt className="rb-eyebrow" style={{ opacity: 0.5 }}>{t("labels.metal")}</dt>
                  <dd style={{ margin: 0 }}>{product.material[locale]}</dd>
                </>
              )}
              {product.stones[locale]?.trim() && (
                <>
                  <dt className="rb-eyebrow" style={{ opacity: 0.5 }}>{t("labels.stones")}</dt>
                  <dd style={{ margin: 0 }}>{product.stones[locale]}</dd>
                </>
              )}
              {product.sizes[locale]?.trim() && (
                <>
                  <dt className="rb-eyebrow" style={{ opacity: 0.5 }}>{t("labels.size")}</dt>
                  <dd style={{ margin: 0 }}>{product.sizes[locale]}</dd>
                </>
              )}
              {product.leadTime[locale]?.trim() && (
                <>
                  <dt className="rb-eyebrow" style={{ opacity: 0.5 }}>{t("labels.leadTime")}</dt>
                  <dd style={{ margin: 0 }}>{product.leadTime[locale]}</dd>
                </>
              )}
            </dl>

            <a
              href={mailto}
              style={{
                marginTop: 28,
                padding: "20px 24px",
                background: "var(--rb-ink)",
                color: "var(--rb-bg)",
                fontSize: 11,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              {t("enquire")}
            </a>
          </aside>
        </section>

        {/* Related */}
        <section style={{ padding: "64px clamp(20px, 5vw, 64px) 96px", borderTop: "1px solid var(--rb-line)" }}>
          <Reveal className="rb-mono" style={{ fontSize: 11, opacity: 0.55, marginBottom: 32 }}>
            — {t("related")}
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>
            {related.map((q, i) => (
              <Reveal key={q.id} delay={i * 80}>
                <ProductCard product={q} height={360} />
              </Reveal>
            ))}
          </div>
        </section>
    </div>
  );
}
