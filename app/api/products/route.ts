import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { productSchema } from "@/app/products/validation";
import { findProducts } from "@/app/products/query";
import { apiGuard } from "@/app/lib/api-guard";
import { isUniqueViolation } from "@/app/lib/prisma-errors";

export async function GET(request: Request) {
  const denied = await apiGuard(["ADMIN", "STAFF", "USER"]);
  if (denied) return denied;

  const q = new URL(request.url).searchParams;

  const products = await findProducts({
    search: q.get("search") ?? "",
    category: q.get("category") ?? "",
    status: q.get("status") ?? "",
    stock: q.get("stock") ?? "",
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const denied = await apiGuard(["ADMIN", "STAFF"]);
  if (denied) return denied;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "รูปแบบ JSON ไม่ถูกต้อง" }, { status: 400 });
  }


  const result = productSchema.safeParse({
    ...body,
    status: body?.status ?? true,
  });

  if (!result.success) {
    return NextResponse.json(
      { message: "ข้อมูลไม่ถูกต้อง", errors: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const product = await prisma.product.create({ data: result.data });
    return NextResponse.json(product, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/products failed:", e);
    if (isUniqueViolation(e)) {
      return NextResponse.json({ message: "รหัสสินค้านี้มีอยู่แล้ว" }, { status: 409 });
    }
    return NextResponse.json({ message: "ไม่สามารถสร้างสินค้าได้" }, { status: 500 });
  }
}