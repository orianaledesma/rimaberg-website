import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getByCategory, getAllProducts } from "@/data/products";
import { blurFor } from "@/data/blur";
import type { CategorySlug } from "@/data/categories";

interface CategoryTile {
  /** i18n key under `categories`. */
  key: string;
  /** Catalogue link. */
  href: string;
  /** Representative photo. */
  image: string;
}

/** First photo of a category, with a graceful fallback to any piece. */
function pickImage(category: CategorySlug): string {
  const inCategory = getByCategory(category)[0];
  return (inCategory ?? getAllProducts()[0]).images[0];
}

/**
 * Home category showcase — four tiles (earrings · rings · pendants · other),
 * each a photo with the category name on a translucent rule across the top.
 * "Other" links to the full catalogue; the rest deep-link to their filter.
 */
export default async function CategoryGrid() {
  const tCat = await getTranslations("categories");

  const tiles: CategoryTile[] = [
    { key: "earrings", href: "/catalogue?category=earrings", image: pickImage("earrings") },
    { key: "rings", href: "/catalogue?category=rings", image: pickImage("rings") },
    { key: "pendants", href: "/catalogue?category=pendants", image: pickImage("pendants") },
    { key: "other", href: "/catalogue", image: pickImage("bracelets") },
  ];

  return (
    <div className="rb-catcard-grid">
      {tiles.map((tile) => (
        <Link key={tile.key} href={tile.href} className="rb-catcard" aria-label={tCat(tile.key)}>
          <Image
            src={tile.image}
            alt=""
            fill
            sizes="(max-width: 860px) 50vw, 25vw"
            placeholder={blurFor(tile.image) ? "blur" : "empty"}
            blurDataURL={blurFor(tile.image)}
            className="rb-catcard-img"
            style={{ objectFit: "cover" }}
          />
          <div className="rb-catcard-label">
            <span className="rb-eyebrow">{tCat(tile.key)}</span>
            <span aria-hidden="true">→</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
