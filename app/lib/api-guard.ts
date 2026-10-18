import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

// คืน null ถ้าผ่าน ถ้าไม่ผ่านคืน response พร้อมส่งกลับได้เลย
export async function apiGuard(roles: string[]): Promise<NextResponse | null> {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  if (!roles.includes(session.user.role)) {
    return NextResponse.json({ message: "ไม่มีสิทธิ์ใช้งาน" }, { status: 403 });
  }

  return null;
}