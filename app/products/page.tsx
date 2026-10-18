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
  const lowCount = products.filter((p) => p.quantity <= p.minStock).length;

  const outCount = products.filter((p) => p.quantity === 0).length;

  return (
    <div className="min-h-screen">
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-lg text-white">
              📦
            </span>
            <span className="text-lg font-bold text-emerald-900">Stock Manager</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-600 sm:inline">{session.user.name}</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              {role}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button className="rounded-lg border border-emerald-200 px-3 py-1.5 text-emerald-700 transition hover:bg-emerald-50">
                ออกจากระบบ
              </button>
            </form>
          </div>
        </div>
      </header>


      <main className="mx-auto max-w-6xl p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-emerald-950">จัดการสต็อกสินค้า</h1>
          <p className="mt-1 text-slate-600">
            {isFiltering ? "ผลการค้นหา" : "สินค้าทั้งหมดในร้าน"}
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{isFiltering ? "พบสินค้า" : "สินค้าทั้งหมด"}</p>
            <p className="mt-1 text-3xl font-bold text-emerald-600">{products.length}</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">ใกล้หมด</p>
            <p className="mt-1 text-3xl font-bold text-amber-500">{lowCount}</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">หมดสต็อก</p>
            <p className="mt-1 text-3xl font-bold text-red-500">{outCount}</p>
          </div>
        </div>

        <SearchForm {...filters} />

        {canEdit && (
          <a
            href="/products/create"
            className="mb-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
          >
            + เพิ่มสินค้า
          </a>

        )}

        <div className="overflow-x-auto rounded-2xl border border-emerald-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-emerald-100/70 text-emerald-900">
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
                  <tr key={p.id} className="border-t border-emerald-50 transition hover:bg-emerald-50/60">
                    <td className="px-4 py-3 text-slate-500">{p.sku}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs text-emerald-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">{p.price.toLocaleString()} ฿</td>
                    <td className="px-4 py-3">
                      <span className={low ? "font-semibold text-red-600" : ""}>
                        {p.quantity}
                      </span>

                      {low && (
                        <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                          {p.quantity === 0 ? "หมด" : "ใกล้หมด"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {p.status ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          ขาย
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                          เลิกขาย
                        </span>
                      )}
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <a
                            href={`/products/${p.id}/edit`}
                            className="rounded-lg border border-emerald-300 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
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
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    {isFiltering ? "ไม่พบสินค้าที่ตรงกับเงื่อนไข" : "ยังไม่มีสินค้า"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}