import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy");
  return { title: t("metaTitle") };
}

/** Minimal GDPR-aligned privacy notice. Static, no third-party trackers. */
export default async function PrivacyPage() {
  const t = await getTranslations("privacy");
  const sections = [1, 2, 3, 4, 5, 6] as const;

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
            }}
          >
            {t("title")}
          </h1>
          <div className="rb-mono" style={{ fontSize: 11, opacity: 0.5, marginTop: 18 }}>
            {t("lastUpdated")}
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.75, opacity: 0.8, marginTop: 28 }}>
            {t("intro")}
          </p>
        </Reveal>
      </section>

      <section style={{ padding: "16px clamp(20px, 5vw, 64px) 96px", maxWidth: 760 }}>
        {sections.map((n) => (
          <Reveal key={n} delay={60 * n} style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 22, marginBottom: 12 }}>{t(`section${n}Title`)}</h2>
            <p style={{ fontSize: 14, lineHeight: 1.75, opacity: 0.78 }}>
              {t(`section${n}Text`)}
            </p>
          </Reveal>
        ))}
      </section>

      <Footer />
    </div>
  );
}
