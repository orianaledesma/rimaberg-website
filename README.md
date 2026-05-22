# Rima Berg — Jewellery (Vilnius)

Bilingual (EN/LT) catalogue site for the Rima Berg jewellery atelier. A vitrine,
not a shop: pieces are browsed and viewed, and enquiries go out by email — there
is no cart or checkout. Built from the "Direction C" design handoff.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build (also type-checks + lints)
npm run start    # serve the production build
npm run lint
```

Requires Node 18.18+ (developed on 18.19).

## Architecture

- **Next.js 15 (App Router) + React 19 + TypeScript.** Pages are React Server
  Components; only the interactive bits (`Carousel`, `Reveal`, `Cursor`,
  `LocaleSwitcher`) are client components.
- **State lives in three places.** Server data = the typed product catalogue in
  `src/data`. URL state = the catalogue filter (`/catalogue?category=rings`).
  Local UI state = carousel index, in-view flags — kept inside the client
  components that own them.
- **i18n: next-intl, cookie-based** (no `/en` `/lt` URL segments). The active
  locale is stored in the `rb-locale` cookie; `LocaleSwitcher` writes it through
  a server action that revalidates the layout, so the whole tree re-renders in
  the chosen language. Copy lives in `messages/{en,lt}.json`; per-product text
  (material, stones, description…) is stored as `{ en, lt }` on each product.
- **Design tokens** (palette) are CSS custom properties in `globals.css`; the
  reusable animation classes (`rb-*`) are ported verbatim from the prototype.
  Components never hardcode brand colours — they reference the tokens.
- **Images** are served from `public/products` through `next/image`. Product
  detail pages are statically generated via `generateStaticParams`.

## File structure

```
src/
├── app/
│   ├── layout.tsx              # fonts, SEO metadata, provider, style imports
│   ├── page.tsx                # Home (hero · featured carousel · tile grid · atelier)
│   ├── catalogue/
│   │   ├── page.tsx            # Catalogue (filter by ?category=)
│   │   └── [id]/page.tsx       # Product detail (SSG)
│   ├── about/page.tsx          # About + Contact
│   ├── not-found.tsx           # branded 404
│   └── globals.css             # Tailwind layers only
├── components/
│   ├── layout/                 # Header, Footer, CategoryNav, LocaleSwitcher, Logo
│   ├── catalogue/              # ProductCard, ProductTileGrid, FeaturedCarousel
│   ├── ui/                     # Carousel, Reveal (generic primitives)
│   └── sections/               # AtelierSection (composed page section)
├── data/
│   ├── products.ts             # typed catalogue (seed data — see below)
│   ├── categories.ts           # category definitions + nav order
│   └── blur.ts                 # generated LCP blur placeholders
├── i18n/                       # locales, request config, setLocale action
└── styles/                     # tokens · base · animations · navigation ·
                                # carousel · product · layout (imported in layout.tsx)
messages/                       # en.json, lt.json
public/products/                # ~128 studio photos
```

Styling: brand colours are CSS custom properties in `styles/tokens.css`; the
reusable `rb-*` classes are split into themed partials under `styles/` and
imported once from the root layout. Components compose those classes with
inline layout values — they never hardcode brand colours.

## Content TODO (for Rima)

The product data in `src/data/products.ts` is **placeholder built on real
photos**. Names, prices/status, materials, stones, sizes and the EN/LT
descriptions are plausible but unconfirmed. To finish:

1. Edit the entries in `PRODUCTS` with the real piece data (keep or repoint the
   `images` paths — there are ~128 photos in `public/products`).
2. Add pieces by appending objects to `PRODUCTS`; filters, detail pages and
   related items are derived automatically.
3. Replace the atelier carousel photos and the portrait in `about/page.tsx`.
4. Confirm the real contact details / opening hours in `messages/*.json`
   (`contact` namespace), and the social links in `Footer.tsx`.

## Trade-offs & decisions

- **Catalogue, not commerce.** Matches the "each piece is unique / made to
  order" model; "Enquire" opens a pre-filled `mailto`. A cart can be added later
  without reworking the data layer.
- **Cookie i18n over routed i18n.** Simpler, no duplicated URL trees, and it
  matches the house pattern already used in trade-calendar. The cost is that the
  three pages that read the cookie render dynamically rather than fully static.
- **Data file over CMS.** Fastest path to launch and easy to diff in git. The
  `Product` type is the seam to swap in a headless CMS later with no page changes.
- **Inline styles for layout, tokens for colour.** The handoff specified exact
  pixel values; porting them to inline styles preserved fidelity, while colours
  go through CSS custom properties so the brand stays themeable.

## AI usage

Scaffolded and built with Claude Code: the design handoff (a bundled React
prototype) was unpacked to recover the Direction C source, which was then ported
to a production Next.js App Router structure, wired to a typed data layer and
next-intl, and verified with a passing build and a runtime smoke test. The
architecture choices, content model and bilingual copy were directed and
reviewed by the studio.
