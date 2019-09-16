// Example PG connection pool file - GIT IGNORE THE ACTUAL FILE!

const { Pool } = require('pg');

const pool = new Pool({
  user: 'username',
  host: 'localhost',
  database: 'dbname',
  password: 'password',
  port: 5432,
});

module.exports = { pool };
