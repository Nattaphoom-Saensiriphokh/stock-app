const { createClient } = require("@libsql/client");
const fs = require("fs");
const path = require("path");

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error("ไม่พบ TURSO_DATABASE_URL หรือ TURSO_AUTH_TOKEN");
    process.exit(1);
  }

  const client = createClient({ url, authToken });

  // ตารางจดว่า migration ไหนรันไปแล้ว จะได้รันซ้ำได้ปลอดภัย
  await client.execute(
    "CREATE TABLE IF NOT EXISTS _applied_migrations (name TEXT PRIMARY KEY)"
  );

  const applied = new Set(
    (await client.execute("SELECT name FROM _applied_migrations")).rows.map(
      (r) => r.name
    )
  );

  const dir = path.join(__dirname, "..", "prisma", "migrations");
  const folders = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();


  for (const folder of folders) {
    if (applied.has(folder)) {
      console.log("ข้าม (รันแล้ว):", folder);
      continue;
    }

    const file = path.join(dir, folder, "migration.sql");
    if (!fs.existsSync(file)) continue;

    console.log("กำลังรัน:", folder);
    await client.executeMultiple(fs.readFileSync(file, "utf8"));
    await client.execute({
      sql: "INSERT INTO _applied_migrations (name) VALUES (?)",
      args: [folder],
    });
  }

  console.log("เสร็จแล้ว");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});