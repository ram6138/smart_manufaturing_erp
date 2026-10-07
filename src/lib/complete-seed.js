const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:Raja%402005@localhost:5433/smart_manufacturing_erp?schema=public",
});

async function completeSeed() {
  try {
    // 1. Seed Shifts if empty
    const shiftCount = await pool.query(`SELECT COUNT(*) FROM shifts;`);
    if (parseInt(shiftCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO shifts (shift_name, start_time, end_time)
        VALUES 
          ('Morning Shift', '06:00:00', '14:00:00'),
          ('Evening Shift', '14:00:00', '22:00:00'),
          ('Night Shift', '22:00:00', '06:00:00'),
          ('General Shift', '09:00:00', '17:00:00');
      `);
      console.log("Shifts seeded!");
    }

    const firstShift = await pool.query(`SELECT shift_id FROM shifts LIMIT 1;`);
    const shiftId = firstShift.rows[0].shift_id;

    // 2. Seed Maintenance records
    const machines = await pool.query(`SELECT machine_id FROM machines;`);
    for (const m of machines.rows) {
      const existingMnt = await pool.query(`SELECT COUNT(*) FROM maintenance_records WHERE machine_id = $1`, [m.machine_id]);
      if (parseInt(existingMnt.rows[0].count) === 0) {
        await pool.query(`
          INSERT INTO maintenance_records 
            (machine_id, maintenance_date, shift_id, machine_age_years, total_machine_hours, operating_hours, days_since_last_maintenance, previous_failure_count, failure_probability_pct, machine_failure, failure_type, failure_severity, downtime_minutes, maintenance_required, maintenance_action, next_maintenance_due_days)
          VALUES 
            ($1, CURRENT_DATE - INTERVAL '14 days', $2, 3.5, 8400, 4200, 14, 1, 15.0, false, 'Preventive', 'Low', 30, false, 'Greased roller bearings & thermal calibration', 16);
        `, [m.machine_id, shiftId]);
      }
    }

    console.log("=== All Machines, Shifts, Sensor Readings & Maintenance Records successfully populated in PostgreSQL! ===");
  } catch (err) {
    console.error("Error completing seed:", err.message);
  } finally {
    await pool.end();
  }
}

completeSeed();
