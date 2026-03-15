/*
  # Refresh projects_with_tags view

  ## Summary
  Recreates the `projects_with_tags` view so it picks up the newly added
  `slug_enabled` column from the `projects` table.

  The view uses `p.*` which means it includes all columns including
  `slug_enabled` — but PostgreSQL views cache column lists at creation
  time, so a DROP + recreate is required after adding new columns.

  ## Changes
  - Drops and recreates `projects_with_tags` view to include `slug_enabled`
*/

DROP VIEW IF EXISTS projects_with_tags;

CREATE VIEW projects_with_tags AS
SELECT
  p.*,
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
