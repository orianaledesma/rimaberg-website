/**
 * Editorial image picks for the home page — chosen by hand, not derived from
 * the "featured" flag. Edit the filenames here to re-curate the carousels and
 * the category tiles. Paths are web-root relative (served from public/products).
 */
import type { CategorySlug } from "./categories";

/** Top black hero carousel (4 slides). Avoid the low-resolution photos
 *  (BKIJ6345 1024px, IMG_E6484 1206px, EVMC6579/QHYS4544 1280px) so the hero
 *  always feels crisp on large displays. */
export const HERO_IMAGES: string[] = [
  "/products/MYTG1376.JPG",
  "/products/DXWH5141.JPG",
  "/products/WQISE4927.JPG",
  "/products/BJYI6553.JPG",
];

/** Dark "Atelier" band carousel near the footer (4 slides). */
export const ATELIER_IMAGES: string[] = [
  "/products/UTQC4256.JPG",
  "/products/WSLO8352.JPG",
  "/products/GWOR7535.JPEG",
  "/products/HMKZ3041.JPG",
];

/** Representative photo for each home category tile. */
export const CATEGORY_IMAGES: Partial<Record<CategorySlug, string>> = {
  earrings: "/products/NYOT6592.JPG",
  rings: "/products/POMT3567.JPG",
  pendants: "/products/DKIV8831.JPEG",
  engagement: "/products/ERGF9671.JPG", // used by the "other" tile
};
