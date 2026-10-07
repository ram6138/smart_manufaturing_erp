const { Pool } = require('pg');

const connectionString = "postgresql://postgres:Raja%402005@localhost:5433/smart_manufacturing_erp?schema=public";

const pool = new Pool({
  connectionString,
});

async function testConnection() {
  console.log("Testing connection to PostgreSQL database at port 5433...");
  try {
    const res = await pool.query(`
      SELECT 
        current_database() as database_name,
        current_user as db_user,
        version() as pg_version,
        NOW() as server_time;
    `);
    console.log("=== Database Connection Successful! ===");
    console.log(res.rows[0]);
  } catch (err) {
    console.error("=== Connection Error ===");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    if (err.code === 'ECONNREFUSED') {
      console.log("Hint: PostgreSQL is not accepting connections on port 5433. Check if the PostgreSQL service is started.");
    } else if (err.code === '28P01') {
      console.log("Hint: Authentication failed for user 'postgres'. Check the password.");
    } else if (err.code === '3D000') {
      console.log("Hint: The database 'smart_manufacturing_erp' does not exist. You need to create it (e.g. `CREATE DATABASE smart_manufacturing_erp;`).");
    }
  } finally {
    await pool.end();
  }
}

testConnection();
