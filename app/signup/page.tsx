"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signUp, type SignUpState } from "./actions";

const input =
  "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none";

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
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">สมัครสมาชิก</h1>

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
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </main>
  );
}