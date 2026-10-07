const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:Raja%402005@localhost:5433/smart_manufacturing_erp?schema=public",
});

async function inspectOrderSchema() {
  try {
    for (const t of ['customers', 'customer_orders', 'order_items']) {
      console.log(`\n=== Table: ${t} ===`);
      const cols = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = '${t}'
        ORDER BY ordinal_position;
      `);
      console.log(cols.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

inspectOrderSchema();
