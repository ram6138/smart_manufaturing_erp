const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:Raja%402005@localhost:5433/smart_manufacturing_erp?schema=public",
});

async function checkDatabaseData() {
  try {
    console.log("=== CUSTOMER ORDERS ===");
    const orders = await pool.query(`
      SELECT o.*, c.customer_name 
      FROM customer_orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id;
    `);
    console.log(orders.rows);

    console.log("=== ORDER ITEMS ===");
    const items = await pool.query(`
      SELECT oi.*, p.product_name, p.product_code 
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.product_id;
    `);
    console.log(items.rows);

    console.log("=== INVENTORY & STOCK VALUATION ===");
    const stock = await pool.query(`
      SELECT 
        SUM(current_quantity) as total_units,
        SUM(inventory_value) as total_inventory_value,
        COUNT(DISTINCT product_id) as total_products,
        COUNT(DISTINCT warehouse_id) as total_warehouses
      FROM inventory_stock;
    `);
    console.log(stock.rows[0]);

    console.log("=== USERS & ROLES ===");
    const users = await pool.query(`
      SELECT u.username, u.email, r.role_name, d.department_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.role_id
      LEFT JOIN departments d ON u.department_id = d.department_id;
    `);
    console.log(users.rows);

  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

checkDatabaseData();
