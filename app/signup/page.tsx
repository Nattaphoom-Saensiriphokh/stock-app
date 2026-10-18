"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signUp, type SignUpState } from "./actions";

const input =
  "w-full rounded-lg border border-emerald-200 px-3 py-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

export default function SignUpPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<SignUpState, FormData>(
    signUp,
    {},
  );

  useEffect(() => {
    if (state.success) router.push("/login");
  }, [state.success, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-100 via-emerald-50 to-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-2xl text-white">
            📦
          </span>
          <h1 className="text-2xl font-bold text-emerald-950">สมัครสมาชิก</h1>
          <p className="mt-1 text-sm text-slate-500">สร้างบัญชีเพื่อใช้งานระบบ</p>
        </div>


        <form action={formAction} className="space-y-4">
          <input name="name" placeholder="ชื่อ" className={input} required />
          <input name="email" type="email" placeholder="Email" className={input} required />
          <input name="password" type="password" placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)" className={input} required />
          <input name="confirmPassword" type="password" placeholder="ยืนยันรหัสผ่าน" className={input} required />

          {state.error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.error}</div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {pending ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" className="font-medium text-emerald-700 hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </main>
  );
}