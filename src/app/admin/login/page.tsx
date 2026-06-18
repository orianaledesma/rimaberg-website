import { login } from "../auth-actions";

/** Shared-password login. Posts to the `login` server action. */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next = "/admin" } = await searchParams;

  return (
    <div className="adm-login">
      <form action={login} className="adm-card">
        <div className="adm-brand" style={{ marginBottom: 18 }}>Rima Berg · Administravimas</div>
        {error && <div className="adm-notice error">Neteisingas slaptažodis.</div>}
        <input type="hidden" name="next" value={next} />
        <div className="adm-field">
          <label htmlFor="password">Slaptažodis</label>
          <input
            id="password"
            name="password"
            type="password"
            className="adm-input"
            autoComplete="current-password"
            autoFocus
            required
          />
        </div>
        <button type="submit" className="adm-btn" style={{ width: "100%", justifyContent: "center" }}>
          Prisijungti
        </button>
      </form>
    </div>
  );
}
