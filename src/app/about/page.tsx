import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import Carousel, { type Slide } from "@/components/ui/Carousel";
import { getFeatured } from "@/data/catalogue";
import { blurFor } from "@/data/blur";

/** Dedicated portrait for the About page (vertical). Lives in /public. */
const ABOUT_PHOTO_SRC = "/about/about.jpg";

export const metadata: Metadata = { title: "About me" };
export const revalidate = 300;

/** About — artist statement written by Rimantė herself. Editorial layout
 *  with a quiet atelier carousel between the text and the signature. */
export default async function AboutPage() {
  const t = await getTranslations("about");
  const featured = await getFeatured();

  const atelierSlides: Slide[] = featured.slice(0, 4).map((p) => ({
    src: p.images[0],
    blurDataURL: blurFor(p.images[0]),
  }));

  return (
    <div className="rb-screen">
      <Header />

      <section
        style={{
          padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 64px) 32px",
          maxWidth: 980,
        }}
      >
        <Reveal>
          <h1
            style={{
              fontSize: "clamp(52px, 9vw, 96px)",
              marginTop: 16,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {t("title")}
          </h1>
          <div className="rb-eyebrow" style={{ opacity: 0.55, marginTop: 18 }}>
            {t("byline")}
          </div>
        </Reveal>
      </section>

      <section style={{ padding: "32px clamp(20px, 5vw, 64px) 64px", maxWidth: 980 }}>
        <Reveal
          className="rb-collapse"
          delay={80}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.8fr) 1fr",
            gap: "clamp(28px, 5vw, 64px)",
            alignItems: "start",
          }}
        >
          {/* Dedicated portrait — vertical, sits beside the intro on desktop
              and stacks above it on mobile (.rb-collapse). */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 420,
              aspectRatio: "1349 / 1800",
              overflow: "hidden",
              background: "var(--rb-paper-2)",
            }}
          >
            <Image
              src={ABOUT_PHOTO_SRC}
              alt={t("photoAlt")}
              fill
              sizes="(max-width: 760px) 100vw, 38vw"
              quality={90}
              style={{ objectFit: "cover" }}
            />
          </div>

          <div>
            <p style={{ fontSize: 18, lineHeight: 1.7, opacity: 0.85, textWrap: "pretty" }}>
              {t("p1")}
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.7, opacity: 0.85, marginTop: 28, textWrap: "pretty" }}>
              {t("p2")}
            </p>
          </div>
        </Reveal>
      </section>

      {atelierSlides.length > 0 && (
        <section style={{ padding: "16px clamp(20px, 5vw, 64px) 64px" }}>
          <Reveal style={{ height: "min(560px, 64vh)" }}>
            <Carousel slides={atelierSlides} height={560} interval={5200} showNav={false} />
          </Reveal>
        </section>
      )}

      <section style={{ padding: "32px clamp(20px, 5vw, 64px) 80px", maxWidth: 720 }}>
        <Reveal>
          <p style={{ fontSize: 18, lineHeight: 1.7, opacity: 0.85, textWrap: "pretty" }}>
            {t("p3")}
          </p>
          <div
            className="rb-script"
            style={{ fontSize: "clamp(48px, 7vw, 64px)", marginTop: 40, opacity: 0.88 }}
          >
            {t("signature")}
          </div>
        </Reveal>
      </section>

      <section style={{ padding: "0 clamp(20px, 5vw, 64px) 120px", maxWidth: 720 }}>
        <Reveal>
          <div className="rb-eyebrow" style={{ opacity: 0.55, marginBottom: 14 }}>
            {t("followLabel")}
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            <a
              className="rb-eyebrow"
              href={t("instagramUrl")}
              target="_blank"
              rel="noopener noreferrer"
              style={{ opacity: 0.8 }}
            >
              Instagram
            </a>
            <a
              className="rb-eyebrow"
              href={t("facebookUrl")}
              target="_blank"
              rel="noopener noreferrer"
              style={{ opacity: 0.8 }}
            >
              Facebook
            </a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
