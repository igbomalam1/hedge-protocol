-- ============================================
-- HEDGEHOGS PROJECT - AMBASSADOR APPLICATIONS
-- Database Schema for Supabase (FIXED RLS)
-- ============================================

-- Create ambassador_applications table
CREATE TABLE IF NOT EXISTS ambassador_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  x_handle TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telegram_handle TEXT,
  reason TEXT NOT NULL,
  contribution TEXT NOT NULL,
  previous_projects TEXT,
  portfolio_links TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'reviewing')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ambassador_status ON ambassador_applications(status);
CREATE INDEX IF NOT EXISTS idx_ambassador_created ON ambassador_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ambassador_email ON ambassador_applications(email);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ambassador_applications_updated_at
    BEFORE UPDATE ON ambassador_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE ambassador_applications ENABLE ROW LEVEL SECURITY;

-- IMPORTANT: Drop existing policies first (if any)
DROP POLICY IF EXISTS "Allow public inserts" ON ambassador_applications;
DROP POLICY IF EXISTS "Allow authenticated reads" ON ambassador_applications;
DROP POLICY IF EXISTS "Enable insert for anon users" ON ambassador_applications;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON ambassador_applications;

-- Create policy to allow ANONYMOUS inserts (for public form submissions)
CREATE POLICY "Enable insert for anon users" ON ambassador_applications
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create policy to allow authenticated users to read all applications
CREATE POLICY "Enable read for authenticated users" ON ambassador_applications
    FOR SELECT
    TO authenticated
    USING (true);

-- Optional: Create a view for approved ambassadors (public-facing)
CREATE OR REPLACE VIEW approved_ambassadors AS
SELECT 
    id,
    x_handle,
    created_at
FROM ambassador_applications
WHERE status = 'approved'
ORDER BY created_at DESC;

-- Grant access to the view
GRANT SELECT ON approved_ambassadors TO anon, authenticated;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if table was created successfully
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'ambassador_applications';

-- Check RLS policies (SHOULD SHOW "anon" role for inserts)
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'ambassador_applications';
