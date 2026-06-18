import { notFound } from "next/navigation";
import ProductForm from "../ProductForm";
import { getProductRow, type AdminProductRow } from "@/lib/admin/products";

export const dynamic = "force-dynamic";

const EMPTY: AdminProductRow = {
  id: "", name_en: "", name_lt: "", code: "", category: "rings", status: "onRequest",
  images: [], material_en: "", material_lt: "", stones_en: "", stones_lt: "",
  sizes_en: "", sizes_lt: "", lead_time_en: "", lead_time_lt: "",
  description_en: "", description_lt: "", featured: false, is_new: false,
  hide_description: false, published: true, sort_order: 0,
};

export default async function ProductEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNewRecord = id === "new";

  let product = EMPTY;
  if (!isNewRecord) {
    const row = await getProductRow(id);
    if (!row) notFound();
    product = row;
  }

  return (
    <>
      <h1 className="adm-h1">{isNewRecord ? "Naujas dirbinys" : product.name_lt || product.name_en || product.id}</h1>
      <p className="adm-sub">{isNewRecord ? "Pridėkite dirbinį į katalogą." : `Redaguojama: ${product.id}`}</p>
      <ProductForm product={product} isNewRecord={isNewRecord} />
    </>
  );
}
