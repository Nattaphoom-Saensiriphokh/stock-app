import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { productSchema } from "@/app/products/validation";
import { apiGuard } from "@/app/lib/api-guard";
import { isUniqueViolation } from "@/app/lib/prisma-errors";

type RouteContext = { params: Promise<{ id: string }> };

async function parseId(context: RouteContext) {
  const { id } = await context.params;
  const productId = Number(id);
  return Number.isInteger(productId) ? productId : null;
}

const badId = () =>
  NextResponse.json({ message: "Product ID ไม่ถูกต้อง" }, { status: 400 });

export async function GET(_request: Request, context: RouteContext) {
  const denied = await apiGuard(["ADMIN", "STAFF", "USER"]);
  if (denied) return denied;

  const id = await parseId(context);
  if (id === null) return badId();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ message: "ไม่พบสินค้า" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(request: Request, context: RouteContext) {

  const denied = await apiGuard(["ADMIN", "STAFF"]);
  if (denied) return denied;

  const id = await parseId(context);
  if (id === null) return badId();

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
    const product = await prisma.product.update({
      where: { id },
      data: result.data,
    });
    return NextResponse.json(product);
  } catch (e: any) {
    console.error("PUT /api/products/[id] failed:", e);
    if (e?.code === "P2025") {
      return NextResponse.json({ message: "ไม่พบสินค้า" }, { status: 404 });
    }
    if (isUniqueViolation(e)) {
      return NextResponse.json({ message: "รหัสสินค้านี้มีอยู่แล้ว" }, { status: 409 });
    }
    return NextResponse.json({ message: "ไม่สามารถแก้ไขสินค้าได้" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const denied = await apiGuard(["ADMIN"]);
  if (denied) return denied;

  const id = await parseId(context);
  if (id === null) return badId();

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "ลบสินค้าเรียบร้อยแล้ว" });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ message: "ไม่พบสินค้า" }, { status: 404 });
    }
    return NextResponse.json({ message: "ไม่สามารถลบสินค้าได้" }, { status: 500 });
  }
}