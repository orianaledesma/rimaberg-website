"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { setLocale } from "@/i18n/actions";
import { LOCALES, LOCALE_SHORT, type Locale } from "@/i18n/locales";

/**
 * EN | LT toggle. Writes the locale cookie via a server action; the action
 * revalidates the layout so the whole tree re-renders in the new language.
 */
export default function LocaleSwitcher({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const active = useLocale() as Locale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  // tone = background tone: dark bg → light text, light bg → dark ink.
  const color = tone === "dark" ? "#fafafa" : "var(--rb-ink)";

  const change = (loc: Locale) =>
    startTransition(async () => {
      await setLocale(loc);
      router.refresh();
    });

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", color, opacity: pending ? 0.5 : 1 }}>
      {LOCALES.map((loc) => (
        <button
          key={loc}
          type="button"
          className="rb-eyebrow"
          aria-pressed={loc === active}
          onClick={() => change(loc)}
          style={{
            fontSize: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "inherit",
            opacity: loc === active ? 1 : 0.5,
            padding: 0,
          }}
        >
          {LOCALE_SHORT[loc]}
        </button>
      ))}
    </div>
  );
}
