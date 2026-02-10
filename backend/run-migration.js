#!/usr/bin/env node
/**
 * FMS - Crop Tables Migration
 * Run: npm run migrate
 * Vipin Chaturvedi
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const connectionPool = new Pool({ connectionString: process.env.DATABASE_URL });
const migrationSQL = fs.readFileSync(path.join(__dirname, 'migrations', '001_crop_tables.sql'), 'utf8');

connectionPool.query(migrationSQL)
  .then(() => {
    console.log('FMS Migration: Crop tables added successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exit(1);
  })
  .finally(() => connectionPool.end());
