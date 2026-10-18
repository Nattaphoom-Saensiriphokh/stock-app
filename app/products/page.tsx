import DeleteButton from "./delete-button";
import SearchForm from "./search-form";
import { findProducts } from "./query";
import { requireRole } from "@/app/lib/guards";
import { signOut } from "@/app/auth";

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    stock?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const session = await requireRole(["ADMIN", "STAFF", "USER"]);
  const role = session.user.role;
  const canEdit = role === "ADMIN" || role === "STAFF";
  const canDelete = role === "ADMIN";

  const params = await searchParams;
  const filters = {
    search: params.search ?? "",
    category: params.category ?? "",
    status: params.status ?? "",
    stock: params.stock ?? "",
  };
  const isFiltering = Object.values(filters).some(Boolean);

  const products = await findProducts(filters);


  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
        <span>
          {session.user.name}{" "}
          <span className="rounded bg-gray-100 px-2 py-0.5">{role}</span>
        </span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button className="text-red-600 hover:underline">ออกจากระบบ</button>
        </form>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
        <p className="mt-2 text-gray-600">
          {isFiltering ? "พบสินค้า" : "จำนวนสินค้า"}:{" "}
          <strong>{products.length}</strong> รายการ
        </p>
      </div>

      <SearchForm {...filters} />

      {canEdit && (
        <a
          href="/products/create"
          className="mb-4 inline-block rounded bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >

          เพิ่มสินค้า
        </a>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 font-semibold">รหัส</th>
              <th className="px-4 py-3 font-semibold">ชื่อสินค้า</th>
              <th className="px-4 py-3 font-semibold">หมวดหมู่</th>
              <th className="px-4 py-3 font-semibold">ราคา</th>
              <th className="px-4 py-3 font-semibold">คงเหลือ</th>
              <th className="px-4 py-3 font-semibold">สถานะ</th>
              {canEdit && <th className="px-4 py-3 font-semibold">จัดการ</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const low = p.quantity <= p.minStock;
              return (
                <tr key={p.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{p.sku}</td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">{p.price.toLocaleString()} ฿</td>
                  <td className="px-4 py-3">
                    <span className={low ? "font-semibold text-red-600" : ""}>
                      {p.quantity}
                    </span>
                    {low && (
                      <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">

                        ใกล้หมด
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{p.status ? "ขาย" : "เลิกขาย"}</td>
                  {canEdit && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <a
                          href={`/products/${p.id}/edit`}
                          className="rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-600"
                        >
                          แก้ไข
                        </a>
                        {canDelete && <DeleteButton id={p.id} />}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={canEdit ? 7 : 6}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {isFiltering ? "ไม่พบสินค้าที่ตรงกับเงื่อนไข" : "ยังไม่มีสินค้า"}
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </main>
  );
}