import Link from "next/link";
import { logout } from "../auth-actions";

/**
 * Authenticated admin shell — sidebar nav + logout. Everything under this route
 * group is already gated by middleware; the group keeps /admin/login chrome-free.
 */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <div className="adm-brand">Rima Berg</div>
        <nav className="adm-nav">
          <Link href="/admin">Apžvalga</Link>
          <Link href="/admin/products">Dirbiniai</Link>
          <Link href="/admin/texts">Svetainės tekstai</Link>
        </nav>
        <div className="adm-side-footer">
          <Link href="/" className="adm-nav" style={{ opacity: 0.6, fontSize: 13 }}>
            ↗ Peržiūrėti svetainę
          </Link>
          <form action={logout} style={{ marginTop: 10 }}>
            <button type="submit" className="adm-btn adm-btn-ghost adm-btn-sm">Atsijungti</button>
          </form>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
