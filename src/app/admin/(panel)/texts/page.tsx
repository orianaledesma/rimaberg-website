import { editableLeaves } from "@/lib/admin/editable-content";
import { loadOverrideMap } from "@/lib/admin/content-read";
import { saveTexts } from "../../content-actions";
import SavedBanner from "../SavedBanner";
import { FormPendingOverlay } from "../PendingOverlay";

export const dynamic = "force-dynamic";

export default async function AdminTextsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const groups = editableLeaves();
  const overrides = await loadOverrideMap();

  const value = (locale: "lt" | "en", ns: string, key: string, def: string) =>
    overrides[`${locale}|${ns}|${key}`] ?? def;

  return (
    <form action={saveTexts}>
      <FormPendingOverlay label="Saving… · Išsaugoma…" />
      <div className="adm-toolbar">
        <h1 className="adm-h1" style={{ marginBottom: 0 }}>Site texts</h1>
        <span className="adm-spacer" />
        <button type="submit" className="adm-btn">Save all</button>
      </div>
      <p className="adm-sub">
        Edit any text on the site, in Lithuanian and English. Clearing a field restores the
        original text. Changes go live within a few minutes.
      </p>

      {saved && <SavedBanner />}

      {Object.entries(groups).map(([namespace, leaves]) => (
        <details key={namespace} className="adm-card" style={{ marginBottom: 14 }}>
          <summary style={{ cursor: "pointer", textTransform: "capitalize", fontSize: 16 }}>
            {namespace} <span style={{ opacity: 0.4, fontSize: 13 }}>· {leaves.length}</span>
          </summary>
          <div style={{ marginTop: 16 }}>
            {leaves.map((leaf) => (
              <div key={leaf.key} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>{leaf.key}</div>
                <div className="adm-row2">
                  <div className="adm-field" style={{ marginBottom: 0 }}>
                    <label>LT</label>
                    <textarea
                      className="adm-textarea"
                      style={{ minHeight: 56 }}
                      name={`lt|${namespace}|${leaf.key}`}
                      defaultValue={value("lt", namespace, leaf.key, leaf.defaults.lt)}
                    />
                  </div>
                  <div className="adm-field" style={{ marginBottom: 0 }}>
                    <label>EN</label>
                    <textarea
                      className="adm-textarea"
                      style={{ minHeight: 56 }}
                      name={`en|${namespace}|${leaf.key}`}
                      defaultValue={value("en", namespace, leaf.key, leaf.defaults.en)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </details>
      ))}

      <div className="adm-toolbar" style={{ marginTop: 20 }}>
        <button type="submit" className="adm-btn">Save all</button>
      </div>
    </form>
  );
}
