const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:Raja%402005@localhost:5433/smart_manufacturing_erp?schema=public",
});

async function getFullSummary() {
  try {
    const tableRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log(`Found ${tableRes.rows.length} tables:`);
    
    for (const row of tableRes.rows) {
      const countRes = await pool.query(`SELECT COUNT(*) FROM "${row.table_name}";`);
      console.log(`- ${row.table_name} (${countRes.rows[0].count} rows)`);
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

getFullSummary();
