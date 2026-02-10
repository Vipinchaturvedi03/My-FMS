-- FMS - Farm Management System
-- Database Schema
-- Developer: Vipin Chaturvedi

-- Users table - login/register
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INT,
  gender TEXT,
  address TEXT,
  mobile TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Expense category enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_category') THEN
    CREATE TYPE expense_category AS ENUM ('Seed','Cultivation','Fertilizer','Transport');
  END IF;
END
$$;

-- Expenses - kharcha entries
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category expense_category NOT NULL,
  item_name TEXT NOT NULL,
  quantity NUMERIC(12,2) NOT NULL DEFAULT 0,
  unit TEXT,
  rate NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Laborers - mazdoor entries
CREATE TABLE IF NOT EXISTS laborers (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  days_worked NUMERIC(12,2) NOT NULL DEFAULT 0,
  daily_wage NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  paid NUMERIC(12,2) NOT NULL DEFAULT 0,
  pending NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Stock items - inventory
CREATE TABLE IF NOT EXISTS stock_items (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  unit TEXT,
  threshold NUMERIC(12,2) NOT NULL DEFAULT 0,
  current_qty NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Stock transactions - in/out
CREATE TABLE IF NOT EXISTS stock_transactions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id INT NOT NULL REFERENCES stock_items(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('in','out')),
  quantity NUMERIC(12,2) NOT NULL DEFAULT 0,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes - performance ke liye
CREATE INDEX IF NOT EXISTS idx_expenses_user ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_laborers_user ON laborers(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_items_user ON stock_items(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_tx_user_item ON stock_transactions(user_id, item_id);

-- Crop plantings - fasal entries
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

-- Crop tasks - fertilizer/pesticide schedule
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
