/*
  # Create Projects CMS System

  1. New Tables
    - `project_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Category name
      - `slug` (text, unique) - URL-friendly version
      - `description` (text, nullable) - Category description
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `project_tags`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Tag name
      - `slug` (text, unique) - URL-friendly version
      - `created_at` (timestamptz)
    
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text, not null) - Project title
      - `slug` (text, unique) - URL-friendly version
      - `description` (text, nullable) - Short description
      - `content` (text, nullable) - Full project content (supports HTML/Markdown)
      - `featured_image` (text, nullable) - Main project image URL
      - `gallery_images` (jsonb, default []) - Array of additional images
      - `category_id` (uuid, foreign key) - Reference to project_categories
      - `status` (text, default 'draft') - 'draft' or 'published'
      - `published_at` (timestamptz, nullable) - When project was published
      - `view_count` (integer, default 0) - Number of views
      - `order_index` (integer, default 0) - For manual sorting
      - `meta_title` (text, nullable) - SEO title
      - `meta_description` (text, nullable) - SEO description
      - `created_by` (uuid, foreign key) - Reference to auth.users
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `project_tag_relations`
      - `project_id` (uuid, foreign key) - Reference to projects
      - `tag_id` (uuid, foreign key) - Reference to project_tags
      - `created_at` (timestamptz)
      - Primary key: (project_id, tag_id)

  2. Security
    - Enable RLS on all tables
    - Public read access for published projects
    - Only authenticated admins can create/update/delete projects
    - Users can view published projects and all categories/tags

  3. Indexes
    - Index on projects.slug for fast lookups
    - Index on projects.status for filtering
    - Index on projects.category_id for category queries
    - Index on projects.published_at for sorting
*/

-- Create project_categories table
CREATE TABLE IF NOT EXISTS project_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_tags table
CREATE TABLE IF NOT EXISTS project_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  content text,
  featured_image text,
  gallery_images jsonb DEFAULT '[]'::jsonb,
  category_id uuid REFERENCES project_categories(id) ON DELETE SET NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  view_count integer DEFAULT 0,
  order_index integer DEFAULT 0,
  meta_title text,
  meta_description text,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_tag_relations table
CREATE TABLE IF NOT EXISTS project_tag_relations (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES project_tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (project_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category_id ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_published_at ON projects(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_order_index ON projects(order_index);
CREATE INDEX IF NOT EXISTS idx_project_categories_slug ON project_categories(slug);
CREATE INDEX IF NOT EXISTS idx_project_tags_slug ON project_tags(slug);

-- Enable Row Level Security
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tag_relations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_categories
CREATE POLICY "Anyone can view categories"
  ON project_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated admins can insert categories"
  ON project_categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Authenticated admins can update categories"
  ON project_categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Authenticated admins can delete categories"
  ON project_categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- RLS Policies for project_tags
CREATE POLICY "Anyone can view tags"
  ON project_tags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated admins can insert tags"
  ON project_tags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Authenticated admins can update tags"
  ON project_tags FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Authenticated admins can delete tags"
  ON project_tags FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- RLS Policies for projects
CREATE POLICY "Anyone can view published projects"
  ON projects FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Authenticated admins can view all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Authenticated admins can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Authenticated admins can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Authenticated admins can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- RLS Policies for project_tag_relations
CREATE POLICY "Anyone can view project tag relations"
  ON project_tag_relations FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tag_relations.project_id
      AND projects.status = 'published'
    )
  );

CREATE POLICY "Authenticated admins can view all relations"
  ON project_tag_relations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Authenticated admins can insert relations"
  ON project_tag_relations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Authenticated admins can delete relations"
  ON project_tag_relations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_project_categories_updated_at ON project_categories;
CREATE TRIGGER update_project_categories_updated_at
  BEFORE UPDATE ON project_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some default categories
INSERT INTO project_categories (name, slug, description) VALUES
  ('Web Development', 'web-development', 'Web applications and websites')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO project_categories (name, slug, description) VALUES
  ('IT Consulting', 'it-consulting', 'IT consulting and advisory services')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO project_categories (name, slug, description) VALUES
  ('System Administration', 'system-administration', 'Server and system administration projects')
ON CONFLICT (slug) DO NOTHING;