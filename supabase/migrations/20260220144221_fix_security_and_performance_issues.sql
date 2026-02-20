/*
  # Fix Security and Performance Issues

  1. Missing Foreign Key Indexes
    - Add index on `project_tag_relations.tag_id`
    - Add index on `projects.created_by`

  2. RLS Policy Performance (auth.uid() -> (select auth.uid()))
    - Recreate all policies that use auth.uid() or auth functions
      with the (select auth.<function>()) pattern to avoid
      re-evaluation per row
    - Affected tables: profiles, otp_attempts, project_categories,
      project_tags, projects, project_tag_relations

  3. Drop Unused Indexes
    - idx_projects_published_at
    - idx_inventory_transactions_inventory_id_created_at
    - idx_inventory_created_by
    - idx_inventory_last_modified_by
    - idx_inventory_transactions_created_by
    - idx_inventory_transactions_inventory_id
    - idx_accessories_category

  4. Fix Multiple Permissive Policies
    - Merge overlapping SELECT/UPDATE policies on profiles, otp_attempts,
      project_tag_relations, projects into single combined policies

  5. Fix Security Definer Views
    - Recreate low_stock_items, security_dashboard, projects_with_tags
      as SECURITY INVOKER views

  6. Fix Mutable Search Path Function
    - Recreate update_updated_at_column with immutable search_path

  7. Fix contact_submissions Always-True INSERT Policy
    - Replace WITH CHECK (true) with reasonable validation

  8. Important Notes
    - All policies use (select auth.uid()) for performance
    - Combined policies use OR logic to merge admin + user access
    - Views use SECURITY INVOKER to respect caller's permissions
*/

-- =============================================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- =============================================================

CREATE INDEX IF NOT EXISTS idx_project_tag_relations_tag_id
  ON project_tag_relations(tag_id);

CREATE INDEX IF NOT EXISTS idx_projects_created_by
  ON projects(created_by);

-- =============================================================
-- 2. DROP UNUSED INDEXES
-- =============================================================

DROP INDEX IF EXISTS idx_projects_published_at;
DROP INDEX IF EXISTS idx_inventory_transactions_inventory_id_created_at;
DROP INDEX IF EXISTS idx_inventory_created_by;
DROP INDEX IF EXISTS idx_inventory_last_modified_by;
DROP INDEX IF EXISTS idx_inventory_transactions_created_by;
DROP INDEX IF EXISTS idx_inventory_transactions_inventory_id;
DROP INDEX IF EXISTS idx_accessories_category;

-- =============================================================
-- 3. FIX PROFILES POLICIES
--    Merge "Users can read own profile" + "Admins can read all profiles" -> single SELECT
--    Merge "Users can update own profile" + "Admins can update all profiles" -> single UPDATE
--    Fix "Users can insert own profile"
-- =============================================================

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
CREATE POLICY "Users and admins can read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (select auth.uid()) AND p.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Users and admins can update profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (select auth.uid()) AND p.is_admin = true
    )
  )
  WITH CHECK (
    id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (select auth.uid()) AND p.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- Keep admin delete as-is but no auth.uid() issue there (uses is_admin())

-- =============================================================
-- 4. FIX OTP_ATTEMPTS POLICIES
--    Merge two SELECT policies into one
-- =============================================================

DROP POLICY IF EXISTS "Users can view own OTP attempts" ON otp_attempts;
DROP POLICY IF EXISTS "Admins can view all OTP attempts" ON otp_attempts;
CREATE POLICY "Users and admins can view OTP attempts"
  ON otp_attempts FOR SELECT
  TO authenticated
  USING (
    email = (
      SELECT p.email FROM profiles p
      WHERE p.id = (select auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (select auth.uid()) AND p.is_admin = true
    )
  );

-- =============================================================
-- 5. FIX PROJECT_CATEGORIES POLICIES
-- =============================================================

DROP POLICY IF EXISTS "Authenticated admins can insert categories" ON project_categories;
CREATE POLICY "Authenticated admins can insert categories"
  ON project_categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Authenticated admins can update categories" ON project_categories;
CREATE POLICY "Authenticated admins can update categories"
  ON project_categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Authenticated admins can delete categories" ON project_categories;
CREATE POLICY "Authenticated admins can delete categories"
  ON project_categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true
    )
  );

-- =============================================================
-- 6. FIX PROJECT_TAGS POLICIES
-- =============================================================

DROP POLICY IF EXISTS "Authenticated admins can insert tags" ON project_tags;
CREATE POLICY "Authenticated admins can insert tags"
  ON project_tags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Authenticated admins can update tags" ON project_tags;
CREATE POLICY "Authenticated admins can update tags"
  ON project_tags FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Authenticated admins can delete tags" ON project_tags;
CREATE POLICY "Authenticated admins can delete tags"
  ON project_tags FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true
    )
  );

