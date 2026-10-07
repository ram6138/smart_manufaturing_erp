const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Raja%402005@localhost:5433/smart_manufacturing_erp?schema=public'
});

async function cleanDuplicates() {
  console.log('--- CLEANING DUPLICATE & TEST RECORDS IN POSTGRESQL ---\n');

  // 1. Clean purchase orders (Keep clean canonical POs)
  console.log('1. Checking Purchase Orders...');
  await pool.query(`
    DELETE FROM purchase_order_items 
    WHERE purchase_order_id IN (
      SELECT purchase_order_id FROM purchase_orders WHERE purchase_order_number LIKE 'PO-AI%'
    );
  `);
  await pool.query(`
    DELETE FROM purchase_orders 
    WHERE purchase_order_number LIKE 'PO-AI%';
  `);

  await pool.query(`
    DELETE FROM purchase_order_items 
    WHERE purchase_order_id NOT IN (
      SELECT MIN(purchase_order_id) 
      FROM purchase_orders 
      GROUP BY purchase_order_number
    );
  `);

  await pool.query(`
    DELETE FROM purchase_orders 
    WHERE purchase_order_id NOT IN (
      SELECT MIN(purchase_order_id) 
      FROM purchase_orders 
      GROUP BY purchase_order_number
    );
  `);

  // 2. Clean customer orders duplicates
  console.log('2. Checking Customer Orders...');
  await pool.query(`
    DELETE FROM order_items 
    WHERE order_id NOT IN (
      SELECT MIN(order_id) 
      FROM customer_orders 
      GROUP BY order_number
    );
  `);
  await pool.query(`
    DELETE FROM customer_orders 
    WHERE order_id NOT IN (
      SELECT MIN(order_id) 
      FROM customer_orders 
      GROUP BY order_number
    );
  `);

  // 3. Clean production orders duplicates
  console.log('3. Checking Production Orders...');
  await pool.query(`
    DELETE FROM production_orders 
    WHERE production_order_id NOT IN (
      SELECT MIN(production_order_id) 
      FROM production_orders 
      GROUP BY batch_number
    );
  `);

  // 4. Clean purchase requests duplicates
  console.log('4. Checking Purchase Requests...');
  await pool.query(`
    DELETE FROM purchase_request_items 
    WHERE purchase_request_id NOT IN (
      SELECT MIN(purchase_request_id) 
      FROM purchase_requests 
      GROUP BY request_number
    );
  `);
  await pool.query(`
    DELETE FROM purchase_requests 
    WHERE purchase_request_id NOT IN (
      SELECT MIN(purchase_request_id) 
      FROM purchase_requests 
      GROUP BY request_number
    );
  `);

  // 5. Clean quality defects & inspections
  console.log('5. Checking Quality Inspections...');
  await pool.query(`
    DELETE FROM quality_defects 
    WHERE quality_inspection_id NOT IN (
      SELECT MIN(quality_inspection_id) 
      FROM quality_inspections 
      GROUP BY quality_inspection_id
    );
  `);

  // 6. Clean employees duplicates
  console.log('6. Checking Employees...');
  await pool.query(`
    DELETE FROM employee_shifts 
    WHERE employee_id NOT IN (
      SELECT MIN(employee_id) 
      FROM employees 
      GROUP BY employee_code
    );
  `);
  await pool.query(`
    DELETE FROM employees 
    WHERE employee_id NOT IN (
      SELECT MIN(employee_id) 
      FROM employees 
      GROUP BY employee_code
    );
  `);

  // 7. Clean inventory stock duplicates (per product and warehouse)
  console.log('7. Checking Inventory Stock...');
  await pool.query(`
    DELETE FROM inventory_stock 
    WHERE inventory_stock_id NOT IN (
      SELECT MIN(inventory_stock_id) 
      FROM inventory_stock 
      GROUP BY product_id, warehouse_id
    );
  `);

  console.log('\n✓ Database records deduplicated successfully!');

  // Display clean row counts
  const tables = ['purchase_orders', 'customer_orders', 'production_orders', 'purchase_requests', 'quality_inspections', 'employees', 'inventory_stock'];
  for (const t of tables) {
    const res = await pool.query(`SELECT COUNT(*) FROM "${t}"`);
    console.log(`- ${t}: ${res.rows[0].count} clean rows`);
  }

  await pool.end();
}

cleanDuplicates().catch(console.error);
