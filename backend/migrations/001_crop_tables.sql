-- FMS - Crop Tables Migration
-- Run: npm run migrate OR psql $DATABASE_URL -f migrations/001_crop_tables.sql
-- Vipin Chaturvedi

CREATE TABLE IF NOT EXISTS crop_plantings (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  variety TEXT,
  sown_date DATE NOT NULL,
  area_acres NUMERIC(10,2) NOT NULL DEFAULT 1,
  expected_duration_days INT NOT NULL DEFAULT 120,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','harvested','abandoned')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crop_tasks (
  id SERIAL PRIMARY KEY,
  planting_id INT NOT NULL REFERENCES crop_plantings(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL CHECK (task_type IN ('fertilizer','pesticide','irrigation','weeding','other')),
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crop_plantings_user ON crop_plantings(user_id);
CREATE INDEX IF NOT EXISTS idx_crop_tasks_planting ON crop_tasks(planting_id);
