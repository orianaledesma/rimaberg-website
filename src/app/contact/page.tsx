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

/**
 * Contact page — pared down to the essentials: a one-line invitation, a
 * button-styled mailto whose label IS the email (so it can be copied even
 * when no mail client is configured), and the atelier address with a Maps
 * link. No form, no postal address, no business registration here — those
 * live in Privacy where they are legally meaningful.
 */
export default async function ContactPage() {
  const t = await getTranslations("contactPage");

  return (
    <div className="rb-screen">
      <Header />

      <section
        style={{
          padding: "clamp(56px, 9vw, 96px) clamp(20px, 5vw, 64px) 32px",
          maxWidth: 720,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <Reveal>
          <h1
            style={{
              fontSize: "clamp(40px, 7vw, 64px)",
              fontWeight: 300,
              marginTop: 16,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            {t("title")}
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              opacity: 0.75,
              marginTop: 28,
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {t("lead")}
          </p>
        </Reveal>

        <Reveal delay={120} style={{ marginTop: 40 }}>
          <a
            href={`mailto:${t("writeUs")}`}
            className="rb-btn"
            aria-label={t("writeUsAria")}
            style={{ display: "inline-flex" }}
          >
            {t("writeUs")} →
          </a>
        </Reveal>
      </section>

      <section
        style={{
          padding: "16px clamp(20px, 5vw, 64px) 96px",
          maxWidth: 720,
          margin: "0 auto",
          textAlign: "center",
          borderTop: "1px solid var(--rb-line)",
          marginTop: "clamp(48px, 8vw, 80px)",
        }}
      >
        <Reveal delay={80} style={{ paddingTop: "clamp(40px, 6vw, 64px)" }}>
          <div
            className="rb-eyebrow"
            style={{ opacity: 0.55, marginBottom: 14 }}
          >
            {t("atelierEyebrow")}
          </div>
          <address
            className="rb-mono"
            style={{
              fontStyle: "normal",
              fontSize: 16,
              letterSpacing: "0.04em",
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            {t("atelierAddress")}
          </address>
          <a
            href={STORE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("directionsAria")}
            className="rb-btn"
          >
            {t("directionsCta")}
          </a>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
