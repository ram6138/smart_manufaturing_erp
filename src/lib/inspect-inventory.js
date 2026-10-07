const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:Raja%402005@localhost:5433/smart_manufacturing_erp?schema=public",
});

async function inspectInventoryTables() {
  try {
    const tables = ['products', 'product_categories', 'inventory_stock', 'inventory_transactions', 'warehouses'];
    for (const t of tables) {
      console.log(`\n=== Table: ${t} ===`);
      const cols = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = '${t}'
        ORDER BY ordinal_position;
      `);
      console.log("Columns:", cols.rows);
      const rows = await pool.query(`SELECT * FROM "${t}" LIMIT 5;`);
      console.log("Sample Data:", rows.rows);
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

inspectInventoryTables();
