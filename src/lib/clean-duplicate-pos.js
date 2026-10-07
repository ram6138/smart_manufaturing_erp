const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Raja%402005@localhost:5433/smart_manufacturing_erp?schema=public'
});

async function run() {
  try {
    const prCols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'purchase_requests';");
    console.log('PR columns:', prCols.rows.map(r => r.column_name));
    const priCols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'purchase_request_items';");
    console.log('PRI columns:', priCols.rows.map(r => r.column_name));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
