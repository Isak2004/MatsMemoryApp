/*
  # Remove authentication and make memories app completely open

  1. Changes to Tables
    - Remove user_id column and foreign key constraint from memories table
    - Remove all RLS policies to make data publicly accessible
    - Disable RLS on memories table
  
  2. Security
    - Make all memories publicly readable and writable
    - No authentication required
*/

-- Remove the foreign key constraint first
ALTER TABLE memories DROP CONSTRAINT IF EXISTS memories_user_id_fkey;

-- Remove the user_id column
ALTER TABLE memories DROP COLUMN IF EXISTS user_id;

-- Drop all existing RLS policies
DROP POLICY IF EXISTS "Users can delete own memories" ON memories;
DROP POLICY IF EXISTS "Users can insert own memories" ON memories;
DROP POLICY IF EXISTS "Users can update own memories" ON memories;
DROP POLICY IF EXISTS "Users can view own memories" ON memories;

-- Disable RLS to make table publicly accessible
ALTER TABLE memories DISABLE ROW LEVEL SECURITY;

-- Create public policies for anonymous access
CREATE POLICY "Anyone can view memories"
  ON memories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert memories"
  ON memories
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update memories"
  ON memories
  FOR UPDATE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can delete memories"
  ON memories
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Re-enable RLS with public policies
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;