import type { CategorySlug } from "./categories";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * RIMA BERG — product catalogue (seed data)
 * ─────────────────────────────────────────────────────────────────────────
 * This is placeholder content built on top of the real studio photography in
 * /public/products. Names, prices, materials, stones and the EN/LT copy are
 * plausible but NOT confirmed.
 *
 * CONTENT TODO (Rima): replace `name`, `status`, `material`, `stones`, `sizes`,
 * `leadTime` and `description.{en,lt}` with the real piece data. Keep the image
 * paths or repoint them — there are ~128 photos available in /public/products.
 * To add a piece, append an object to PRODUCTS; everything else (filters,
 * detail pages, related items) is derived automatically.
 */

export type PriceStatus = "onRequest" | "preOrder" | "madeToOrder";

export interface LocalizedText {
  en: string;
  lt: string;
}

export interface Product {
  /** URL slug + stable id. */
  id: string;
  /** Proper name — same across locales. */
  name: string;
  /** Studio reference, e.g. "RB · 0427 · unique". */
  code: string;
  category: CategorySlug;
  status: PriceStatus;
  /** First image is the primary; a second image powers the hover swap. */
  images: string[];
  material: LocalizedText;
  stones: LocalizedText;
  sizes: LocalizedText;
  leadTime: LocalizedText;
  description: LocalizedText;
  featured?: boolean;
  isNew?: boolean;
}

const IMG = (file: string) => `/products/${file}`;

