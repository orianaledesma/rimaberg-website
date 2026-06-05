import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ringSize");
  return { title: t("metaTitle") };
}

/** Conversion chart: inside diameter (mm) ↔ Lithuania ↔ UK · Europe ↔ USA.
 *  Same content as the legacy rimaberg.com/ring-size, presented with the
 *  brand's typographic discipline. */
const ROWS: Array<[mm: string, lt: string, eu: string, us: string]> = [
  ["14.1", "14", "F",      "3"],
  ["14.5", "14", "F½",     "3½"],
  ["14.9", "15", "H",      "4"],
  ["15.3", "15", "I",      "4½"],
  ["15.7", "16", "J · 48", "5"],
  ["16.1", "16", "K½ · 49","5½"],
  ["16.5", "17", "L · 50", "6"],
  ["16.9", "17", "M · 51", "6½"],
  ["17.3", "17", "N · 52", "7"],
  ["17.7", "18", "O · 53", "7½"],
  ["18.1", "18", "P½ · 54","8"],
  ["18.5", "18", "Q · 55", "8½"],
  ["18.9", "19", "R · 56", "9"],
  ["19.4", "19", "S · 57", "9½"],
  ["19.8", "19", "T · 58", "10"],
  ["20.2", "20", "U½ · 59","10½"],
  ["20.6", "20", "V · 60", "11"],
  ["21.0", "20", "W · 61", "11½"],
  ["21.4", "21", "X · 62", "12"],
  ["21.8", "21", "Y · 63", "12½"],
  ["22.2", "21", "Z · 64", "13"],
  ["22.6", "22", "Z½ · 65","13½"],
];

export default async function RingSizePage() {
  const t = await getTranslations("ringSize");

  return (
    <div className="rb-screen">
      <Header />

      <section
        style={{
          padding: "clamp(56px, 9vw, 96px) clamp(20px, 5vw, 64px) 32px",
          maxWidth: 980,
        }}
      >
        <Reveal>
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
          <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.78, marginTop: 24, maxWidth: 640 }}>
            {t("lead")}
          </p>
        </Reveal>
      </section>

      <section
        style={{
          padding: "8px clamp(20px, 5vw, 64px) 64px",
        }}
      >
        <Reveal>
          <div className="rb-ringsize-table-wrap">
            <table className="rb-ringsize-table">
              <thead>
                <tr>
                  <th>{t("headDiameter")}</th>
                  <th>{t("headLT")}</th>
                  <th>{t("headUKEU")}</th>
                  <th>{t("headUS")}</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r[0]}>
                    <td className="rb-mono">{r[0]}</td>
                    <td>{r[1]}</td>
                    <td>{r[2]}</td>
                    <td>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.6, marginTop: 24, maxWidth: 640 }}>
            {t("note")}
          </p>

          <div style={{ marginTop: 48 }}>
            <Link href="/catalogue" className="rb-eyebrow" style={{ opacity: 0.75, borderBottom: "1px solid", paddingBottom: 4 }}>
              {t("ctaBack")}
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
