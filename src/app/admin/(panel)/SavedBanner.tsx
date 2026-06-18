/**
 * Confirmation shown after a successful save. Tells the editor the change is
 * live and how to verify it (hard refresh / incognito) since pages are cached
 * for a few minutes. Bilingual (EN + LT) so the client reads it in either tongue.
 */
export default function SavedBanner({ action = "saved" }: { action?: "saved" | "deleted" }) {
  const enVerb = action === "deleted" ? "Deleted" : "Saved";
  const ltVerb = action === "deleted" ? "Ištrinta" : "Išsaugota";
  return (
    <div
      className="adm-notice ok"
      role="status"
      style={{ display: "flex", flexDirection: "column", gap: 6 }}
    >
      <strong>✓ {enVerb} · {ltVerb}</strong>
      <span style={{ fontWeight: 400, opacity: 0.92 }}>
        Your change is live on the site. To see it, refresh the page with{" "}
        <b>Ctrl/Cmd + Shift + R</b>, or open it in a private / incognito window.
        Caching can delay it by about a minute.
      </span>
      <span style={{ fontWeight: 400, opacity: 0.92 }}>
        Pakeitimas paskelbtas svetainėje. Kad jį pamatytumėte, atnaujinkite puslapį{" "}
        (<b>Ctrl/Cmd + Shift + R</b>) arba atidarykite jį inkognito lange.
        Dėl podėlio pakeitimas gali pasirodyti maždaug po minutės.
      </span>
    </div>
  );
}
