const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:Raja%402005@localhost:5433/smart_manufacturing_erp?schema=public",
});

async function inspectMachines() {
  try {
    const tables = ['machines', 'machine_types', 'machine_sensor_readings', 'machine_failure_predictions', 'maintenance_records'];
    for (const t of tables) {
      console.log(`\n=== Table: ${t} ===`);
      const count = await pool.query(`SELECT COUNT(*) FROM "${t}";`);
      console.log(`Row count: ${count.rows[0].count}`);
      const rows = await pool.query(`SELECT * FROM "${t}" LIMIT 10;`);
      console.log("Rows:", rows.rows);
    }
  } catch (err) {
    console.error("Error querying machines:", err.message);
  } finally {
    await pool.end();
  }
}

inspectMachines();