-- =============================================================
-- 7. FIX PROJECTS POLICIES
--    Merge "Anyone can view published projects" + "Authenticated admins can view all projects"
-- =============================================================

DROP POLICY IF EXISTS "Anyone can view published projects" ON projects;
DROP POLICY IF EXISTS "Authenticated admins can view all projects" ON projects;
CREATE POLICY "Anyone can view published projects or admins see all"
  ON projects FOR SELECT
  TO public
  USING (
    status = 'published'
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Authenticated admins can insert projects" ON projects;
CREATE POLICY "Authenticated admins can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Authenticated admins can update projects" ON projects;
CREATE POLICY "Authenticated admins can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Authenticated admins can delete projects" ON projects;
CREATE POLICY "Authenticated admins can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true
    )
  );

-- =============================================================
-- 8. FIX PROJECT_TAG_RELATIONS POLICIES
--    Merge two SELECT policies
-- =============================================================

DROP POLICY IF EXISTS "Anyone can view project tag relations" ON project_tag_relations;
DROP POLICY IF EXISTS "Authenticated admins can view all relations" ON project_tag_relations;
CREATE POLICY "Anyone can view project tag relations"
  ON project_tag_relations FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tag_relations.project_id
      AND projects.status = 'published'
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Authenticated admins can insert relations" ON project_tag_relations;
CREATE POLICY "Authenticated admins can insert relations"
  ON project_tag_relations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Authenticated admins can delete relations" ON project_tag_relations;
CREATE POLICY "Authenticated admins can delete relations"
  ON project_tag_relations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.is_admin = true
    )
  );

-- =============================================================
-- 9. FIX SECURITY DEFINER VIEWS -> SECURITY INVOKER
-- =============================================================

DROP VIEW IF EXISTS low_stock_items;
CREATE VIEW low_stock_items
WITH (security_invoker = true)
AS
SELECT
  id,
  name,
  category,
  quantity,
  unit,
  status,
  restock_date,
  restock_notes
FROM inventory
WHERE quantity < 10
  AND status = 'verfügbar';

GRANT SELECT ON low_stock_items TO authenticated;

DROP VIEW IF EXISTS security_dashboard;
CREATE VIEW security_dashboard
WITH (security_invoker = true)
AS
SELECT 'Total Users'::text AS metric,
  (count(*))::text AS value,
  'info'::text AS alert_level
FROM profiles
UNION ALL
SELECT 'Admin Users'::text AS metric,
  (count(*))::text AS value,
  CASE
    WHEN count(*) = 0 THEN 'error'::text
    WHEN count(*) > 5 THEN 'warning'::text
    ELSE 'success'::text
  END AS alert_level
FROM profiles
WHERE is_admin = true
UNION ALL
SELECT 'Failed OTP Attempts (24h)'::text AS metric,
  (count(*))::text AS value,
  CASE
    WHEN count(*) > 100 THEN 'error'::text
    WHEN count(*) > 50 THEN 'warning'::text
    ELSE 'success'::text
  END AS alert_level
FROM otp_attempts
WHERE success = false AND attempted_at > (now() - interval '24 hours')
UNION ALL
SELECT 'Successful Logins (24h)'::text AS metric,
  (count(*))::text AS value,
  'info'::text AS alert_level
FROM otp_attempts
WHERE success = true AND attempted_at > (now() - interval '24 hours');

GRANT SELECT ON security_dashboard TO authenticated;

DROP VIEW IF EXISTS projects_with_tags;
CREATE VIEW projects_with_tags
WITH (security_invoker = true)
AS
SELECT
  p.id,
  p.title,
  p.slug,
  p.description,
  p.content,
  p.featured_image,
  p.gallery_images,
  p.category_id,
  p.status,
  p.published_at,
  p.view_count,
  p.order_index,
  p.meta_title,
  p.meta_description,
  p.created_by,
  p.created_at,
  p.updated_at,
  COALESCE(
    json_agg(
      json_build_object('id', pt.id, 'name', pt.name, 'slug', pt.slug)
    ) FILTER (WHERE pt.id IS NOT NULL),
    '[]'::json
  ) AS tags
FROM projects p
LEFT JOIN project_tag_relations ptr ON ptr.project_id = p.id
LEFT JOIN project_tags pt ON pt.id = ptr.tag_id
GROUP BY p.id;

GRANT SELECT ON projects_with_tags TO authenticated;
GRANT SELECT ON projects_with_tags TO anon;

-- =============================================================
-- 10. FIX MUTABLE SEARCH_PATH FUNCTION
-- =============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =============================================================
-- 11. FIX CONTACT_SUBMISSIONS ALWAYS-TRUE INSERT POLICY
-- =============================================================

DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND name <> ''
    AND email IS NOT NULL AND email <> ''
    AND message IS NOT NULL AND message <> ''
  );