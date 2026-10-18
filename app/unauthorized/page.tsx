import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-6xl">🚫</div>
        <h1 className="mb-2 text-3xl font-bold text-gray-800">ไม่มีสิทธิ์เข้าถึง</h1>
        <p className="mb-6 text-gray-600">
          คุณไม่มีสิทธิ์ใช้งานหน้านี้ กรุณาติดต่อผู้ดูแลระบบ
        </p>
        <Link href="/products" className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700">
          กลับหน้ารายการสินค้า
        </Link>
      </div>
    </main>
  );
}