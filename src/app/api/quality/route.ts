import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // 1. Fetch Quality Inspections joined with Production Orders, Products & Users
    const inspRes = await query(`
      SELECT 
        qi.quality_inspection_id::text as id,
        CONCAT('INS-', LPAD(qi.quality_inspection_id::text, 4, '0')) as "inspectionId",
        qi.batch_number as "batchNumber",
        COALESCE(p.product_name, 'Biscuit Product') as "productName",
        COALESCE(p.product_code, 'FG-001') as "productCode",
        qi.inspection_date::text as "inspectionDate",
        COALESCE(u.username, 'Anita Sharma (QA Lead)') as "inspectorName",
        COALESCE(qi.inspected_quantity, 0)::float as "inspectedQuantity",
        COALESCE(qi.passed_quantity, 0)::float as "passedQuantity",
        COALESCE(qi.defective_quantity, 0)::float as "defectiveQuantity",
        COALESCE(qi.defect_rate_pct, 1.2)::float as "defectRate",
        COALESCE(qi.quality_status, 'Passed') as status,
        COALESCE(qi.defect_type, 'None') as "defectType",
        COALESCE(qi.defect_count, 0)::int as "defectCount",
        COALESCE(qi.defect_severity, 'None') as severity,
        qi.root_cause as "rootCause",
        qi.corrective_action as "correctiveAction"
      FROM quality_inspections qi
      LEFT JOIN production_orders po ON qi.production_order_id = po.production_order_id
      LEFT JOIN products p ON po.product_id = p.product_id
      LEFT JOIN users u ON qi.inspector_id = u.user_id
      ORDER BY qi.quality_inspection_id DESC;
    `);

    const inspections = inspRes.rows;

    // 2. Compute Quality KPIs
    const totalInspected = inspections.reduce((sum: number, i: any) => sum + (i.inspectedQuantity || 0), 0);
    const totalPassed = inspections.reduce((sum: number, i: any) => sum + (i.passedQuantity || 0), 0);
    const totalDefects = inspections.reduce((sum: number, i: any) => sum + (i.defectiveQuantity || 0), 0);
    const overallPassRate = totalInspected > 0 ? ((totalPassed / totalInspected) * 100).toFixed(1) : '98.8';

    const kpis = [
      {
        id: 'pass_rate',
        title: 'Overall QA Pass Rate',
        value: `${overallPassRate}%`,
        change: '+0.4%',
        trend: 'up',
        target: '98.0%',
      },
      {
        id: 'total_inspected',
        title: 'Total Units Audited',
        value: totalInspected.toLocaleString(),
        unit: 'Units',
        change: '+15.3%',
        trend: 'up',
        target: '1,500/day',
      },
      {
        id: 'defect_rate',
        title: 'Plant Defect Rate',
        value: totalInspected > 0 ? `${((totalDefects / totalInspected) * 100).toFixed(2)}%` : '1.20%',
        change: '-0.2%',
        trend: 'down',
        target: '< 1.5%',
      },
      {
        id: 'critical_escapes',
        title: 'Critical Escapes',
        value: '0',
        change: 'Zero Defect',
        trend: 'neutral',
        target: '0 Target',
      },
    ];

    return NextResponse.json({
      status: 'success',
      inspections,
      kpis,
    });
  } catch (error: any) {
    console.error('Error in Quality API GET:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      productionOrderId = 1,
      batchNumber = 'BAT-2026-001',
      inspectorId = 1,
      inspectedQuantity = 500,
      passedQuantity = 495,
      defectiveQuantity = 5,
      defectType = 'Seal Integrity',
      defectSeverity = 'Low',
      rootCause = 'Heat sealing temperature variance',
      correctiveAction = 'Recalibrated thermistor setpoint',
    } = body;

    const defectRate = inspectedQuantity > 0 ? Number(((defectiveQuantity / inspectedQuantity) * 100).toFixed(2)) : 1.0;
    const status = defectiveQuantity === 0 ? 'Passed (Gold)' : defectiveQuantity < 10 ? 'Passed with Notes' : 'Under Review';

    const insertRes = await query(`
      INSERT INTO quality_inspections 
        (production_order_id, inspection_date, batch_number, inspector_id, inspected_quantity, passed_quantity, defective_quantity, defect_found, defect_type, defect_count, defect_severity, quality_status, defect_rate_pct, root_cause, corrective_action)
      VALUES 
        ($1, CURRENT_DATE, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING quality_inspection_id;
    `, [
      productionOrderId, batchNumber, inspectorId, inspectedQuantity, passedQuantity, defectiveQuantity,
      defectiveQuantity > 0, defectType, defectiveQuantity, defectSeverity, status, defectRate, rootCause, correctiveAction
    ]);

    return NextResponse.json({
      status: 'success',
      message: 'Quality inspection record saved successfully!',
      inspectionId: insertRes.rows[0].quality_inspection_id,
    });
  } catch (error: any) {
    console.error('Error in Quality API POST:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
