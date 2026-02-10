/**
 * PostgreSQL Database Connection Pool
 * FMS - Vipin Chaturvedi
 */

const { Pool } = require('pg');

const dbConnectionString = process.env.DATABASE_URL;
const connectionPool = new Pool({ connectionString: dbConnectionString });

connectionPool.on('error', (err) => {
  console.error('DB Pool Error:', err.message);
  process.exit(-1);
});

// Query helper - params ke saath safe query
const runQuery = (sqlText, params = []) => connectionPool.query(sqlText, params);

module.exports = {
  query: runQuery,
  pool: connectionPool
};
