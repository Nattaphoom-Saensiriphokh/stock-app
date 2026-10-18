"use client";

import { useActionState } from "react";
import type { FormState } from "./actions";
import { CATEGORIES } from "./constants";

type Product = {
  sku: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  minStock: number;
  status: boolean;
};

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  product?: Product;
  submitLabel: string;
};

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100";

export default function ProductForm({ action, product, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  // ถ้าเพิ่งส่งผิด ให้คงค่าที่พิมพ์ไว้ ไม่งั้นใช้ค่าจากฐานข้อมูล

  const v = (name: keyof Product) =>
    state.values?.[name] ?? (product ? String(product[name]) : "");

  const error = (name: string) =>
    state.errors?.[name] && (
      <p className="mt-1 text-sm text-red-600">{state.errors[name]![0]}</p>
    );

  const label = "mb-2 block text-sm font-medium text-gray-700";

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label htmlFor="sku" className={label}>รหัสสินค้า (SKU)</label>
        <input id="sku" name="sku" defaultValue={v("sku")} disabled={pending} className={inputClass} />
        {error("sku")}
      </div>

      <div>
        <label htmlFor="name" className={label}>ชื่อสินค้า</label>
        <input id="name" name="name" defaultValue={v("name")} disabled={pending} className={inputClass} />
        {error("name")}
      </div>

      <div>
        <label htmlFor="category" className={label}>หมวดหมู่</label>
        <select id="category" name="category" defaultValue={v("category")} disabled={pending} className={inputClass}>
          <option value="">-- เลือกหมวดหมู่ --</option>
          {CATEGORIES.map((c) => (

            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {error("category")}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label htmlFor="price" className={label}>ราคา (บาท)</label>
          <input id="price" name="price" type="number" step="0.01" defaultValue={v("price")} disabled={pending} className={inputClass} />
          {error("price")}
        </div>
        <div>
          <label htmlFor="quantity" className={label}>จำนวนคงเหลือ</label>
          <input id="quantity" name="quantity" type="number" defaultValue={v("quantity") || "0"} disabled={pending} className={inputClass} />
          {error("quantity")}
        </div>
        <div>
          <label htmlFor="minStock" className={label}>จุดสั่งซื้อ (ขั้นต่ำ)</label>
          <input id="minStock" name="minStock" type="number" defaultValue={v("minStock") || "5"} disabled={pending} className={inputClass} />
          {error("minStock")}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="status"
          defaultChecked={
            state.values ? state.values.status === "on" : (product?.status ?? true)
          }
          disabled={pending}

        />
        เปิดขายสินค้านี้
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {pending ? "กำลังบันทึก..." : submitLabel}
        </button>
        <a
          href="/products"
          className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
        >
          ยกเลิก
        </a>
      </div>
    </form>
  );
}