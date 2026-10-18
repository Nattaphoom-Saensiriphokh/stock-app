import ProductForm from "../product-form";
import { createProduct } from "../actions";
import { requireRole } from "@/app/lib/guards";

export default async function CreateProductPage() {
  await requireRole(["ADMIN", "STAFF"]);

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">เพิ่มสินค้า</h1>
      <ProductForm action={createProduct} submitLabel="บันทึก" />
    </main>
  );
}