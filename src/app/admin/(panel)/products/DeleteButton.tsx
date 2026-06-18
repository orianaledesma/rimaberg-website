"use client";

import { deleteProduct } from "../../product-actions";
import { FormPendingOverlay } from "../PendingOverlay";

/** Delete with a confirm() guard so a stray click can't drop a piece. */
export default function DeleteButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm(`Ištrinti „${name}"? Šio veiksmo nebus galima atšaukti.`)) e.preventDefault();
      }}
    >
      <FormPendingOverlay label="Deleting… · Trinama…" />
      <input type="hidden" name="id" value={id} />
      <button className="adm-btn adm-btn-danger adm-btn-sm" type="submit">Delete</button>
    </form>
  );
}
