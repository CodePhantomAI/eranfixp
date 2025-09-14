/*
  # Create redirects table for URL management

  1. New Tables
    - `redirects`
      - `id` (uuid, primary key)
      - `from_path` (text, unique, not null) - Source URL path
      - `to_path` (text, not null) - Destination URL path
      - `status_code` (integer) - HTTP status code (301, 302, etc.)
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `redirects` table
    - Add policies for authenticated users to manage redirects
*/

-- Create redirects table
CREATE TABLE IF NOT EXISTS redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path text UNIQUE NOT NULL,
  to_path text NOT NULL,
  status_code integer NOT NULL DEFAULT 301,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can read all redirects"
  ON redirects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert redirects"
  ON redirects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update redirects"
  ON redirects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete redirects"
  ON redirects
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_redirects_from_path ON redirects(from_path);
CREATE INDEX IF NOT EXISTS idx_redirects_status_code ON redirects(status_code);