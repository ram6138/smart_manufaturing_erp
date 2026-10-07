const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Raja%402005@localhost:5433/smart_manufacturing_erp?schema=public'
});

async function check() {
  const tables = [
    'production_orders', 
    'customer_orders', 
    'purchase_orders', 
    'purchase_requests', 
    'machines', 
    'quality_inspections', 
    'employees', 
    'operational_costs', 
    'inventory_stock',
    'inventory_transactions'
  ];
  for (const t of tables) {
    const res = await pool.query(`SELECT * FROM "${t}" LIMIT 2`);
    console.log('=== ' + t + ' ===');
    console.log(JSON.stringify(res.rows, null, 2));
  }
  pool.end();
}
check().catch(console.error);
