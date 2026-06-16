import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "./locales";
import { mergeContent } from "@/lib/content";

export default getRequestConfig(async () => {
  const store = await cookies();
  const fromCookie = store.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(fromCookie) ? fromCookie : DEFAULT_LOCALE;

  const base = (await import(`../../messages/${locale}.json`)).default;
  // Layer any /admin text overrides on top of the static JSON.
  const messages = await mergeContent(base, locale);

  return { locale, messages };
});
