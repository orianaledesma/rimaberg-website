import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono, Allison, Cormorant_Garamond } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import CookieNotice from "@/components/CookieNotice";
import "./globals.css";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/animations.css";
import "@/styles/buttons.css";
import "@/styles/navigation.css";
import "@/styles/carousel.css";
import "@/styles/product.css";
import "@/styles/layout.css";
import "@/styles/header-iter2.css";

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-mono",
  display: "swap",
});

const script = Allison({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

// Editorial serif for headings — gives jewellery copy a publication-like feel.
const serif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const SITE_URL = "https://www.rimaberg.com";
const SITE_NAME = "Rima Berg";
const TAGLINE = "Jewellery · Kaunas";
const DESCRIPTION =
  "Hand-cast silver jewellery from the Rima Berg atelier in Kaunas. Granulated textures, rose-gold bezels and coloured stones — slow studio practice, no two pieces alike.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Rima Berg",
    "jewellery Kaunas",
    "handmade silver jewellery",
    "cast silver rings",
    "Lithuanian jewellery",
    "artisan jewellery",
    "engagement rings Kaunas",
  ],
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${TAGLINE}`,
    description: DESCRIPTION,
    locale: "lt",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations("a11y");

  return (
    <html
      lang={locale}
      className={`${sans.variable} ${mono.variable} ${script.variable} ${serif.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <a href="#main" className="rb-skip">
            {t("skip")}
          </a>
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <CookieNotice />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
