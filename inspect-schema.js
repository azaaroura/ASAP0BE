const sql = require('mssql');
const config = require('./config');

async function inspectSchema() {
  try {
    const pool = await sql.connect(config.db);

    console.log('\n=== DATABASE SCHEMA INSPECTION ===\n');

    // Get all tables
    const tables = await pool.request().query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `);

    console.log('TABLES IN DATABASE:');
    console.log('==================');
    for (const table of tables.recordset) {
      console.log(`\n📋 ${table.TABLE_NAME}`);

      // Get columns for this table
      const columns = await pool.request().query(`
        SELECT
          COLUMN_NAME,
          DATA_TYPE,
          IS_NULLABLE,
          COLUMN_DEFAULT
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = '${table.TABLE_NAME}'
        ORDER BY ORDINAL_POSITION
      `);

      console.log('   Columns:');
      for (const col of columns.recordset) {
        const nullable = col.IS_NULLABLE === 'YES' ? '(nullable)' : '(NOT NULL)';
        const defaultVal = col.COLUMN_DEFAULT ? ` DEFAULT: ${col.COLUMN_DEFAULT}` : '';
        console.log(`     - ${col.COLUMN_NAME}: ${col.DATA_TYPE} ${nullable}${defaultVal}`);
      }

      // Get primary keys
      const pks = await pool.request().query(`
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS tc
        JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS kcu
          ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
        WHERE tc.TABLE_NAME = '${table.TABLE_NAME}' AND tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
      `);

      if (pks.recordset.length > 0) {
        console.log('   Primary Keys:');
        pks.recordset.forEach(pk => console.log(`     - ${pk.COLUMN_NAME}`));
      }

      // Get foreign keys
      try {
        const fks = await pool.request().query(`
          SELECT kcu.CONSTRAINT_NAME, kcu.COLUMN_NAME
          FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS kcu
          WHERE kcu.TABLE_NAME = '${table.TABLE_NAME}' AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
        `);

        if (fks.recordset.length > 0) {
          console.log('   Foreign Keys:');
          fks.recordset.forEach(fk => {
            console.log(`     - ${fk.COLUMN_NAME}`);
          });
        }
      } catch (e) {
        // Skip if error
      }

      // Get row count
      const count = await pool.request().query(`SELECT COUNT(*) as cnt FROM [${table.TABLE_NAME}]`);
      console.log(`   Row Count: ${count.recordset[0].cnt}`);
    }

    console.log('\n=== SCHEMA INSPECTION COMPLETE ===\n');
    await pool.close();

  } catch (error) {
    console.error('Error:', error.message);
  }
}

inspectSchema();
