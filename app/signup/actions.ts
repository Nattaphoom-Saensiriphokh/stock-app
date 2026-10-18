"use server";

import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";

export type SignUpState = { error?: string; success?: boolean };

export async function signUp(
  _state: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const confirm = formData.get("confirmPassword")?.toString();

  if (!name || !email || !password || !confirm) {
    return { error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "รูปแบบ Email ไม่ถูกต้อง" };
  }
  if (password.length < 6) {
    return { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" };
  }
  if (password !== confirm) {
    return { error: "รหัสผ่านไม่ตรงกัน" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Email นี้ถูกใช้งานแล้ว" };


  // คนแรกที่สมัครจะเป็น ADMIN ที่เหลือเป็น USER เสมอ
  const userCount = await prisma.user.count();

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: userCount === 0 ? "ADMIN" : "USER",
    },
  });

  return { success: true };
}