const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Raja%402005@localhost:5433/smart_manufacturing_erp?schema=public'
});
async function check() {
  const res = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'purchase_request_items';
  `);
  console.log('purchase_request_items columns:', res.rows);
  const res2 = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'purchase_requests';
  `);
  console.log('purchase_requests columns:', res2.rows);
  pool.end();
}
check();
