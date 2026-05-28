import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cookies");
  return { title: t("metaTitle") };
}

const BROWSER_LINKS: { name: string; href: string }[] = [
  {
    name: "Chrome",
    href: "https://support.google.com/chrome/answer/95647",
  },
  {
    name: "Firefox",
    href: "https://support.mozilla.org/kb/clear-cookies-and-site-data-firefox",
  },
  {
    name: "Safari",
    href: "https://support.apple.com/guide/safari/manage-cookies-sfri11471",
  },
  {
    name: "Edge",
    href: "https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09",
  },
];

/**
 * Cookies page — a small table of the two cookies the site actually sets
 * (rb-locale, rb-atelier-banner) plus the consent / manage / changes notes.
 * Strictly-necessary cookies under the GDPR, so no consent toggle is needed.
 */
export default async function CookiesPage() {
  const t = await getTranslations("cookies");

  return (
    <div className="rb-screen">
      <Header />

      <section
        style={{
          padding: "clamp(56px, 9vw, 96px) clamp(20px, 5vw, 64px) 32px",
          maxWidth: 760,
        }}
      >
        <Reveal>
          <div className="rb-mono" style={{ fontSize: 11, opacity: 0.55 }}>
            — {t("eyebrow")}
          </div>
          <h1
            style={{
              fontSize: "clamp(40px, 7vw, 64px)",
              marginTop: 16,
              lineHeight: 1,
              fontWeight: 300,
              letterSpacing: "-0.02em",
            }}
          >
            {t("title")}
          </h1>
          <div
            className="rb-mono"
            style={{ fontSize: 11, opacity: 0.5, marginTop: 18 }}
          >
            {t("lastUpdated")}
          </div>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.75,
              opacity: 0.8,
              marginTop: 28,
            }}
          >
            {t("intro")}
          </p>
        </Reveal>
      </section>

      {/* Cookie table */}
      <section
        style={{
          padding: "32px clamp(20px, 5vw, 64px) 16px",
          maxWidth: 920,
          overflowX: "auto",
        }}
      >
        <Reveal>
          <table
            className="rb-ringsize-table"
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
          >
            <thead>
              <tr>
                <th>{t("headName")}</th>
                <th>{t("headPurpose")}</th>
                <th>{t("headExpiry")}</th>
                <th>{t("headType")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="rb-mono">{t("localeName")}</td>
                <td>{t("localePurpose")}</td>
                <td>{t("localeExpiry")}</td>
                <td>{t("localeType")}</td>
              </tr>
              <tr>
                <td className="rb-mono">{t("bannerName")}</td>
                <td>{t("bannerPurpose")}</td>
                <td>{t("bannerExpiry")}</td>
                <td>{t("bannerType")}</td>
              </tr>
            </tbody>
          </table>
        </Reveal>
      </section>

      {/* Consent · Manage · Changes */}
      <section
        style={{ padding: "16px clamp(20px, 5vw, 64px) 96px", maxWidth: 760 }}
      >
        <Reveal style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 22, marginBottom: 12 }}>{t("consentTitle")}</h2>
          <p style={{ fontSize: 14, lineHeight: 1.75, opacity: 0.78 }}>
            {t("consentText")}
          </p>
        </Reveal>

        <Reveal delay={80} style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 22, marginBottom: 12 }}>{t("manageTitle")}</h2>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.75,
              opacity: 0.78,
              marginBottom: 12,
            }}
          >
            {t("manageText")}
          </p>
          <ul
            style={{
              fontSize: 14,
              lineHeight: 1.9,
              opacity: 0.78,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {BROWSER_LINKS.map((b) => (
              <li key={b.name}>
                <a
                  href={b.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "inherit",
                    borderBottom: "1px solid currentColor",
                    paddingBottom: 1,
                  }}
                >
                  {b.name} ↗
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={160} style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 22, marginBottom: 12 }}>{t("changesTitle")}</h2>
          <p style={{ fontSize: 14, lineHeight: 1.75, opacity: 0.78 }}>
            {t("changesText")}
          </p>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
