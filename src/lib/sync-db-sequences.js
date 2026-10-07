const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:Raja%402005@localhost:5433/smart_manufacturing_erp?schema=public',
});

async function syncSequences() {
  try {
    console.log('Synchronizing PostgreSQL serial sequences to highest IDs...');

    // Find all sequences and their associated tables/columns
    const seqQuery = await pool.query(`
      SELECT 
        table_name,
        column_name,
        column_default
      FROM information_schema.columns
      WHERE column_default LIKE 'nextval%'
        AND table_schema = 'public';
    `);

    for (const row of seqQuery.rows) {
      const match = row.column_default.match(/nextval\('"?([^']+)'"?::regclass\)/);
      if (match) {
        const seqName = match[1];
        const tableName = row.table_name;
        const colName = row.column_name;

        const maxRes = await pool.query(`SELECT COALESCE(MAX(${colName}), 0) as max_id FROM "${tableName}"`);
        const nextId = parseInt(maxRes.rows[0].max_id, 10) + 1;

        await pool.query(`SELECT setval($1, $2, false)`, [seqName, nextId]);
        console.log(`✓ Set sequence '${seqName}' for ${tableName}.${colName} to ${nextId}`);
      }
    }

    console.log('\nAll sequences synchronized successfully.');
  } catch (error) {
    console.error('Error syncing sequences:', error);
  } finally {
    await pool.end();
  }
}

syncSequences();
