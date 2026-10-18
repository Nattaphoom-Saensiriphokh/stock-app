"use client";

import { deleteProduct } from "./actions";

export default function DeleteButton({ id }: { id: number }) {
  async function handleDelete() {
    if (!window.confirm("ต้องการลบสินค้านี้ใช่หรือไม่?")) return;
    await deleteProduct(id);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
    >
      ลบ
    </button>
  );
}