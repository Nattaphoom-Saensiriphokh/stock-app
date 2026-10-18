import ProductForm from "../product-form";
import { createProduct } from "../actions";
import { requireRole } from "@/app/lib/guards";

export default async function CreateProductPage() {
  await requireRole(["ADMIN", "STAFF"]);

  return (
    <main className="mx-auto max-w-2xl p-6">
      <a href="/products" className="text-sm text-emerald-700 hover:underline">
        ← กลับรายการสินค้า
      </a>
      <h1 className="mb-6 mt-2 text-3xl font-bold text-emerald-950">เพิ่มสินค้า</h1>
      <ProductForm action={createProduct} submitLabel="บันทึก" />
    </main>
  );
}