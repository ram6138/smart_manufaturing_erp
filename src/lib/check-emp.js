const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  const empCols = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'employees';
  `);
  console.log('Employees columns:', empCols.rows);

  const empShiftCols = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'employee_shifts';
  `);
  console.log('Employee Shifts columns:', empShiftCols.rows);
  await pool.end();
}

run();
