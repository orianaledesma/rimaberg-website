import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import { STORE_MAPS_URL } from "@/data/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contactPage");
  return { title: t("metaTitle") };
}

/** Contact page — static business info (owner, postal, registration, email)
 *  and a soft link to the Kaunas showroom. No form: a `mailto:` keeps the
 *  contract simple. */
export default async function ContactPage() {
  const t = await getTranslations("contactPage");
  const tc = await getTranslations("contact");

  return (
    <div className="rb-screen">
      <Header />

      <section
        style={{
          padding: "clamp(56px, 9vw, 96px) clamp(20px, 5vw, 64px) 32px",
          maxWidth: 920,
        }}
      >
        <Reveal>
          <div className="rb-mono" style={{ fontSize: 11, opacity: 0.55 }}>
            — {t("eyebrow")}
          </div>
          <h1
            style={{
              fontSize: "clamp(40px, 7vw, 64px)",
              fontWeight: 200,
              marginTop: 16,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {t("title")}
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.75, marginTop: 24, maxWidth: 540 }}>
            {t("lead")}
          </p>
        </Reveal>
      </section>

      <section
        style={{
          padding: "32px clamp(20px, 5vw, 64px) 96px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 56,
          borderTop: "1px solid var(--rb-line)",
        }}
      >
        {/* Owner + postal address (legal) */}
        <Reveal>
          <div className="rb-eyebrow" style={{ opacity: 0.55, marginBottom: 14 }}>
            {t("ownerLabel")}
          </div>
          <div style={{ fontSize: 18, fontWeight: 300, marginBottom: 24 }}>
            {tc("ownerName")}
          </div>

          <div className="rb-eyebrow" style={{ opacity: 0.55, marginBottom: 14 }}>
            {tc("postalLabel")}
          </div>
          <address style={{ fontStyle: "normal", fontSize: 14, lineHeight: 1.7 }}>
            {tc("postalLine1")}
            <br />
            {tc("postalLine2")}
            <br />
            {tc("postalLine3")}
          </address>

          <div className="rb-mono" style={{ fontSize: 11, opacity: 0.45, marginTop: 28, letterSpacing: "0.08em" }}>
            {tc("businessReg")}
          </div>
        </Reveal>

        {/* Email + showroom */}
        <Reveal delay={120}>
          <div className="rb-eyebrow" style={{ opacity: 0.55, marginBottom: 14 }}>
            E-mail
          </div>
          <a
            href={`mailto:${tc("email")}`}
            style={{
              display: "inline-block",
              fontSize: 18,
              fontWeight: 300,
              marginBottom: 32,
              borderBottom: "1px solid var(--rb-ink)",
              paddingBottom: 4,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {tc("email")}
          </a>

          <div className="rb-eyebrow" style={{ opacity: 0.55, marginBottom: 14 }}>
            {t("showroomLabel")}
          </div>
          <a
            href={STORE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              fontSize: 14,
              lineHeight: 1.7,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {tc("addressLine1")}
            <br />
            {tc("addressLine2")}
          </a>
          <div className="rb-mono" style={{ fontSize: 11, opacity: 0.55, marginTop: 12, letterSpacing: "0.08em" }}>
            {t("showroomHint")} · {tc("hoursLine2")}
          </div>

          <a
            href={`mailto:${tc("email")}`}
            className="rb-btn"
            style={{ marginTop: 36, display: "inline-block" }}
          >
            {t("writeUs")}
          </a>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
