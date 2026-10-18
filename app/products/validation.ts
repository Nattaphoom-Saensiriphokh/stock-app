import { z } from "zod";
import { CATEGORIES } from "./constants";

export const productSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(1, "กรุณากรอกรหัสสินค้า")
    .max(30, "รหัสสินค้าต้องไม่เกิน 30 ตัวอักษร"),

  name: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อสินค้า")
    .max(100, "ชื่อสินค้าต้องไม่เกิน 100 ตัวอักษร"),

  category: z.enum(CATEGORIES, { message: "กรุณาเลือกหมวดหมู่" }),

  price: z.coerce
    .number({ message: "ราคาต้องเป็นตัวเลข" })
    .min(0, "ราคาต้องไม่ติดลบ"),

  quantity: z.coerce
    .number({ message: "จำนวนต้องเป็นตัวเลข" })
    .int("จำนวนต้องเป็นจำนวนเต็ม")
    .min(0, "จำนวนต้องไม่ติดลบ"),

  minStock: z.coerce
    .number({ message: "จุดสั่งซื้อต้องเป็นตัวเลข" })
    .int("จุดสั่งซื้อต้องเป็นจำนวนเต็ม")
    .min(0, "จุดสั่งซื้อต้องไม่ติดลบ"),


  status: z.boolean(),
});