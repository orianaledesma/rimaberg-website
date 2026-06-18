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
      <h1 className="adm-h1">Apžvalga</h1>
      <p className="adm-sub">Tvarkykite Rima Berg katalogą ir svetainės tekstus.</p>

      {!configured && (
        <div className="adm-notice error">
          Supabase dar nesukonfigūruotas. Nustatykite <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> ir <code>SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          aplinkos kintamuosius, tada paleiskite <code>supabase/schema.sql</code> ir seed skriptą.
        </div>
      )}

      <div className="adm-row2" style={{ marginTop: 8 }}>
        <Link href="/admin/products" className="adm-card" style={{ textDecoration: "none" }}>
          <div className="adm-h1" style={{ fontSize: 40 }}>{products.length}</div>
          <div className="adm-sub" style={{ margin: 0 }}>Dirbiniai · {live} paskelbta</div>
          <div style={{ marginTop: 14, color: "var(--adm-accent)" }}>Tvarkyti dirbinius →</div>
        </Link>
        <Link href="/admin/texts" className="adm-card" style={{ textDecoration: "none" }}>
          <div className="adm-h1" style={{ fontSize: 40 }}>Aa</div>
          <div className="adm-sub" style={{ margin: 0 }}>Redaguokite bet kurį svetainės tekstą (EN · LT)</div>
          <div style={{ marginTop: 14, color: "var(--adm-accent)" }}>Redaguoti tekstus →</div>
        </Link>
      </div>
    </>
  );
}
