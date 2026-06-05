import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getByCategory, getAllProducts } from "@/data/products";
import { blurFor } from "@/data/blur";
import { CATEGORY_IMAGES } from "@/data/home";
import type { CategorySlug } from "@/data/categories";

interface CategoryTile {
  /** i18n key under `categories`. */
  key: string;
  /** Catalogue link. */
  href: string;
  /** Representative photo. */
  image: string;
}

/**
 * Tile image: prefer the hand-picked photo from data/home.ts, then fall back to
 * the first photo of the category (or any piece) so a tile is never blank.
 */
function pickImage(category: CategorySlug): string {
  if (CATEGORY_IMAGES[category]) return CATEGORY_IMAGES[category]!;
  const piece = getByCategory(category)[0] ?? getAllProducts()[0];
  return piece?.images[0] ?? "";
}

/**
 * Home category showcase — four tiles (earrings · rings · pendants · engagement),
 * each a photo with the category name on a translucent rule across the top.
 * Every tile deep-links to its catalogue filter.
 */
export default async function CategoryGrid() {
  const tCat = await getTranslations("categories");

  const tiles: CategoryTile[] = [
    { key: "earrings", href: "/catalogue?category=earrings", image: pickImage("earrings") },
    { key: "rings", href: "/catalogue?category=rings", image: pickImage("rings") },
    { key: "pendants", href: "/catalogue?category=pendants", image: pickImage("pendants") },
    { key: "engagement", href: "/catalogue?category=engagement", image: pickImage("engagement") },
  ];

  return (
    <div className="rb-catcard-grid">
      {tiles.map((tile) => (
        <Link key={tile.key} href={tile.href} className="rb-catcard" aria-label={tCat(tile.key)}>
          {tile.image && (
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
          )}
          <div className="rb-catcard-label">
            <span className="rb-eyebrow">{tCat(tile.key)}</span>
            <span aria-hidden="true">→</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
