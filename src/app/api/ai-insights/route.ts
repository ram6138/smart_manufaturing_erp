import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const aiRes = await query(`
      SELECT 
        insight_id::text as id,
        COALESCE(module_name, 'Plant Operations') as category,
        COALESCE(insight_type, 'Optimization') as title,
        COALESCE(severity, 'Medium') as severity,
        insight_text as description,
        recommended_action as "recommendedAction",
        insight_date::text as "timestamp"
      FROM ai_insights
      ORDER BY insight_id ASC;
    `);

    const predictionsRes = await query(`
      SELECT 
        p.prediction_id::text as id,
        p.machine_id::text as "machineId",
        m.machine_name as "machineName",
        m.machine_code as "machineCode",
        p.failure_probability_pct::float as "failureProbability",
        p.risk_level as "riskLevel",
        p.failure_type as "failureType",
        p.recommended_action as "recommendedAction"
      FROM machine_failure_predictions p
      JOIN machines m ON p.machine_id = m.machine_id;
    `);

    return NextResponse.json({
      status: 'success',
      insights: aiRes.rows,
      predictions: predictionsRes.rows,
    });
  } catch (error: any) {
    console.error('Error in AI Insights API GET:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
