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
      className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
    >
      ลบ
    </button>
  );
}