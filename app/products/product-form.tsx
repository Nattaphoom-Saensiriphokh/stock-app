import { CATEGORIES } from "./constants";
import type { ProductFilters } from "./query";

const field =
  "w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500";
const label = "mb-1 block text-sm font-medium text-gray-700";

export default function SearchForm({
  search = "",
  category = "",
  status = "",
  stock = "",
}: ProductFilters) {
  return (
    <form
      method="GET"
      className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label htmlFor="search" className={label}>ค้นหา</label>
          <input
            id="search"
            name="search"
            defaultValue={search}
            placeholder="รหัสหรือชื่อสินค้า..."
            className={field}
          />
        </div>

        <div>
          <label htmlFor="category" className={label}>หมวดหมู่</label>

          <select id="category" name="category" defaultValue={category} className={field}>
            <option value="">ทุกหมวดหมู่</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className={label}>สถานะ</label>
          <select id="status" name="status" defaultValue={status} className={field}>
            <option value="">ทั้งหมด</option>
            <option value="active">ขาย</option>
            <option value="inactive">เลิกขาย</option>
          </select>
        </div>

        <div>
          <label htmlFor="stock" className={label}>สต็อก</label>
          <select id="stock" name="stock" defaultValue={stock} className={field}>
            <option value="">ทั้งหมด</option>
            <option value="low">ใกล้หมด</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          ค้นหา

        </button>
        <a
          href="/products"
          className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
        >
          ล้าง
        </a>
      </div>
    </form>
  );
}