import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase";
import { listProducts } from "@/lib/admin/products";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const configured = isSupabaseConfigured();
  const products = configured ? await listProducts() : [];
  const live = products.filter((p) => p.published).length;

  return (
    <>
      <h1 className="adm-h1">Dashboard</h1>
      <p className="adm-sub">Manage the Rima Berg catalogue and site text.</p>

      {!configured && (
        <div className="adm-notice error">
          Supabase isn’t configured yet. Set <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          in your environment, then run <code>supabase/schema.sql</code> and the seed script.
        </div>
      )}

      <div className="adm-row2" style={{ marginTop: 8 }}>
        <Link href="/admin/products" className="adm-card" style={{ textDecoration: "none" }}>
          <div className="adm-h1" style={{ fontSize: 40 }}>{products.length}</div>
          <div className="adm-sub" style={{ margin: 0 }}>Products · {live} live</div>
          <div style={{ marginTop: 14, color: "var(--adm-accent)" }}>Manage products →</div>
        </Link>
        <Link href="/admin/texts" className="adm-card" style={{ textDecoration: "none" }}>
          <div className="adm-h1" style={{ fontSize: 40 }}>Aa</div>
          <div className="adm-sub" style={{ margin: 0 }}>Edit any text on the site (EN · LT)</div>
          <div style={{ marginTop: 14, color: "var(--adm-accent)" }}>Edit site texts →</div>
        </Link>
      </div>
    </>
  );
}
