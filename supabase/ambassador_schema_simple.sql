-- ============================================
-- AMBASSADOR APPLICATIONS - SIMPLIFIED SETUP
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Drop table if exists
DROP TABLE IF EXISTS ambassador_applications CASCADE;

-- Step 2: Create table
CREATE TABLE ambassador_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  x_handle TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telegram_handle TEXT,
  reason TEXT NOT NULL,
  contribution TEXT NOT NULL,
  previous_projects TEXT,
  portfolio_links TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Add indexes
CREATE INDEX idx_ambassador_status ON ambassador_applications(status);
CREATE INDEX idx_ambassador_created ON ambassador_applications(created_at DESC);

-- Step 4: DISABLE RLS (simplest solution)
ALTER TABLE ambassador_applications DISABLE ROW LEVEL SECURITY;

-- Step 5: Grant permissions
GRANT ALL ON ambassador_applications TO anon;
GRANT ALL ON ambassador_applications TO authenticated;

-- Verify
SELECT 'Setup complete! RLS disabled, permissions granted.' as status;
