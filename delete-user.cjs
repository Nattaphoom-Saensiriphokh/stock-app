const Database = require("./node_modules/@prisma/adapter-better-sqlite3/node_modules/better-sqlite3");

const db = new Database("dev.db");
const email = process.argv[2];

const result = email
  ? db.prepare("DELETE FROM User WHERE email = ?").run(email)
  : db.prepare("DELETE FROM User").run();

console.log("ลบแล้ว", result.changes, "คน");