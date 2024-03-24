
/* eslint-disable no-unused-vars */
const { Pool } = require('pg');

// Setup
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  timezone: 'Asia/Jakarta'
});

module.exports = {
  pool,
};
