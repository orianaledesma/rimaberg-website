import Link from "next/link";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import type { Product } from "@/data/products";
import type { Locale } from "@/i18n/locales";
import { blurFor } from "@/data/blur";

/**
 * Square product tiles with a label kept permanently on the image (category
 * eyebrow + name), over a bottom gradient — the "shop the grid" treatment.
 * Three-up on desktop, two-up on mobile. Server component.
 */
export default async function ProductTileGrid({ products }: { products: Product[] }) {
  const locale = (await getLocale()) as Locale;
  const tCat = await getTranslations("categories");

  return (
    <div className="rb-tile-grid">
      {products.map((p) => (
        <Link key={p.id} href={`/catalogue/${p.id}`} className="rb-tile">
          <Image
            src={p.images[0]}
            alt={p.name[locale]}
            fill
            sizes="(max-width: 860px) 50vw, 33vw"
            placeholder={blurFor(p.images[0]) ? "blur" : "empty"}
            blurDataURL={blurFor(p.images[0])}
            className="rb-tile-img"
            style={{ objectFit: "cover" }}
          />
          <div className="rb-tile-label">
            <span className="rb-eyebrow rb-tile-cat">{tCat(p.category)}</span>
            <span className="rb-tile-name">{p.name[locale]}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
