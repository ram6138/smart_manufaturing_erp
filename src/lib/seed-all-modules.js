const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log('--- Starting Complete ERP Database Seeding ---');
    await client.query('BEGIN');

    // 1. Roles
    await client.query(`
      INSERT INTO roles (role_id, role_name, description) VALUES
      (1, 'Admin', 'Full administrative system access'),
      (2, 'Production Lead', 'Plant production and job order management'),
      (3, 'Quality Inspector', 'QA inspections and defect audits'),
      (4, 'Maintenance Engineer', 'Machine health and service scheduling'),
      (5, 'HR Manager', 'Workforce shift and productivity monitoring'),
      (6, 'Finance Director', 'Operational spend and financial analytics')
      ON CONFLICT (role_id) DO UPDATE SET role_name = EXCLUDED.role_name;
    `);

    // 2. Departments
    await client.query(`
      INSERT INTO departments (department_id, department_name, description) VALUES
      (1, 'Production & Operations', 'Main manufacturing and shop floor assembly'),
      (2, 'Quality Assurance', 'Quality inspection and defect monitoring'),
      (3, 'Supply Chain & Procurement', 'Raw materials, vendor sourcing and purchasing'),
      (4, 'Maintenance & Engineering', 'Machine telemetry, preventive upkeep and repairs'),
      (5, 'Warehouse & Logistics', 'Finished goods storage and order fulfillment'),
      (6, 'Finance & Accounting', 'Operational expenses and budget allocations')
      ON CONFLICT (department_id) DO UPDATE SET department_name = EXCLUDED.department_name;
    `);

    // 3. Users
    await client.query(`
      INSERT INTO users (user_id, username, email, password_hash, role_id, department_id, is_active, created_at) VALUES
      (1, 'admin', 'admin@manufacturing.com', 'scrypt:admin', 1, 1, true, NOW()),
      (2, 'inspector_anita', 'anita.sharma@manufacturing.com', 'scrypt:inspect', 3, 2, true, NOW()),
      (3, 'lead_rajesh', 'rajesh.kumar@manufacturing.com', 'scrypt:prod', 2, 1, true, NOW()),
      (4, 'tech_vikram', 'vikram.patel@manufacturing.com', 'scrypt:maint', 4, 4, true, NOW()),
      (5, 'hr_priya', 'priya.nair@manufacturing.com', 'scrypt:hr', 5, 1, true, NOW()),
      (6, 'finance_rahul', 'rahul.mehta@manufacturing.com', 'scrypt:fin', 6, 6, true, NOW())
      ON CONFLICT (user_id) DO UPDATE SET username = EXCLUDED.username;
    `);

    // 4. Shifts
    await client.query(`
      INSERT INTO shifts (shift_id, shift_name, start_time, end_time) VALUES
      (1, 'Morning Shift A', '06:00:00', '14:00:00'),
      (2, 'Afternoon Shift B', '14:00:00', '22:00:00'),
      (3, 'Night Shift C', '22:00:00', '06:00:00')
      ON CONFLICT (shift_id) DO UPDATE SET shift_name = EXCLUDED.shift_name;
    `);

    // 5. Suppliers
    await client.query(`
      INSERT INTO suppliers (supplier_id, supplier_code, supplier_name, city, phone, email, is_active, created_at) VALUES
      (1, 'SUP-001', 'AgroFlour Millers Corp', 'Mumbai', '+91 98200 12345', 'sales@agroflour.in', true, NOW()),
      (2, 'SUP-002', 'Sweetener & Sugar Refineries', 'Pune', '+91 98200 54321', 'orders@sweetsugar.in', true, NOW()),
      (3, 'SUP-003', 'Prime Flex Packaging Solutions', 'Ahmedabad', '+91 98200 98765', 'contact@primeflex.com', true, NOW()),
      (4, 'SUP-004', 'PureDairy Farms Cooperative', 'Anand', '+91 98200 45678', 'supply@puredairy.coop', true, NOW())
      ON CONFLICT (supplier_id) DO UPDATE SET supplier_name = EXCLUDED.supplier_name;
    `);

    // 6. Cost Categories
    await client.query(`
      INSERT INTO cost_categories (cost_category_id, category_name, description) VALUES
      (1, 'Electricity & Utilities', 'Power draw for heavy machinery and ovens'),
      (2, 'Direct Labor', 'Shift operator wages and overtime'),
      (3, 'Maintenance & Spares', 'Replacement parts and lubrication'),
      (4, 'Freight & Logistics', 'Transportation and warehouse holding'),
      (5, 'Quality & Testing', 'Lab supplies, certification and inspections')
      ON CONFLICT (cost_category_id) DO UPDATE SET category_name = EXCLUDED.category_name;
    `);

    // Fetch existing customer orders and products
    const ordersRes = await client.query(`SELECT order_id FROM customer_orders LIMIT 5;`);
    const validOrderId = ordersRes.rows.length > 0 ? ordersRes.rows[0].order_id : null;
    const prodsRes = await client.query(`SELECT product_id FROM products LIMIT 5;`);
    const validProdId1 = prodsRes.rows[0]?.product_id || 1;
    const validProdId2 = prodsRes.rows[1]?.product_id || validProdId1;
    const validProdId3 = prodsRes.rows[2]?.product_id || validProdId1;

    // 7. Production Orders
    await client.query(`DELETE FROM quality_inspections;`);
    await client.query(`DELETE FROM production_orders;`);
    await client.query(`
      INSERT INTO production_orders 
        (production_order_id, order_id, product_id, machine_id, shift_id, batch_number, planned_quantity, actual_quantity, good_quantity, rejected_quantity, production_date, planned_hours, actual_hours, downtime_minutes, production_efficiency_pct, rejection_rate_pct, unit_production_cost, total_production_cost, production_status)
      VALUES 
        (1, $1, $2, 1, 1, 'BAT-2026-001', 5000, 4850, 4780, 70, CURRENT_DATE, 8.0, 7.8, 12, 97.0, 1.44, 18.50, 89725.00, 'In Progress'),
        (2, $1, $3, 2, 1, 'BAT-2026-002', 4000, 4000, 3950, 50, CURRENT_DATE - INTERVAL '1 day', 6.5, 6.4, 6, 98.7, 1.25, 22.00, 88000.00, 'Completed'),
        (3, $1, $4, 3, 2, 'BAT-2026-003', 3000, 2400, 2360, 40, CURRENT_DATE, 6.0, 5.0, 35, 80.0, 1.66, 26.50, 63600.00, 'In Progress'),
        (4, $1, $2, 1, 3, 'BAT-2026-004', 6000, 6000, 5920, 80, CURRENT_DATE - INTERVAL '2 days', 8.5, 8.5, 0, 100.0, 1.33, 18.20, 109200.00, 'Completed'),
        (5, $1, $3, 2, 2, 'BAT-2026-005', 4500, 1200, 1180, 20, CURRENT_DATE, 7.5, 2.5, 0, 89.5, 1.67, 21.80, 26160.00, 'In Progress')
      ON CONFLICT DO NOTHING;
    `, [validOrderId, validProdId1, validProdId2, validProdId3]);

    // 8. Quality Inspections
    await client.query(`
      INSERT INTO quality_inspections 
        (quality_inspection_id, production_order_id, inspection_date, batch_number, inspector_id, inspected_quantity, passed_quantity, defective_quantity, defect_found, defect_type, defect_count, defect_severity, quality_status, defect_rate_pct, root_cause, corrective_action)
      VALUES 
        (1, 1, CURRENT_DATE, 'BAT-2026-001', 1, 500, 492, 8, true, 'Seal Misalignment', 8, 'Low', 'Passed with Minor Notes', 1.60, 'Temperature fluctuation on sealing jaw 2', 'Calibrated sealing jaw PID controller'),
        (2, 2, CURRENT_DATE - INTERVAL '1 day', 'BAT-2026-002', 2, 400, 396, 4, true, 'Slight Overbake', 4, 'Low', 'Passed', 1.00, 'Oven zone 3 conveyor speed variance', 'Adjusted gear ratio timer'),
        (3, 3, CURRENT_DATE, 'BAT-2026-003', 1, 300, 295, 5, true, 'Weight Variance', 5, 'Medium', 'Passed', 1.67, 'Hopper feed gate sensor dust', 'Cleaned optical beam reflectors'),
        (4, 4, CURRENT_DATE - INTERVAL '2 days', 'BAT-2026-004', 2, 600, 594, 6, false, 'None', 0, 'None', 'Passed (Gold Standard)', 1.00, 'Perfect batch tolerances', 'Batch archived to premium standard')
      ON CONFLICT DO NOTHING;
    `);

    // 9. Purchase Orders & Items
    await client.query(`DELETE FROM purchase_order_items;`);
    await client.query(`DELETE FROM purchase_orders;`);
    await client.query(`
      INSERT INTO purchase_orders 
        (purchase_order_id, purchase_order_number, supplier_id, order_date, expected_delivery_date, actual_delivery_date, order_status, procurement_status, payment_status, total_order_value, delivery_performance, quality_rating, created_at)
      VALUES 
        (1, 'PO-2026-101', 1, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '2 days', NULL, 'Confirmed', 'In Transit', 'Partially Paid', 125000.00, 'On-Time', 98.5, NOW()),
        (2, 'PO-2026-102', 2, CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day', 'Delivered', 'Completed', 'Paid', 84000.00, 'On-Time', 99.2, NOW()),
        (3, 'PO-2026-103', 3, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days', NULL, 'Pending Approval', 'Processing', 'Pending', 45000.00, 'Normal', 95.0, NOW()),
        (4, 'PO-2026-104', 4, CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '3 days', NULL, 'Confirmed', 'Dispatched', 'Pending', 62000.00, 'On-Time', 97.8, NOW())
      ON CONFLICT DO NOTHING;
    `);

    await client.query(`
      INSERT INTO purchase_order_items 
        (purchase_order_item_id, purchase_order_id, product_id, requested_quantity, ordered_quantity, quoted_unit_price, negotiated_unit_price, received_quantity, rejected_quantity, accepted_quantity)
      VALUES 
        (1, 1, $1, 5000, 5000, 26.00, 25.00, 0, 0, 0),
        (2, 2, $2, 2000, 2000, 43.00, 42.00, 2000, 0, 2000),
        (3, 3, $3, 150, 150, 310.00, 300.00, 0, 0, 0),
        (4, 4, $1, 1500, 1500, 42.50, 41.33, 0, 0, 0)
      ON CONFLICT DO NOTHING;
    `, [validProdId1, validProdId2, validProdId3]);

    // 10. Employees & Shifts (Workforce)
    await client.query(`DELETE FROM employee_shifts;`);
    await client.query(`DELETE FROM employees;`);
    await client.query(`
      INSERT INTO employees 
        (employee_id, employee_code, employee_name, department_id, job_role, primary_skill, supervisor_id, is_active)
      VALUES 
        (1, 'EMP-101', 'Rajesh Kumar', 1, 'Senior Production Lead', 'Baking Oven Master & HACCP', NULL, true),
        (2, 'EMP-102', 'Anita Sharma', 2, 'QA Inspection Specialist', 'Microbial & Weight Audit', 1, true),
        (3, 'EMP-103', 'Vikram Patel', 4, 'Master Maintenance Tech', 'PLC Automation & Thermal Sensors', 1, true),
        (4, 'EMP-104', 'Pooja Iyer', 1, 'Packaging Line Operator', 'Flow-Wrap Machine Tuning', 1, true),
        (5, 'EMP-105', 'Amit Deshmukh', 5, 'Warehouse Dispatch Supervisor', 'WMS Logistics & Inventory Audit', NULL, true)
      ON CONFLICT (employee_id) DO NOTHING;
    `);

    await client.query(`
      INSERT INTO employee_shifts 
        (employee_shift_id, employee_id, shift_id, work_date, scheduled_hours, actual_working_hours, overtime_hours, tasks_completed, productivity_pct, work_efficiency, performance_rating, training_completed, safety_incident, production_line, attendance_status)
      VALUES 
        (1, 1, 1, CURRENT_DATE, 8.0, 8.0, 1.5, 48, 97.5, 98.0, 4.8, true, false, 'Line 1 - Baking', 'Present'),
        (2, 2, 1, CURRENT_DATE, 8.0, 8.0, 0.5, 32, 98.2, 99.0, 4.9, true, false, 'QA Lab & Line 1', 'Present'),
        (3, 3, 2, CURRENT_DATE, 8.0, 8.0, 2.0, 14, 95.0, 94.5, 4.7, true, false, 'Plant 1 Maintenance', 'Present'),
        (4, 4, 1, CURRENT_DATE, 8.0, 8.0, 1.0, 65, 94.0, 93.8, 4.6, true, false, 'Line 2 - Packaging', 'Present'),
        (5, 5, 1, CURRENT_DATE, 8.0, 8.0, 0.0, 28, 92.5, 93.0, 4.5, true, false, 'Main Warehouse', 'Present')
      ON CONFLICT DO NOTHING;
    `);

    // 11. Operational Costs (Finance)
    await client.query(`DELETE FROM operational_costs;`);
    await client.query(`
      INSERT INTO operational_costs (cost_id, transaction_date, department_id, cost_category, amount, description) VALUES
      (1, CURRENT_DATE - INTERVAL '3 days', 1, 'Electricity & Power Draw', 45000.00, '3-Phase Grid Power consumption for Plant 1 Baking lines'),
      (2, CURRENT_DATE - INTERVAL '5 days', 1, 'Direct Labor', 82000.00, 'Bi-weekly operator shift wages'),
      (3, CURRENT_DATE - INTERVAL '2 days', 4, 'Machine Spares & Lubricants', 12500.00, 'Synthetic high-temp grease and replacement thermal couplers'),
      (4, CURRENT_DATE - INTERVAL '1 day', 3, 'Freight & Logistics Inward', 18000.00, 'Refrigerated transit for raw materials from Anand hub'),
      (5, CURRENT_DATE, 2, 'Laboratory Testing & Consumables', 6800.00, 'Moisture analyzer reagents and microbial culture plates')
      ON CONFLICT DO NOTHING;
    `);

    // 12. AI Insights
    await client.query(`DELETE FROM ai_insights;`);
    await client.query(`
      INSERT INTO ai_insights (insight_id, insight_date, module_name, insight_type, severity, insight_text, recommended_action) VALUES
      (1, NOW(), 'Energy & Production', 'Cost Optimization', 'High', 'Shift high-heat baking batches to Shift 3 (Night 22:00-06:00) to exploit 18% off-peak tariff savings.', 'Rebalance production schedule for Oven 1 and Oven 2.'),
      (2, NOW() - INTERVAL '1 day', 'Maintenance Telemetry', 'Predictive Alert', 'Critical', 'Vibration velocity variance detected on Rotary Deck Baking Oven 2 (MCH-OVN-002) drive shaft.', 'Execute scheduled lubrication during next 30-minute shift handover.'),
      (3, NOW() - INTERVAL '2 days', 'Procurement & Inventory', 'Strategic Reorder', 'Medium', 'Refined sugar holding stock is projected to breach buffer minimums in 5 days at current run-rate.', 'Issue automated Purchase Order PO-2026-105 for 5,000 kg fine granule cane sugar.');
    `);

    await client.query('COMMIT');
    console.log('--- Complete ERP Database Seeding Succeeded! ---');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seeding error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
