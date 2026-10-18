const { createClient } = require("@libsql/client");

async function main() {
  const [email, newPassword] = process.argv.slice(2);

  if (!email || !newPassword) {
    console.log('วิธีใช้: node scripts/reset-password.cjs "อีเมล" "รหัสผ่านใหม่"');
    process.exit(1);
  }

  if (newPassword.length < 6) {
    console.log("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
    process.exit(1);
  }

  const bcrypt = (await import("bcryptjs")).default;

  // ถ้ามีค่า Turso จะแก้บนคลาวด์ ถ้าไม่มีจะแก้ dev.db ในเครื่อง
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL ?? "file:dev.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const hash = await bcrypt.hash(newPassword, 12);

  const result = await client.execute({
    sql: "UPDATE User SET passwordHash = ? WHERE email = ?",
    args: [hash, email.trim().toLowerCase()],
  });

  if (result.rowsAffected === 0) {
    console.log("ไม่พบผู้ใช้อีเมลนี้");
  } else {
    console.log("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});