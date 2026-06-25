import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { STORE_MAPS_URL } from "@/data/site";

// Versioned filename so replacing the photo busts the browser / next-image
// cache (the optimizer caches by URL, and prod keeps images for a year).
const STORE_PHOTO_SRC = "/store/store-v2.png";

/**
 * "The Atelier" — physical studio-store launch section. Sits at id="atelier"
 * so the top banner can anchor-scroll to it. Replaces the older ComingSoon
 * band in this iteration.
 *
 *   · Eyebrow + two-line serif heading + lead copy.
 *   · Foto del local (rendered with next/image; placeholder fallback when
 *     /public/store/store.png is missing).
 *   · Address + hours block (both come from the messages so Rima can edit
 *     copy in one place).
 *   · CTA → Google Maps (opens in new tab).
 *   · Map iframe is loaded with native lazy loading so it stays out of the
 *     first paint.
 */
export default async function StoreSection({
  hasPhoto = true,
}: {
  hasPhoto?: boolean;
}) {
  const t = await getTranslations("atelier");

  const mapEmbed =
    "https://www.google.com/maps?q=Vilniaus+g.+30,+Kaunas&output=embed";

  return (
    <section
      id="atelier"
      style={{
        padding:
          "clamp(72px, 11vw, 140px) clamp(20px, 5vw, 64px)",
        borderTop: "1px solid var(--rb-line)",
        scrollMarginTop: "calc(var(--rb-header-h) + 16px)",
      }}
    >
      <div
        className="rb-collapse"
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: "clamp(32px, 6vw, 80px)",
          alignItems: "center",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Photo (or placeholder) — first on desktop, ratio adapts via CSS */}
        <div
          className="rb-store-photo"
          style={{
            position: "relative",
            aspectRatio: "3 / 2",
            overflow: "hidden",
            background: "var(--rb-paper-2)",
          }}
        >
          {hasPhoto ? (
            <Image
              src={STORE_PHOTO_SRC}
              alt={t("photoAlt")}
              fill
              sizes="(max-width: 760px) 100vw, 55vw"
              quality={90}
              // Anchor to the top so the storefront stays visible after the
              // "cover" crop — both on desktop (3/2) and mobile (taller 4/5).
              style={{ objectFit: "cover", objectPosition: "top" }}
            />
          ) : (
            <div
              className="rb-placeholder"
              style={{
                position: "absolute",
                inset: 0,
              }}
            >
              {t("photoComingSoon")}
            </div>
          )}
        </div>

        {/* Content column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h2
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              fontWeight: 300,
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
              textWrap: "pretty",
            }}
          >
            {t("title")}
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              opacity: 0.78,
              maxWidth: 56 + "ch",
            }}
          >
            {t("lead")}
          </p>

          <dl
            style={{
              marginTop: 8,
              paddingTop: 24,
              borderTop: "1px solid var(--rb-line)",
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              rowGap: 14,
              fontSize: 13,
              alignItems: "start",
            }}
          >
            <dt
              className="rb-eyebrow"
              style={{ opacity: 0.55, fontSize: 10 }}
            >
              {t("addressLabel")}
            </dt>
            <dd
              className="rb-mono"
              style={{ margin: 0, letterSpacing: "0.04em" }}
            >
              {t("addressValue")}
            </dd>
            <dt
              className="rb-eyebrow"
              style={{ opacity: 0.55, fontSize: 10 }}
            >
              {t("hoursLabel")}
            </dt>
            <dd
              className="rb-mono"
              style={{
                margin: 0,
                letterSpacing: "0.04em",
                // Honour the line breaks the admin types (multi-line opening
                // hours), instead of collapsing them onto one line.
                whiteSpace: "pre-line",
                lineHeight: 1.7,
              }}
            >
              {t("hoursValue")}
            </dd>
          </dl>

          <a
            href={STORE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rb-btn"
            aria-label={t("directionsAria")}
            style={{ marginTop: 8, alignSelf: "flex-start" }}
          >
            {t("directionsCta")}
          </a>
        </div>
      </div>

      {/* Map (lazy) — sits below the content row, full width */}
      <div
        style={{
          marginTop: "clamp(48px, 8vw, 96px)",
          maxWidth: 1280,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <iframe
          title={t("mapTitle")}
          src={mapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            border: "1px solid var(--rb-line)",
            display: "block",
            filter: "grayscale(0.3) contrast(0.95)",
          }}
        />
      </div>
    </section>
  );
}
