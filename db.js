const sql = require('mssql');
const config = require('./config');

let pool;

async function getPool() {
  if (pool && pool.connected) {
    return pool;
  }

  pool = await sql.connect(config.db);
  return pool;
}

function buildInsertQuery(tableName, record) {
  const columns = Object.keys(record).map((column) => `[${column}]`).join(', ');
  const values = Object.keys(record).map((_, index) => `@p${index}`).join(', ');
  return `INSERT INTO [${tableName}] (${columns}) VALUES (${values})`;
}

function buildMergeQuery(tableName, record, keyColumns) {
  const columns = Object.keys(record);
  const quotedColumns = columns.map((column) => `[${column}]`);
  const sourceColumns = quotedColumns.join(', ');
  const values = columns.map((_, index) => `@p${index}`).join(', ');
  const targets = keyColumns.map((key) => `target.[${key}] = source.[${key}]`).join(' AND ');
  const updateColumns = columns
    .filter((col) => !keyColumns.includes(col))
    .map((column) => `target.[${column}] = source.[${column}]`)
    .join(', ');

  const insertColumns = quotedColumns.join(', ');
  const insertValues = columns.map((column) => `source.[${column}]`).join(', ');

  return `MERGE INTO [${tableName}] AS target
USING (VALUES (${values})) AS source (${sourceColumns})
ON ${targets}
WHEN MATCHED THEN UPDATE SET ${updateColumns}
WHEN NOT MATCHED THEN INSERT (${insertColumns}) VALUES (${insertValues});`;
}

async function upsertRecords(tableName, records, keyColumns) {
  if (!Array.isArray(records) || records.length === 0) {
    return { upserted: 0 };
  }

  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    for (const record of records) {
      const query = buildMergeQuery(tableName, record, keyColumns);
      const request = new sql.Request(transaction);

      Object.keys(record).forEach((key, index) => {
        request.input(`p${index}`, record[key]);
      });

      await request.query(query);
    }

    await transaction.commit();
    return { upserted: records.length };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = {
  sql,
  getPool,
  upsertRecords,
};
