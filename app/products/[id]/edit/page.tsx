import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "../../product-form";
import { updateProduct } from "../../actions";
import { requireRole } from "@/app/lib/guards";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["ADMIN", "STAFF"]);

  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId)) notFound();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">แก้ไขสินค้า</h1>
      <ProductForm
        action={updateProduct.bind(null, productId)}
        product={product}
        submitLabel="บันทึกการแก้ไข"
      />
    </main>
  );
}