"use server";

import prisma from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { productSchema } from "./validation";
import { requireRole } from "@/app/lib/guards";

export type FormState = {
  errors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
};

function readForm(formData: FormData) {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value;
  }
  return values;
}

function validate(values: Record<string, string>) {
  return productSchema.safeParse({
    ...values,
    status: values.status === "on",
  });
}

export async function createProduct(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {

  await requireRole(["ADMIN", "STAFF"]);

  const values = readForm(formData);
  const result = validate(values);

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values };
  }

  try {
    await prisma.product.create({ data: result.data });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return { errors: { sku: ["รหัสสินค้านี้มีอยู่แล้ว"] }, values };
    }
    throw e;
  }

  revalidatePath("/products");
  redirect("/products");
}

export async function updateProduct(
  id: number,
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole(["ADMIN", "STAFF"]);

  const values = readForm(formData);
  const result = validate(values);


  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values };
  }

  try {
    await prisma.product.update({ where: { id }, data: result.data });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return { errors: { sku: ["รหัสสินค้านี้มีอยู่แล้ว"] }, values };
    }
    throw e;
  }

  revalidatePath("/products");
  redirect("/products");
}

export async function deleteProduct(id: number) {
  await requireRole(["ADMIN"]);

  await prisma.product.delete({ where: { id } });
  revalidatePath("/products");
}