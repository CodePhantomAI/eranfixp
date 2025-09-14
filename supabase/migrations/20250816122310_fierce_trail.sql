/*
  # Create media table for file management

  1. New Tables
    - `media`
      - `id` (uuid, primary key)
      - `filename` (text, not null) - File name in storage
      - `original_name` (text, not null) - Original uploaded file name
      - `file_size` (bigint, not null) - File size in bytes
      - `mime_type` (text, not null) - MIME type
      - `url` (text, not null) - Public URL to file
      - `alt_text` (text, nullable) - Alt text for images
      - `created_at` (timestamptz) - Upload timestamp

  2. Security
    - Enable RLS on `media` table
    - Add policies for authenticated users to manage media
*/

-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  url text NOT NULL,
  alt_text text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can read all media"
  ON media
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert media"
  ON media
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update media"
  ON media
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete media"
  ON media
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_filename ON media(filename);
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON media(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);