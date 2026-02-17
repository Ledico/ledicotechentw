/*
  # Fix Projects RLS Policies for Anonymous Access

  1. Changes
    - Drop existing public policies
    - Recreate policies with explicit anon role support
    - Ensure anonymous users can read published projects, categories, and tags

  2. Security
    - Maintains existing admin-only write access
    - Opens read access for anonymous users
    - Published projects remain publicly accessible
*/

-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Anyone can view categories" ON project_categories;
DROP POLICY IF EXISTS "Anyone can view tags" ON project_tags;
DROP POLICY IF EXISTS "Anyone can view published projects" ON projects;
DROP POLICY IF EXISTS "Anyone can view project tag relations" ON project_tag_relations;

-- Recreate SELECT policies with explicit anon support
CREATE POLICY "Anyone can view categories"
  ON project_categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view tags"
  ON project_tags FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view published projects"
  ON projects FOR SELECT
  USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view project tag relations"
  ON project_tag_relations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tag_relations.project_id
      AND (projects.status = 'published' OR auth.uid() IS NOT NULL)
    )
  );