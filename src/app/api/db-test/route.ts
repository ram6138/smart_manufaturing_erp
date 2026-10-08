import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        current_database() as database_name,
        current_user as db_user,
        version() as pg_version,
        NOW() as server_time;
    `);

    return NextResponse.json({
      status: 'success',
      message: 'Database connected successfully!',
      connectionDetails: result.rows[0],
      queryDurationMs: result.duration,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to connect to database.',
        error: error.message,
        hint: error.code === '28P01' 
          ? 'Password authentication failed. Check your password.' 
          : error.code === 'ECONNREFUSED' 
          ? 'Connection refused. Make sure database service is running on port 5433.' 
          : error.code === '3D000'
          ? 'Database "smart_manufacturing_erp" does not exist yet. Please create it.'
          : error.code,
      },
      { status: 500 }
    );
  }
}
