import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { DAILY_PRODUCTION_PERFORMANCE } from '@/lib/mock-data/production';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // 1. Fetch all production orders joined with products, machines, shifts
    const ordersRes = await query(`
      SELECT 
        po.production_order_id::text as id,
        CONCAT('PO-', LPAD(po.production_order_id::text, 4, '0')) as "orderNumber",
        po.batch_number as "batchNumber",
        COALESCE(p.product_name, 'Biscuit - Coconut') as product,
        COALESCE(p.product_code, 'FG-001') as "productCode",
        COALESCE(m.machine_name, 'Baking Line 1') as machine,
        COALESCE(m.machine_code, 'MCH-001') as "machineCode",
        COALESCE(s.shift_name, 'Morning Shift A') as shift,
        COALESCE(po.planned_quantity, 0)::float as "plannedQuantity",
        COALESCE(po.actual_quantity, 0)::float as "actualQuantity",
        COALESCE(po.good_quantity, 0)::float as "goodQuantity",
        COALESCE(po.rejected_quantity, 0)::float as "rejectedQuantity",
        CASE 
          WHEN po.actual_quantity IS NOT NULL AND po.actual_quantity > 0 AND po.planned_quantity > 0 
          THEN ROUND((po.actual_quantity / po.planned_quantity * 100)::numeric, 1)::float
          WHEN po.production_status = 'Completed' THEN 100.0
          ELSE 0.0 
        END as efficiency,
        CASE 
          WHEN po.actual_quantity IS NOT NULL AND po.actual_quantity > 0 AND po.rejected_quantity IS NOT NULL 
          THEN ROUND((po.rejected_quantity / po.actual_quantity * 100)::numeric, 2)::float
          ELSE 0.0 
        END as "rejectionRate",
        COALESCE(po.downtime_minutes, 0)::int as "downtimeMinutes",
        COALESCE(po.planned_hours, 8.0)::float as "plannedHours",
        COALESCE(po.actual_hours, 8.0)::float as "actualHours",
        COALESCE(po.production_status, 'Planned') as status,
        'High' as priority,
        COALESCE(po.production_date, CURRENT_DATE)::text as "startDate",
        (COALESCE(po.production_date, CURRENT_DATE) + INTERVAL '1 day')::text as "dueDate",
        COALESCE(po.production_date, CURRENT_DATE)::text as "createdAt"
      FROM production_orders po
      LEFT JOIN products p ON po.product_id = p.product_id
      LEFT JOIN machines m ON po.machine_id = m.machine_id
      LEFT JOIN shifts s ON po.shift_id = s.shift_id
      ORDER BY po.production_order_id DESC;
    `);

    const orders = ordersRes.rows;

    // 2. Fetch products, machines, shifts for New Order Form
    const [productsRes, machinesRes, shiftsRes] = await Promise.all([
      query(`SELECT product_id as id, product_code as code, product_name as name FROM products;`),
      query(`SELECT machine_id as id, machine_code as code, machine_name as name FROM machines;`),
      query(`SELECT shift_id as id, shift_name as name FROM shifts;`),
    ]);

    // 3. Compute Aggregates
    const totalPlanned = orders.reduce((sum: number, o: any) => sum + (o.plannedQuantity || 0), 0);
    const totalActual = orders.reduce((sum: number, o: any) => sum + (o.actualQuantity || 0), 0);
    const totalGood = orders.reduce((sum: number, o: any) => sum + (o.goodQuantity || 0), 0);
    const totalRejected = orders.reduce((sum: number, o: any) => sum + (o.rejectedQuantity || 0), 0);
    const totalDowntime = orders.reduce((sum: number, o: any) => sum + (o.downtimeMinutes || 0), 0);
    const inProgressCount = orders.filter((o: any) => o.status === 'In Progress').length;
    const completedCount = orders.filter((o: any) => o.status === 'Completed').length;
    const avgEfficiency = orders.length > 0
      ? (orders.reduce((sum: number, o: any) => sum + (o.efficiency || 0), 0) / orders.length).toFixed(1)
      : '95.5';

    // 4. Product Performance Breakdown
    const prodMap: Record<string, { planned: number; actual: number; good: number; rejected: number }> = {};
    orders.forEach((o: any) => {
      if (!prodMap[o.product]) {
        prodMap[o.product] = { planned: 0, actual: 0, good: 0, rejected: 0 };
      }
      prodMap[o.product].planned += o.plannedQuantity;
      prodMap[o.product].actual += o.actualQuantity;
      prodMap[o.product].good += o.goodQuantity;
      prodMap[o.product].rejected += o.rejectedQuantity;
    });

    const productPerformance = Object.entries(prodMap).map(([product, data]) => ({
      product,
      plannedQuantity: data.planned,
      actualQuantity: data.actual,
      goodQuantity: data.good,
      rejectedQuantity: data.rejected,
      efficiency: data.planned > 0 ? Number(((data.actual / data.planned) * 100).toFixed(1)) : 0,
      rejectionRate: data.actual > 0 ? Number(((data.rejected / data.actual) * 100).toFixed(2)) : 0,
    }));

    const kpiSummary = {
      plannedProduction: totalPlanned || 0,
      plannedChangePercent: 8.4,
      actualProduction: totalActual || 0,
      actualChangePercent: 5.2,
      productionEfficiency: Number(avgEfficiency) || 92.5,
      efficiencyChangePercent: 2.1,
      rejectedQuantity: totalRejected || 0,
      rejectedChangePercent: -0.4,
      downtimeHours: Number((totalDowntime / 60).toFixed(1)) || 0,
      downtimeChangePercent: -12.5,
      completedOrders: completedCount || 0,
      completedChangePercent: 15.0,
    };

    return NextResponse.json({
      status: 'success',
      orders,
      kpis: kpiSummary,
      products: productsRes.rows,
      machines: machinesRes.rows,
      shifts: shiftsRes.rows,
      productPerformance,
      performanceTrend: DAILY_PRODUCTION_PERFORMANCE,
    });
  } catch (error: any) {
    console.error('Error in Production API GET:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'createOrder') {
      const {
        productId = 1,
        machineId = 1,
        shiftId = 1,
        plannedQuantity = 5000,
        plannedHours = 8.0,
        batchNumber,
      } = body;

      const countRes = await query(`SELECT COUNT(*) FROM production_orders;`);
      const nextBatch = batchNumber || `BAT-2026-${String(parseInt(countRes.rows[0].count) + 1).padStart(3, '0')}`;

      const insertRes = await query(`
        INSERT INTO production_orders 
          (product_id, machine_id, shift_id, batch_number, planned_quantity, actual_quantity, good_quantity, rejected_quantity, production_date, planned_hours, actual_hours, downtime_minutes, production_efficiency_pct, rejection_rate_pct, production_status)
        VALUES 
          ($1, $2, $3, $4, $5, 0, 0, 0, CURRENT_DATE, $6, 0, 0, 0, 0, 'In Progress')
        RETURNING production_order_id, batch_number;
      `, [productId, machineId, shiftId, nextBatch, plannedQuantity, plannedHours]);

      return NextResponse.json({
        status: 'success',
        message: `Production Order for batch ${nextBatch} created successfully!`,
        order: insertRes.rows[0],
      });
    }

    if (action === 'updateStatus') {
      const { orderId, newStatus } = body;
      const cleanId = parseInt(String(orderId).replace('PO-', ''), 10);

      await query(`
        UPDATE production_orders 
        SET production_status = $1 
        WHERE production_order_id = $2;
      `, [newStatus, cleanId]);

      return NextResponse.json({
        status: 'success',
        message: `Production Order status updated to '${newStatus}'!`,
      });
    }

    if (action === 'completeOrder') {
      const { orderId } = body;
      const cleanId = parseInt(String(orderId).replace('PO-', ''), 10);

      await query(`
        UPDATE production_orders 
        SET 
          production_status = 'Completed',
          actual_quantity = planned_quantity,
          good_quantity = planned_quantity - COALESCE(rejected_quantity, 0),
          production_efficiency_pct = 100.0
        WHERE production_order_id = $1;
      `, [cleanId]);

      return NextResponse.json({
        status: 'success',
        message: `Production Order marked as Completed!`,
      });
    }

    if (action === 'editOrder') {
      const { id, plannedQuantity } = body;
      const cleanId = parseInt(String(id).replace('PO-', ''), 10);

      if (plannedQuantity !== undefined) {
        await query(`
          UPDATE production_orders 
          SET planned_quantity = $1 
          WHERE production_order_id = $2;
        `, [plannedQuantity, cleanId]);
      }

      return NextResponse.json({
        status: 'success',
        message: `Production Order updated successfully!`,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in Production API POST:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
