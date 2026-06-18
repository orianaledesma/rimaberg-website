import Link from "next/link";
import { listProducts } from "@/lib/admin/products";
import { moveProduct } from "../../product-actions";
import DeleteButton from "./DeleteButton";
import SavedBanner from "../SavedBanner";
import { FormPendingOverlay } from "../PendingOverlay";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const products = await listProducts();

  return (
    <>
      <div className="adm-toolbar">
        <h1 className="adm-h1" style={{ marginBottom: 0 }}>Dirbiniai</h1>
        <span className="adm-spacer" />
        <Link href="/admin/products/new" className="adm-btn">+ Naujas dirbinys</Link>
      </div>

      {(saved || deleted) && <SavedBanner action={deleted ? "deleted" : "saved"} />}

      {products.length === 0 ? (
        <div className="adm-card">Dirbinių dar nėra. Sukurkite pirmą.</div>
      ) : (
        <table className="adm-table">
          <thead>
            <tr>
              <th style={{ width: 56 }}></th>
              <th>Pavadinimas</th>
              <th>Kategorija</th>
              <th>Matomumas</th>
              <th style={{ width: 90 }}>Eiliškumas</th>
              <th style={{ width: 120 }}></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.id}>
                <td>
                  {p.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="adm-thumb" src={p.images[0]} alt="" />
                  ) : (
                    <div className="adm-thumb" />
                  )}
                </td>
                <td>
                  <Link href={`/admin/products/${p.id}`} style={{ color: "var(--adm-accent)" }}>
                    {p.name_lt || p.name_en || p.id}
                  </Link>
                  <div style={{ fontSize: 12, opacity: 0.5 }}>{p.code || p.id}</div>
                </td>
                <td style={{ textTransform: "capitalize" }}>{p.category}</td>
                <td>
                  <span className={`adm-tag ${p.published ? "live" : "draft"}`}>
                    {p.published ? "Paskelbta" : "Juodraštis"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    <form action={moveProduct}>
                      <FormPendingOverlay label="Reordering… · Pertvarkoma…" />
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="dir" value="up" />
                      <button className="adm-iconbtn" type="submit" disabled={i === 0} aria-label="Kelti aukštyn">↑</button>
                    </form>
                    <form action={moveProduct}>
                      <FormPendingOverlay label="Reordering… · Pertvarkoma…" />
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="dir" value="down" />
                      <button className="adm-iconbtn" type="submit" disabled={i === products.length - 1} aria-label="Nuleisti žemyn">↓</button>
                    </form>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link href={`/admin/products/${p.id}`} className="adm-btn adm-btn-ghost adm-btn-sm">Redaguoti</Link>
                    <DeleteButton id={p.id} name={p.name_lt || p.name_en || p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