export const PRODUCTS: Product[] = [
  {
    id: "zinija",
    name: "Žinija",
    code: "RB · 0411 · unique",
    category: "earrings",
    status: "onRequest",
    images: [IMG("CEVI9188.JPG"), IMG("GJOJ5082.JPG")],
    material: { en: "Sterling silver", lt: "Sidabras (925)" },
    stones: { en: "Sapphires", lt: "Safyrai" },
    sizes: { en: "One size", lt: "Vienas dydis" },
    leadTime: { en: "In studio", lt: "Studijoje" },
    description: {
      en: "Granulated silver discs, each set with a cluster of small sapphires — light catches the texture before it catches the stones.",
      lt: "Granuliuoto sidabro diskai, kiekvienas su mažų safyrų sankaupa — šviesa pirma pagauna faktūrą, paskui akmenis.",
    },
    featured: true,
    isNew: true,
  },
  {
    id: "storm",
    name: "Storm",
    code: "RB · 0418 · unique",
    category: "rings",
    status: "onRequest",
    images: [IMG("DEVK4155.JPG"), IMG("ADDI7571.JPG")],
    material: { en: "Silver · 14k rose gold", lt: "Sidabras · 14k rausvas auksas" },
    stones: { en: "Amethyst", lt: "Ametistas" },
    sizes: { en: "LT 14–22 · made to size", lt: "LT 14–22 · gaminama pagal dydį" },
    leadTime: { en: "4–6 weeks", lt: "4–6 savaitės" },
    description: {
      en: "A wide hand-textured band cradling a single step-cut amethyst — the surface worked to look weathered, like river stone.",
      lt: "Platus rankomis faktūruotas žiedas su vienu pakopinio šlifo ametistu — paviršius apdorotas taip, lyg būtų nugludintas upės.",
    },
    featured: true,
    isNew: true,
  },
  {
    id: "trio-i",
    name: "Trio · I",
    code: "RB · 0421 · made to order",
    category: "rings",
    status: "preOrder",
    images: [IMG("ADDI7571.JPG"), IMG("BKIJ6345.JPG")],
    material: { en: "Silver · multi-stone bezels", lt: "Sidabras · kelių akmenų rėmeliai" },
    stones: { en: "Sapphire · garnet · citrine", lt: "Safyras · granatas · citrinas" },
    sizes: { en: "LT 14–22 · made to size", lt: "LT 14–22 · gaminama pagal dydį" },
    leadTime: { en: "4–6 weeks", lt: "4–6 savaitės" },
    description: {
      en: "A stack of three cast-silver bands set with rose-gold bezels — worn alone or together. Each band is hand-textured.",
      lt: "Trijų lietų sidabro žiedų rinkinys su rausvo aukso rėmeliais — nešiojami atskirai ar kartu. Kiekvienas žiedas faktūruotas rankomis.",
    },
    featured: true,
  },
  {
    id: "trio-ii",
    name: "Trio · II",
    code: "RB · 0427 · unique",
    category: "rings",
    status: "madeToOrder",
    images: [IMG("BKIJ6345.JPG"), IMG("DEVK4155.JPG")],
    material: { en: "Sterling silver · 14k rose gold", lt: "Sidabras (925) · 14k rausvas auksas" },
    stones: { en: "Sapphire · garnet · citrine", lt: "Safyras · granatas · citrinas" },
    sizes: { en: "LT 14–22 · made to size", lt: "LT 14–22 · gaminama pagal dydį" },
    leadTime: { en: "4–6 weeks", lt: "4–6 savaitės" },
    description: {
      en: "A stacked trio in granulated silver, set with garnet, blue sapphire and citrine in rose-gold bezels. Each band is hand-textured and can be worn alone or together.",
      lt: "Granuliuoto sidabro trijulė su granatu, mėlynu safyru ir citrinu rausvo aukso rėmeliuose. Kiekvienas žiedas faktūruotas rankomis, nešiojamas atskirai ar kartu.",
    },
    featured: true,
  },
  {
    id: "trio-iii",
    name: "Trio · III",
    code: "RB · 0432 · made to order",
    category: "engagement",
    status: "madeToOrder",
    images: [IMG("AQHK3944.JPG"), IMG("BJYI6553.JPG")],
    material: { en: "Silver · tourmaline · chrome diopside", lt: "Sidabras · turmalinas · chromo diopsidas" },
    stones: { en: "Tourmaline · chrome diopside", lt: "Turmalinas · chromo diopsidas" },
    sizes: { en: "LT 14–22 · made to size", lt: "LT 14–22 · gaminama pagal dydį" },
    leadTime: { en: "5–7 weeks", lt: "5–7 savaitės" },
    description: {
      en: "An engagement piece in the Trio language — a solitaire set low in a granulated band, flanked by two coloured stones.",
      lt: "Sužadėtuvių žiedas „Trio“ stiliumi — solitas, įsodintas žemai granuliuotame žiede, su dviem spalvotais akmenimis šonuose.",
    },
    isNew: true,
  },
  {
    id: "luzis",
    name: "Lūžis",
    code: "RB · 0408 · unique",
    category: "pendants",
    status: "preOrder",
    images: [IMG("AYDJ8153.JPG"), IMG("BFYI7056.JPG")],
    material: { en: "Oxidised silver", lt: "Oksiduotas sidabras" },
    stones: { en: "Rough diamond", lt: "Neapdorotas deimantas" },
    sizes: { en: "Chain 45 cm", lt: "Grandinėlė 45 cm" },
    leadTime: { en: "3–4 weeks", lt: "3–4 savaitės" },
    description: {
      en: "A fractured pendant in oxidised silver — the break left raw, a rough diamond caught in the seam.",
      lt: "Suskilęs pakabukas iš oksiduoto sidabro — lūžis paliktas neapdorotas, siūlėje įstrigęs neapdirbtas deimantas.",
    },
  },
  {
    id: "briauna",
    name: "Briauna",
    code: "RB · 0414 · unique",
    category: "earrings",
    status: "onRequest",
    images: [IMG("GJOJ5082.JPG"), IMG("CEVI9188.JPG")],
    material: { en: "Brushed sterling silver", lt: "Šlifuotas sidabras (925)" },
    stones: { en: "—", lt: "—" },
    sizes: { en: "One size", lt: "Vienas dydis" },
    leadTime: { en: "In studio", lt: "Studijoje" },
    description: {
      en: "Plain brushed-silver discs — the studio's quietest earring, made to be worn every day.",
      lt: "Paprasti šlifuoto sidabro diskai — tyliausi studijos auskarai, sukurti kasdienai.",
    },
    isNew: true,
  },
  {
    id: "vienatve",
    name: "Vienatvė",
    code: "RB · 0405 · made to order",
    category: "bracelets",
    status: "preOrder",
    images: [IMG("BKJW0222.JPG"), IMG("BSDWE2205.JPG")],
    material: { en: "Cast silver", lt: "Lietas sidabras" },
    stones: { en: "—", lt: "—" },
    sizes: { en: "17–20 cm", lt: "17–20 cm" },
    leadTime: { en: "4–6 weeks", lt: "4–6 savaitės" },
    description: {
      en: "A heavy cast-silver cuff with a granulated outer face and a smooth inner band — designed for a man's wrist.",
      lt: "Sunki lieto sidabro apyrankė su granuliuotu išoriniu paviršiumi ir lygiu vidumi — sukurta vyriškam riešui.",
    },
  },
  {
    id: "ziedlapiai",
    name: "Žiedlapiai",
    code: "RB · 0401 · unique",
    category: "rings",
    status: "onRequest",
    images: [IMG("BJYI6553.JPG"), IMG("AQHK3944.JPG")],
    material: { en: "Silver · rose-gold bezels", lt: "Sidabras · rausvo aukso rėmeliai" },
    stones: { en: "Sapphire · citrine · iolite", lt: "Safyras · citrinas · jolitas" },
    sizes: { en: "LT 14–22 · made to size", lt: "LT 14–22 · gaminama pagal dydį" },
    leadTime: { en: "4–6 weeks", lt: "4–6 savaitės" },
    description: {
      en: "The collection's namesake — petals of cast silver scattered with rose-gold bezels, each holding a different coloured stone.",
      lt: "Kolekcijos vardo žiedas — lieto sidabro žiedlapiai, nusėti rausvo aukso rėmeliais, kiekviename — vis kitas spalvotas akmuo.",
    },
    featured: true,
  },
  {
    id: "akmuo",
    name: "Akmuo",
    code: "RB · 0436 · unique",
    category: "rings",
    status: "onRequest",
    images: [IMG("BSDS0387.JPEG"), IMG("BYOEE2686.JPG")],
    material: { en: "Sterling silver", lt: "Sidabras (925)" },
    stones: { en: "Smoky quartz", lt: "Dūminis kvarcas" },
    sizes: { en: "LT 15–20 · made to size", lt: "LT 15–20 · gaminama pagal dydį" },
    leadTime: { en: "4–6 weeks", lt: "4–6 savaitės" },
    description: {
      en: "A single smoky quartz held in a raw bezel above a wide, river-worn band.",
      lt: "Vienas dūminis kvarcas neapdorotame rėmelyje virš plataus, upės nugludinto žiedo.",
    },
  },
  {
    id: "lapas",
    name: "Lapas",
    code: "RB · 0439 · unique",
    category: "pendants",
    status: "preOrder",
    images: [IMG("BZZC2577.JPG"), IMG("CKFL0423.JPEG")],
    material: { en: "Silver · 14k gold leaf", lt: "Sidabras · 14k aukso lapelis" },
    stones: { en: "—", lt: "—" },
    sizes: { en: "Chain 50 cm", lt: "Grandinėlė 50 cm" },
    leadTime: { en: "3–4 weeks", lt: "3–4 savaitės" },
    description: {
      en: "A leaf pressed into silver, its veins picked out in gold — taken from a maple by the studio window.",
      lt: "Į sidabrą įspaustas lapas, jo gyslos paryškintos auksu — nuskintas nuo klevo prie studijos lango.",
    },
    isNew: true,
  },
  {
    id: "ratas",
    name: "Ratas",
    code: "RB · 0442 · made to order",
    category: "earrings",
    status: "onRequest",
    images: [IMG("CLWO6017.JPG"), IMG("CQTQ7819.JPG")],
    material: { en: "Sterling silver", lt: "Sidabras (925)" },
    stones: { en: "Moonstone", lt: "Mėnulio akmuo" },
    sizes: { en: "Drop 32 mm", lt: "Ilgis 32 mm" },
    leadTime: { en: "4–6 weeks", lt: "4–6 savaitės" },
    description: {
      en: "Open silver hoops with a single moonstone set off-centre — they swing and catch light as they move.",
      lt: "Atviri sidabro ratai su vienu mėnulio akmeniu šone — jie sūpuojasi ir pagauna šviesą judant.",
    },
  },
  {
    id: "uola",
    name: "Uola",
    code: "RB · 0445 · unique",
    category: "rings",
    status: "onRequest",
    images: [IMG("CSOZE2730.JPG"), IMG("CSTK9172.JPG")],
    material: { en: "Oxidised silver · 14k rose gold", lt: "Oksiduotas sidabras · 14k rausvas auksas" },
    stones: { en: "Pink tourmaline", lt: "Rožinis turmalinas" },
    sizes: { en: "LT 16–21 · made to size", lt: "LT 16–21 · gaminama pagal dydį" },
    leadTime: { en: "4–6 weeks", lt: "4–6 savaitės" },
    description: {
      en: "A craggy oxidised band, deliberately uneven, warmed by a single rose-gold bezel and a pink tourmaline.",
      lt: "Grublėtas oksiduoto sidabro žiedas, sąmoningai nelygus, sušildytas vieno rausvo aukso rėmelio ir rožinio turmalino.",
    },
    featured: true,
  },
  {
    id: "vandenys",
    name: "Vandenys",
    code: "RB · 0448 · made to order",
    category: "engagement",
    status: "madeToOrder",
    images: [IMG("DJFN7978.JPG"), IMG("DKIV8831.JPEG")],
    material: { en: "Silver · 14k white gold", lt: "Sidabras · 14k baltas auksas" },
    stones: { en: "Aquamarine · diamond", lt: "Akvamarinas · deimantas" },
    sizes: { en: "LT 14–22 · made to size", lt: "LT 14–22 · gaminama pagal dydį" },
    leadTime: { en: "5–7 weeks", lt: "5–7 savaitės" },
    description: {
      en: "An engagement ring built around a pale aquamarine, with two small diamonds set into the rippled shoulders.",
      lt: "Sužadėtuvių žiedas aplink šviesų akvamariną, su dviem mažais deimantais banguotuose žiedo pečiuose.",
    },
    isNew: true,
  },
];

/* ── Selectors ──────────────────────────────────────────────────────────── */

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getByCategory(category: CategorySlug): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getFeatured(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function getNew(): Product[] {
  return PRODUCTS.filter((p) => p.isNew);
}

/** Related pieces: same category first, then fill from the rest. */
export function getRelated(id: string, count = 4): Product[] {
  const current = getProductById(id);
  if (!current) return PRODUCTS.slice(0, count);
  const sameCat = PRODUCTS.filter(
    (p) => p.id !== id && p.category === current.category
  );
  const others = PRODUCTS.filter(
    (p) => p.id !== id && p.category !== current.category
  );
  return [...sameCat, ...others].slice(0, count);
}
