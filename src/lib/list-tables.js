const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:Raja%402005@localhost:5433/smart_manufacturing_erp?schema=public",
});

async function listTables() {
  try {
    const tableRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log("=== TABLES IN DATABASE ===");
    console.log(JSON.stringify(tableRes.rows, null, 2));

    const columnsRes = await pool.query(`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `);
    console.log("=== COLUMNS IN TABLES ===");
    console.log(JSON.stringify(columnsRes.rows, null, 2));
  } catch (err) {
    console.error("Error querying schema:", err);
  } finally {
    await pool.end();
  }
}

listTables();
