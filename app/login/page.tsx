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


  const input = "w-full rounded border border-gray-300 p-2";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold">เข้าสู่ระบบ</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} required />
          <input type="password" placeholder="รหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} className={input} required />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700">
            เข้าสู่ระบบ
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ยังไม่มีบัญชี?{" "}
          <Link href="/signup" className="font-medium text-blue-600 hover:underline">สมัครสมาชิก</Link>
        </p>
      </div>
    </main>
  );
}