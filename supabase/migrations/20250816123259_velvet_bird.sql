/*
  # Create blog and portfolio system

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `excerpt` (text)
      - `content` (text)
      - `featured_image` (text)
      - `meta_title` (text)
      - `meta_description` (text)
      - `status` (enum: draft, published, archived)
      - `published_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `author_id` (uuid, foreign key)
      - `category_id` (uuid, foreign key)
      - `tags` (text array)
      - `read_time` (integer)
      - `views` (integer)

    - `blog_categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `color` (text)
      - `created_at` (timestamp)

    - `portfolio_items`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `content` (text)
      - `featured_image` (text)
      - `gallery` (text array)
      - `client_name` (text)
      - `project_url` (text)
      - `technologies` (text array)
      - `category` (text)
      - `completion_date` (date)
      - `status` (enum: draft, published, archived)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `author_id` (uuid, foreign key)

    - `clients`
      - `id` (uuid, primary key)
      - `name` (text)
      - `logo` (text)
      - `website` (text)
      - `industry` (text)
      - `description` (text)
      - `testimonial` (text)
      - `rating` (integer)
      - `project_count` (integer)
      - `featured` (boolean)
      - `created_at` (timestamp)

    - `case_studies`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `client_id` (uuid, foreign key)
      - `challenge` (text)
      - `solution` (text)
      - `results` (text)
      - `featured_image` (text)
      - `gallery` (text array)
      - `metrics` (jsonb)
      - `duration` (text)
      - `technologies` (text array)
      - `status` (enum: draft, published, archived)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `author_id` (uuid, foreign key)

    - `research_papers`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `abstract` (text)
      - `content` (text)
      - `featured_image` (text)
      - `pdf_url` (text)
      - `authors` (text array)
      - `publication_date` (date)
      - `category` (text)
      - `tags` (text array)
      - `citations` (integer)
      - `downloads` (integer)
      - `status` (enum: draft, published, archived)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage content
    - Add policies for public read access to published content
*/

-- Create enums
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');

-- Blog Categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now()
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text DEFAULT '',
  content text DEFAULT '',
  featured_image text,
  meta_title text,
  meta_description text,
  status content_status DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  author_id uuid NOT NULL,
  category_id uuid REFERENCES blog_categories(id) ON DELETE SET NULL,
  tags text[] DEFAULT '{}',
  read_time integer DEFAULT 5,
  views integer DEFAULT 0
);

-- Portfolio Items
CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  content text DEFAULT '',
  featured_image text,
  gallery text[] DEFAULT '{}',
  client_name text,
  project_url text,
  technologies text[] DEFAULT '{}',
  category text DEFAULT 'web-development',
  completion_date date,
  status content_status DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  author_id uuid NOT NULL
);

-- Clients
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo text,
  website text,
  industry text,
  description text DEFAULT '',
  testimonial text,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  project_count integer DEFAULT 0,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Case Studies
CREATE TABLE IF NOT EXISTS case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  challenge text DEFAULT '',
  solution text DEFAULT '',
  results text DEFAULT '',
  featured_image text,
  gallery text[] DEFAULT '{}',
  metrics jsonb DEFAULT '{}',
  duration text,
  technologies text[] DEFAULT '{}',
  status content_status DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  author_id uuid NOT NULL
);

-- Research Papers
CREATE TABLE IF NOT EXISTS research_papers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  abstract text DEFAULT '',
  content text DEFAULT '',
  featured_image text,
  pdf_url text,
  authors text[] DEFAULT '{}',
  publication_date date,
  category text DEFAULT 'seo',
  tags text[] DEFAULT '{}',
  citations integer DEFAULT 0,
  downloads integer DEFAULT 0,
  status content_status DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

CREATE INDEX IF NOT EXISTS idx_portfolio_status ON portfolio_items(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_items(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_completion ON portfolio_items(completion_date DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON portfolio_items(slug);

CREATE INDEX IF NOT EXISTS idx_clients_featured ON clients(featured);
CREATE INDEX IF NOT EXISTS idx_clients_industry ON clients(industry);

CREATE INDEX IF NOT EXISTS idx_case_studies_status ON case_studies(status);
CREATE INDEX IF NOT EXISTS idx_case_studies_client ON case_studies(client_id);
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);

CREATE INDEX IF NOT EXISTS idx_research_status ON research_papers(status);
CREATE INDEX IF NOT EXISTS idx_research_category ON research_papers(category);
CREATE INDEX IF NOT EXISTS idx_research_publication ON research_papers(publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_research_slug ON research_papers(slug);

-- Enable RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_papers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Blog Categories
CREATE POLICY "Public can read published blog categories"
  ON blog_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage blog categories"
  ON blog_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for Blog Posts
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Authenticated users can read all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authors can manage their blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- RLS Policies for Portfolio Items
CREATE POLICY "Public can read published portfolio items"
  ON portfolio_items FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Authenticated users can read all portfolio items"
  ON portfolio_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authors can manage their portfolio items"
  ON portfolio_items FOR ALL
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- RLS Policies for Clients
CREATE POLICY "Public can read clients"
  ON clients FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage clients"
  ON clients FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for Case Studies
CREATE POLICY "Public can read published case studies"
  ON case_studies FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Authenticated users can read all case studies"
  ON case_studies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authors can manage their case studies"
  ON case_studies FOR ALL
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- RLS Policies for Research Papers
CREATE POLICY "Public can read published research papers"
  ON research_papers FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Authenticated users can read all research papers"
  ON research_papers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage research papers"
  ON research_papers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample blog categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('קידום אתרים', 'seo', 'מאמרים על קידום אתרים ו-SEO', '#10B981'),
('פיתוח אתרים', 'web-development', 'טכנולוגיות ושיטות פיתוח', '#3B82F6'),
('בינה מלאכותית', 'ai', 'פתרונות AI לעסקים', '#8B5CF6'),
('שיווק דיגיטלי', 'digital-marketing', 'אסטרטגיות שיווק דיגיטלי', '#F59E0B'),
('מחקרים', 'research', 'מחקרים ומאמרים מקצועיים', '#EF4444')
ON CONFLICT (slug) DO NOTHING;