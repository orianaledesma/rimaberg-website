import Link from "next/link";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import type { Product } from "@/data/products";
import type { Locale } from "@/i18n/locales";
import { blurFor } from "@/data/blur";

/**
 * Catalogue tile. Base photo + (optional) hover-swap photo, an overlay with
 * category / name / material, and a meta row underneath. Links to the piece.
 * Server component — resolves its own translations.
 */
export default async function ProductCard({
  product,
  height = 360,
  showMeta = true,
}: {
  product: Product;
  height?: number;
  showMeta?: boolean;
}) {
  const locale = (await getLocale()) as Locale;
  const tCat = await getTranslations("categories");
  const tStatus = await getTranslations("status");

  const swap = product.images[1];
  const material = product.material[locale];

  return (
    <Link href={`/catalogue/${product.id}`} style={{ display: "block" }}>
      <div
        className={"rb-prod " + (swap ? "" : "rb-prod--single")}
        style={{ position: "relative", height, background: "var(--rb-paper-2)" }}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="rb-prod-img rb-prod-img--base"
          placeholder={blurFor(product.images[0]) ? "blur" : "empty"}
          blurDataURL={blurFor(product.images[0])}
          style={{ objectFit: "cover" }}
        />
        {swap && (
          <Image
            src={swap}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="rb-prod-img rb-prod-img--swap"
            style={{ objectFit: "cover" }}
          />
        )}
        <div className="rb-prod-overlay">
          <div className="rb-eyebrow" style={{ opacity: 0.85 }}>
            {tCat(product.category)}
          </div>
          <div style={{ fontSize: 18, fontWeight: 300, marginTop: 4 }}>{product.name}</div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6, letterSpacing: "0.05em" }}>
            {material}
          </div>
        </div>
      </div>

      {showMeta && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginTop: 14,
            color: "var(--rb-ink)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 400 }}>{product.name}</div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.15em",
              opacity: 0.55,
              textTransform: "uppercase",
            }}
          >
            {tStatus(product.status)}
          </div>
        </div>
      )}
    </Link>
  );
}
