import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-100 via-emerald-50 to-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-6xl">🚫</div>
        <h1 className="mb-2 text-2xl font-bold text-emerald-950">ไม่มีสิทธิ์เข้าถึง</h1>
        <p className="mb-6 text-slate-600">
          คุณไม่มีสิทธิ์ใช้งานหน้านี้ กรุณาติดต่อผู้ดูแลระบบ
        </p>
        <Link
          href="/products"
          className="inline-block rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-700"
        >
          กลับหน้ารายการสินค้า
        </Link>
      </div>
    </main>
  );
}