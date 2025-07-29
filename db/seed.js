import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  for (let i = 0; i < 4; i++) {
    const sql = `INSERT INTO folders (name) VALUES ($1) RETURNING *`;
    const {rows }= await db.query(sql, ["folder"+i]);
    const folder = rows[0];
    for (let j =0; j<5;j++) {
      const sql = `INSERT INTO files (name,size,folder_id) VALUES ($1,$2,$3)`;
      await db.query(sql, ["files" + j, 1000+j ,folder.id]);}  
    }
}
