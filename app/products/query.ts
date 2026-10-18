import prisma from "@/app/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";

export type ProductFilters = {
  search?: string;
  category?: string;
  status?: string; // "active" | "inactive"
  stock?: string; // "low"
};

function buildWhere(f: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  const search = f.search?.trim();
  if (search) {
    where.OR = [
      { sku: { contains: search } },
      { name: { contains: search } },
    ];
  }

  if (f.category) where.category = f.category;
  if (f.status === "active") where.status = true;
  if (f.status === "inactive") where.status = false;

  return where;
}

export async function findProducts(f: ProductFilters) {
  const products = await prisma.product.findMany({
    where: buildWhere(f),
    orderBy: { id: "asc" },

  });

  // Prisma เทียบสองคอลัมน์ (quantity <= minStock) ตรงๆ ไม่ได้ จึงกรองหลังดึงข้อมูล
  // เหมาะกับร้านเล็กๆ ที่มีสินค้าไม่เกินหลักพัน
  if (f.stock === "low") {
    return products.filter((p) => p.quantity <= p.minStock);
  }

  return products;
}