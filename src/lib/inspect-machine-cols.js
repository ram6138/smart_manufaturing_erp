const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:Raja%402005@localhost:5433/smart_manufacturing_erp?schema=public",
});

async function inspectColumns() {
  try {
    for (const t of ['machines', 'machine_types', 'maintenance_records', 'machine_sensor_readings', 'machine_failure_predictions']) {
      console.log(`\n=== Table: ${t} ===`);
      const cols = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = '${t}'
        ORDER BY ordinal_position;
      `);
      console.log(cols.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

inspectColumns();
