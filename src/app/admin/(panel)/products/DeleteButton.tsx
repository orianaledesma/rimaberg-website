"use client";

import { deleteProduct } from "../../product-actions";

/** Delete with a confirm() guard so a stray click can't drop a piece. */
export default function DeleteButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm(`Delete “${name}”? This can't be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="adm-btn adm-btn-danger adm-btn-sm" type="submit">Delete</button>
    </form>
  );
}
