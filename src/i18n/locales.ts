export const LOCALES = ["en", "lt"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "rb-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  lt: "Lietuvių",
};

/** Short code shown in the header switch. */
export const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  lt: "LT",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
