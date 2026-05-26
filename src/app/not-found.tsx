import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="rb-screen">
      <Header />
      <section
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "clamp(64px, 12vw, 140px) 24px",
          gap: 20,
        }}
      >
        <div className="rb-mono" style={{ fontSize: 11, opacity: 0.5, letterSpacing: "0.18em" }}>
          — 404 —
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 200, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          {t("title")}
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.7, maxWidth: 380 }}>{t("lead")}</p>
        <Link href="/catalogue" className="rb-btn" style={{ marginTop: 8 }}>
          {t("back")}
        </Link>
      </section>
      <Footer />
    </div>
  );
}
