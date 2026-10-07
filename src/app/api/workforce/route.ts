import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // 1. Fetch Employees joined with Departments and Shift Logs
    const empRes = await query(`
      SELECT 
        e.employee_id::text as id,
        e.employee_code as "employeeCode",
        e.employee_name as "employeeName",
        COALESCE(d.department_name, 'Plant Operations') as department,
        e.job_role as "jobRole",
        e.primary_skill as "primarySkill",
        e.is_active as "isActive",
        COALESCE(es.attendance_status, 'Present') as "attendanceStatus",
        COALESCE(es.productivity_pct, 95.0)::float as "productivityScore",
        COALESCE(es.scheduled_hours, 8.0)::float as "regularHours",
        COALESCE(es.overtime_hours, 1.5)::float as "overtimeHours",
        COALESCE(es.tasks_completed, 45)::int as "tasksCompleted",
        COALESCE(es.production_line, 'Line 1') as "assignedLine",
        COALESCE(s.shift_name, 'Morning Shift A') as shift
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.department_id
      LEFT JOIN employee_shifts es ON e.employee_id = es.employee_id
      LEFT JOIN shifts s ON es.shift_id = s.shift_id
      ORDER BY e.employee_id ASC;
    `);

    const employees = empRes.rows;

    // 2. Compute Workforce KPIs
    const totalEmployees = employees.length;
    const activeOnShift = employees.filter((e: any) => e.attendanceStatus === 'Present').length;
    const totalOvertime = employees.reduce((sum: number, e: any) => sum + (e.overtimeHours || 0), 0);
    const avgProductivity = employees.length > 0
      ? (employees.reduce((sum: number, e: any) => sum + (e.productivityScore || 0), 0) / employees.length).toFixed(1)
      : '95.4';

    const kpis = [
      {
        id: 'total_headcount',
        title: 'Active Workforce',
        value: `${totalEmployees}`,
        unit: 'Staff',
        change: '+2 this month',
        trend: 'up',
      },
      {
        id: 'shift_attendance',
        title: 'Shift Attendance Rate',
        value: `${((activeOnShift / (totalEmployees || 1)) * 100).toFixed(0)}%`,
        unit: '%',
        change: '100% on Shift A',
        trend: 'neutral',
      },
      {
        id: 'avg_productivity',
        title: 'Avg Worker Productivity',
        value: `${avgProductivity}%`,
        unit: '%',
        change: '+1.8%',
        trend: 'up',
      },
      {
        id: 'cumulative_overtime',
        title: 'Total Overtime Hours',
        value: `${totalOvertime.toFixed(1)}h`,
        unit: 'Hours',
        change: 'Within Target',
        trend: 'neutral',
      },
    ];

    return NextResponse.json({
      status: 'success',
      employees,
      kpis,
    });
  } catch (error: any) {
    console.error('Error in Workforce API GET:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'addEmployee') {
      const {
        employeeName,
        employeeCode,
        departmentId = 1,
        jobRole = 'Operator',
        primarySkill = 'Baking & Extrusion',
      } = body;

      const newEmpCode = employeeCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

      const insertRes = await query(
        `
        INSERT INTO employees (employee_code, employee_name, department_id, job_role, primary_skill, is_active)
        VALUES ($1, $2, $3, $4, $5, true)
        RETURNING *;
      `,
        [newEmpCode, employeeName, departmentId, jobRole, primarySkill]
      );

      const createdEmp = insertRes.rows[0];

      // Create initial shift log
      await query(
        `
        INSERT INTO employee_shifts (
          employee_id, shift_id, work_date, scheduled_hours, actual_working_hours, 
          overtime_hours, tasks_completed, productivity_pct, attendance_status, production_line
        ) VALUES ($1, 1, CURRENT_DATE, 8.0, 8.0, 0, 40, 95.0, 'Present', 'Line 1')
        ON CONFLICT DO NOTHING;
      `,
        [createdEmp.employee_id]
      );

      return NextResponse.json({
        status: 'success',
        message: 'Employee registered successfully',
        employee: createdEmp,
      });
    }

    if (action === 'markAttendance') {
      const { employeeId, attendanceStatus = 'Present', scheduledHours = 8.0, overtimeHours = 0 } = body;

      await query(
        `
        UPDATE employee_shifts
        SET attendance_status = $1, scheduled_hours = $2, overtime_hours = $3
        WHERE employee_id = $4;
      `,
        [attendanceStatus, scheduledHours, overtimeHours, employeeId]
      );

      return NextResponse.json({
        status: 'success',
        message: 'Attendance updated successfully',
      });
    }

    return NextResponse.json({ status: 'error', message: 'Unknown workforce action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in Workforce API POST:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
