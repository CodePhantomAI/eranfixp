/*
  # Create pages table for CMS

  1. New Tables
    - `pages`
      - `id` (uuid, primary key)
      - `title` (text, not null) - Page title
      - `slug` (text, unique, not null) - URL slug
      - `content` (text, not null) - Page content
      - `meta_title` (text, nullable) - SEO meta title
      - `meta_description` (text, nullable) - SEO meta description
      - `status` (enum) - Page status: draft, published, archived
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `author_id` (uuid, not null) - Reference to auth.users

  2. Security
    - Enable RLS on `pages` table
    - Add policies for authenticated users to manage pages
*/

-- Create enum for page status
CREATE TYPE page_status AS ENUM ('draft', 'published', 'archived');

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL DEFAULT '',
  meta_title text,
  meta_description text,
  status page_status NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can read all pages"
  ON pages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert pages"
  ON pages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own pages"
  ON pages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own pages"
  ON pages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_author_id ON pages(author_id);
CREATE INDEX IF NOT EXISTS idx_pages_updated_at ON pages(updated_at DESC);