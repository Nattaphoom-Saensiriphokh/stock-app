const { createClient } = require("@libsql/client");

async function main() {
  const [email, role] = process.argv.slice(2);
  const allowed = ["ADMIN", "STAFF", "USER"];

  if (!email || !allowed.includes(role)) {
    console.log('วิธีใช้: node scripts/set-role.cjs "อีเมล" STAFF');
    console.log("สิทธิ์ที่ใช้ได้: ADMIN, STAFF, USER");
    process.exit(1);
  }

  // ถ้ามีค่า Turso จะแก้บนคลาวด์ ถ้าไม่มีจะแก้ dev.db ในเครื่อง
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL ?? "file:dev.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const result = await client.execute({
    sql: "UPDATE User SET role = ? WHERE email = ?",
    args: [role, email.trim().toLowerCase()],
  });

  if (result.rowsAffected === 0) {
    console.log("ไม่พบผู้ใช้อีเมลนี้");
  } else {
    console.log(`เปลี่ยนสิทธิ์ ${email} เป็น ${role} เรียบร้อยแล้ว`);
  }
}

main().catch((e) => {
  console.error(e);

  process.exit(1);
});