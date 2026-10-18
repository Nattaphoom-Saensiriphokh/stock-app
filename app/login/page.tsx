"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    router.push("/products");
    router.refresh();
  }


  const input =
    "w-full rounded-lg border border-emerald-200 px-3 py-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-100 via-emerald-50 to-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-2xl text-white">
            📦
          </span>
          <h1 className="text-2xl font-bold text-emerald-950">เข้าสู่ระบบ</h1>
          <p className="mt-1 text-sm text-slate-500">ระบบจัดการสต็อกสินค้า</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} required />
          <input type="password" placeholder="รหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} className={input} required />

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 p-2.5 font-medium text-white transition hover:bg-emerald-700"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          ยังไม่มีบัญชี?{" "}

          <Link href="/signup" className="font-medium text-emerald-700 hover:underline">
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </main>
  );
}