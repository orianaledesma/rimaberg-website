import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CATEGORY_NAV } from "@/data/categories";

/**
 * Centred tracked-uppercase category filter. Each item links to the catalogue
 * filtered by category; "all" clears the filter. `active` matches a slug.
 */
export default async function CategoryNav({ active = "all" }: { active?: string }) {
  const t = await getTranslations("categories");

  return (
    <nav
      className="rb-cat-nav"
      style={{
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "clamp(20px, 3vw, 44px)",
        padding: "28px clamp(20px, 4vw, 56px)",
        borderBottom: "1px solid var(--rb-line)",
        background: "var(--rb-bg)",
        color: "var(--rb-ink)",
        position: "sticky",
        top: 0,
        zIndex: 9,
      }}
    >
      {CATEGORY_NAV.map((c) => {
        const href = c.slug === "all" ? "/catalogue" : `/catalogue?category=${c.slug}`;
        return (
          <Link key={c.slug} href={href} className={c.slug === active ? "is-active" : ""}>
            {t(c.key)}
          </Link>
        );
      })}
    </nav>
  );
}
