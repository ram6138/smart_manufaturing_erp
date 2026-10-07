const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  const aiCols = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'ai_insights';
  `);
  console.log('AI Insights columns:', aiCols.rows);

  const costCols = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'cost_categories';
  `);
  console.log('Cost Categories columns:', costCols.rows);
  await pool.end();
}

run();
