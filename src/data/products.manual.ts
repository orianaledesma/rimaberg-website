import type { Product } from "./products";

/**
 * Manually-curated pieces — they live outside content/products.csv (and the
 * import script) so editing them never collides with a fresh CSV import.
 *
 * Carrousel collection: seven pieces with a single photograph each, plus
 * poetic LT/EN captions Rima provided. `hideDescription: true` keeps those
 * captions out of the detail page for now while leaving them in data; flip
 * the flag to false to surface them. Codes/material/stones/sizes are left
 * blank until Rima confirms them in person.
 */
export const MANUAL_PRODUCTS: Product[] = [
  {
    id: "du-pumpurai",
    category: "carrousel",
    status: "onRequest",
    name: { lt: "Du pumpurai", en: "Two buds" },
    code: "",
    images: ["/products/carrousel/du_pumpurai.jpeg"],
    material: { lt: "", en: "" },
    stones: { lt: "", en: "" },
    sizes: { lt: "", en: "" },
    leadTime: { lt: "", en: "" },
    description: {
      lt: "Besiskleidžiantys pumpurai, tai tarsi sustabdyta akimirka ir švelnus priminimas būti čia ir dabar...",
      en: "Budding buds are like a frozen moment and a gentle reminder to be here and now...",
    },
    hideDescription: true,
  },
  {
    id: "fakturos",
    category: "carrousel",
    status: "onRequest",
    name: { lt: "Faktūros", en: "Textures" },
    code: "",
    images: ["/products/carrousel/fakturos.jpg"],
    material: { lt: "", en: "" },
    stones: { lt: "", en: "" },
    sizes: { lt: "", en: "" },
    leadTime: { lt: "", en: "" },
    description: {
      lt: "Netobulos, bet nepaaiškinamai tikros...",
      en: "Imperfect, but inexplicably real...",
    },
    hideDescription: true,
  },
  {
    id: "naktine-zvaigzde",
    category: "carrousel",
    status: "onRequest",
    name: { lt: "Naktinė žvaigždė", en: "Night star" },
    code: "",
    images: ["/products/carrousel/naktine_zvaigzde.JPG"],
    material: { lt: "", en: "" },
    stones: { lt: "", en: "" },
    sizes: { lt: "", en: "" },
    leadTime: { lt: "", en: "" },
    description: {
      lt: "Šilkine naktimi apvilkta svajonė...",
      en: "A dream dressed in a silky night...",
    },
    hideDescription: true,
  },
  {
    id: "pasirinkimai",
    category: "carrousel",
    status: "onRequest",
    name: { lt: "Pasirinkimai", en: "Choices" },
    code: "",
    images: ["/products/carrousel/pasirinkimai.JPG"],
    material: { lt: "", en: "" },
    stones: { lt: "", en: "" },
    sizes: { lt: "", en: "" },
    leadTime: { lt: "", en: "" },
    description: {
      lt: "Metalo ir akmens sinergija...",
      en: "The synergy of metal and stone...",
    },
    hideDescription: true,
  },
  {
    id: "pavasario-zydejimas",
    category: "carrousel",
    status: "onRequest",
    name: { lt: "Pavasario žydėjimas", en: "Spring bloom" },
    code: "",
    images: ["/products/carrousel/pavasario_zydejimas.JPG"],
    material: { lt: "", en: "" },
    stones: { lt: "", en: "" },
    sizes: { lt: "", en: "" },
    leadTime: { lt: "", en: "" },
    description: {
      lt: "Pavasario žydėjimas...",
      en: "Spring bloom...",
    },
    hideDescription: true,
  },
  {
    id: "spalvos-jausmuose",
    category: "carrousel",
    status: "onRequest",
    name: { lt: "Spalvos jausmuose", en: "Colors in feelings" },
    code: "",
    images: ["/products/carrousel/spalvos_jausmuose.JPG"],
    material: { lt: "", en: "" },
    stones: { lt: "", en: "" },
    sizes: { lt: "", en: "" },
    leadTime: { lt: "", en: "" },
    description: {
      lt: "Jausmai ir jų spalvos...",
      en: "Feelings and their colors...",
    },
    hideDescription: true,
  },
  {
    id: "zibejimas",
    category: "carrousel",
    status: "onRequest",
    name: { lt: "Žibėjimas", en: "Shimmer" },
    code: "",
    images: ["/products/carrousel/zibejimas.JPG"],
    material: { lt: "", en: "" },
    stones: { lt: "", en: "" },
    sizes: { lt: "", en: "" },
    leadTime: { lt: "", en: "" },
    description: {
      lt: "Subtilus spindesys netobuloje formoje...",
      en: "Subtle shine in an imperfect form...",
    },
    hideDescription: true,
  },
];
