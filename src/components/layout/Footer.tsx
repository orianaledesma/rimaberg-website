import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { STORE_MAPS_URL } from "@/data/site";

/**
 * Site footer — atelier address (linked to Maps), hours, contact, and social.
 * The address comes from the `contact` namespace (single source of truth).
 */
export default async function Footer() {
  const t = await getTranslations("footer");
  const tc = await getTranslations("contact");
  const year = new Date().getFullYear();
  // VAT line is optional — only shown when the contact namespace carries a value.
  const vatCode = tc("vatCode");
  const legalPhone = tc("legalPhone");
  const phoneHref = `tel:${legalPhone.replace(/[^\d+]/g, "")}`;

  return (
    <footer
      style={{
        padding: "64px clamp(20px, 4vw, 64px) 28px",
        borderTop: "1px solid var(--rb-line)",
      }}
    >
      <div className="rb-footer-cols">
        {/* Atelier · address linked to Google Maps */}
        <div>
          <div className="rb-eyebrow" style={{ opacity: 0.5, marginBottom: 14 }}>
            {tc("atelierLabel")}
          </div>
          <a
            href={STORE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              fontSize: 13,
              lineHeight: 1.6,
              color: "inherit",
              textDecoration: "none",
              borderBottom: "1px solid transparent",
              transition: "border-color 0.2s",
            }}
          >
            {tc("addressLine1")}
            <br />
            {tc("addressLine2")}
          </a>
        </div>

        {/* Hours */}
        <div>
          <div className="rb-eyebrow" style={{ opacity: 0.5, marginBottom: 14 }}>
            {tc("hoursLabel")}
          </div>
          {/* pre-line so multi-line opening hours typed in the admin keep their
              line breaks instead of collapsing onto one line. */}
          <div style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-line" }}>
            {tc("hoursLine1")}
            <br />
            {tc("hoursLine2")}
          </div>
        </div>

        {/* Contact */}
        <div>
          <div className="rb-eyebrow" style={{ opacity: 0.5, marginBottom: 14 }}>
            {tc("contactLabel")}
          </div>
          <a
            href={`mailto:${tc("email")}`}
            style={{ display: "block", fontSize: 13, lineHeight: 1.6, color: "inherit" }}
          >
            {tc("email")}
          </a>
        </div>

        {/* Legal · business registration. Part of the single-row column set
            (.rb-footer-cols); collapses below Contact on small screens. */}
        <div>
          <div className="rb-eyebrow" style={{ opacity: 0.5, marginBottom: 14 }}>
            {tc("legalLabel")}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            {tc("legalName")}
            <br />
            {tc("companyCode")}
            {vatCode ? (
              <>
                <br />
                {vatCode}
              </>
            ) : null}
            <br />
            {tc("legalAddress")}
            {legalPhone ? (
              <>
                <br />
                Tel.{" "}
                <a href={phoneHref} style={{ color: "inherit" }}>
                  {legalPhone}
                </a>
              </>
            ) : null}
          </div>
        </div>

        {/* Links + social */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Link className="rb-eyebrow" style={{ opacity: 0.7 }} href="/contact">
            {t("contact")}
          </Link>
          <Link className="rb-eyebrow" style={{ opacity: 0.7 }} href="/ring-size">
            Ring size
          </Link>
          <Link className="rb-eyebrow" style={{ opacity: 0.7 }} href="/about">
            About
          </Link>
          <a
            className="rb-eyebrow"
            style={{ opacity: 0.7, marginTop: 12 }}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("instagram")}
          </a>
          <a
            className="rb-eyebrow"
            style={{ opacity: 0.7 }}
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("facebook")}
          </a>
        </div>
      </div>

      {/* Bottom rail — dynamic year, brand mark, privacy link */}
      <div
        style={{
          paddingTop: 24,
          borderTop: "1px solid var(--rb-line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span
          className="rb-mono"
          style={{ fontSize: 11, opacity: 0.45, letterSpacing: "0.1em" }}
        >
          © {year} RIMA BERG · KAUNAS, LT
        </span>
        <Link
          href="/privacy"
          className="rb-mono"
          style={{ fontSize: 11, opacity: 0.45, letterSpacing: "0.1em", color: "inherit" }}
        >
          {t("privacy").toUpperCase()}
        </Link>
      </div>
    </footer>
  );
}
