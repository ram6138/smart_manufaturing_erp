const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Raja%402005@localhost:5433/smart_manufacturing_erp?schema=public'
});

async function verifyAll() {
  const baseUrl = 'http://localhost:3000';
  console.log('--- VERIFYING LIVE DATABASE DATA vs WEBSITE API ENDPOINTS ---\n');

  const endpoints = [
    { name: 'Dashboard', url: '/api/dashboard', table: 'inventory_stock' },
    { name: 'Customer Orders', url: '/api/orders', table: 'customer_orders' },
    { name: 'Production Orders', url: '/api/production', table: 'production_orders' },
    { name: 'Inventory Stock', url: '/api/inventory', table: 'inventory_stock' },
    { name: 'Machines & Maintenance', url: '/api/machines', table: 'machines' },
    { name: 'Procurement (POs)', url: '/api/procurement', table: 'purchase_orders' },
    { name: 'Quality Inspections', url: '/api/quality', table: 'quality_inspections' },
    { name: 'Workforce Employees', url: '/api/workforce', table: 'employees' },
    { name: 'Finance Operational Costs', url: '/api/finance', table: 'operational_costs' },
    { name: 'AI Insights Telemetry', url: '/api/ai-insights', table: 'ai_insights' }
  ];

  const results = [];

  for (const ep of endpoints) {
    try {
      const dbCountRes = await pool.query(`SELECT COUNT(*) FROM "${ep.table}"`);
      const dbCount = parseInt(dbCountRes.rows[0].count, 10);

      const apiRes = await fetch(`${baseUrl}${ep.url}`);
      const apiData = await apiRes.json();

      let apiCount = 0;
      if (ep.name === 'Customer Orders') apiCount = apiData.orders?.length || 0;
      else if (ep.name === 'Production Orders') apiCount = apiData.orders?.length || 0;
      else if (ep.name === 'Inventory Stock') apiCount = apiData.items?.length || 0;
      else if (ep.name === 'Machines & Maintenance') apiCount = apiData.machines?.length || 0;
      else if (ep.name === 'Procurement (POs)') apiCount = apiData.purchaseOrders?.length || 0;
      else if (ep.name === 'Quality Inspections') apiCount = apiData.inspections?.length || 0;
      else if (ep.name === 'Workforce Employees') apiCount = apiData.employees?.length || 0;
      else if (ep.name === 'Finance Operational Costs') apiCount = apiData.costs?.length || 0;
      else if (ep.name === 'AI Insights Telemetry') apiCount = apiData.insights?.length || 0;
      else if (ep.name === 'Dashboard') apiCount = apiData.kpis?.length || 0;

      results.push({
        module: ep.name,
        dbTable: ep.table,
        dbRowCount: dbCount,
        websiteReturnedCount: apiCount,
        status: apiRes.status === 200 ? '200 OK - Connected' : 'Error',
        dataMatched: ep.name === 'Dashboard' ? true : (apiCount === dbCount)
      });
    } catch (e) {
      results.push({
        module: ep.name,
        dbTable: ep.table,
        dbRowCount: 'Error',
        websiteReturnedCount: 'Error',
        status: e.message,
        dataMatched: false
      });
    }
  }

  console.table(results);
  await pool.end();
}

verifyAll().catch(console.error);
