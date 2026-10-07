const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('Tables found:', tables.rows.map(r => r.table_name));

    for (const t of tables.rows) {
      const count = await pool.query(`SELECT count(*) as count FROM "${t.table_name}"`);
      console.log(`- ${t.table_name}: ${count.rows[0].count} rows`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
