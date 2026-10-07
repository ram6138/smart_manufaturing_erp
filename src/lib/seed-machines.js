const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:Raja%402005@localhost:5433/smart_manufacturing_erp?schema=public",
});

async function seedMachines() {
  try {
    const existing = await pool.query(`SELECT COUNT(*) FROM machines;`);
    if (parseInt(existing.rows[0].count) > 0) {
      console.log(`Machines already exist (${existing.rows[0].count} rows). Skipping seed.`);
      return;
    }

    console.log("Seeding machines table in PostgreSQL...");

    // 1. Insert Machines
    const insertMachines = await pool.query(`
      INSERT INTO machines (machine_type_id, machine_name, machine_code, status, installation_date, machine_age_years)
      VALUES 
        (2, 'Continuous Tunnel Baking Oven 1', 'MCH-OVN-001', 'Running', '2023-01-15', 3.5),
        (2, 'Rotary Deck Baking Oven 2', 'MCH-OVN-002', 'Warning', '2022-06-10', 4.2),
        (4, 'High-Speed Dough Mixer 1', 'MCH-MIX-001', 'Running', '2023-08-20', 2.9),
        (1, 'Automatic Flow-Wrap Packaging Line', 'MCH-PKG-001', 'Running', '2024-02-14', 2.3),
        (3, 'Master Biscuit Production Line 1', 'MCH-LIN-001', 'Idle', '2021-11-05', 4.8)
      RETURNING machine_id, machine_name, machine_code;
    `);

    console.log("Inserted Machines:", insertMachines.rows);

    // 2. Insert Sensor Readings for each machine
    for (const m of insertMachines.rows) {
      await pool.query(`
        INSERT INTO machine_sensor_readings 
          (machine_id, reading_timestamp, operating_status, temperature_c, vibration_mm_s, voltage_v, current_a, pressure_bar, rotational_speed_rpm, power_consumption_kw, sensor_health, anomaly_detected, anomaly_type)
        VALUES 
          ($1, NOW(), 'Normal', 72.5, 2.4, 400.0, 18.5, 4.2, 1450, 42.0, 'Healthy', false, NULL),
          ($1, NOW() - INTERVAL '1 hour', 'Normal', 74.1, 2.8, 402.0, 19.1, 4.3, 1455, 43.5, 'Healthy', false, NULL);
      `, [m.machine_id]);

      // 3. Insert Failure Predictions
      await pool.query(`
        INSERT INTO machine_failure_predictions 
          (machine_id, prediction_date, failure_probability_pct, predicted_failure, failure_type, risk_level, recommended_action)
        VALUES 
          ($1, CURRENT_DATE, 18.5, false, 'Bearing Degradation', 'Low', 'Routine lubrication at next weekend scheduled maintenance window');
      `, [m.machine_id]);

      // 4. Insert Maintenance Records
      await pool.query(`
        INSERT INTO maintenance_records 
          (machine_id, maintenance_date, shift_id, machine_age_years, total_machine_hours, operating_hours, days_since_last_maintenance, previous_failure_count, failure_probability_pct, machine_failure, failure_type, failure_severity, downtime_minutes, maintenance_required, maintenance_action, next_maintenance_due_days)
        VALUES 
          ($1, CURRENT_DATE - INTERVAL '14 days', 1, 3.5, 8400, 4200, 14, 1, 15.0, false, 'Preventive', 'Low', 30, false, 'Greased roller bearings & thermal calibration', 16);
      `, [m.machine_id]);
    }

    console.log("=== Seed Complete! All 5 factory machines inserted successfully into PostgreSQL ===");
  } catch (err) {
    console.error("Error seeding machines:", err.message);
  } finally {
    await pool.end();
  }
}

seedMachines();
