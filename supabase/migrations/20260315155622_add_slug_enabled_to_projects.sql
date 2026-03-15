/*
  # Add slug_enabled column to projects

  ## Summary
  Adds a boolean `slug_enabled` column to the `projects` table.
  When enabled, the project card in the portfolio links to `/{slug}`.
  When disabled, the project card shows no clickable link.

  ## Changes
  - `projects.slug_enabled` (boolean, DEFAULT false) — controls whether
    the slug-based link is active in the public portfolio view.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'slug_enabled'
  ) THEN
    ALTER TABLE projects ADD COLUMN slug_enabled boolean NOT NULL DEFAULT false;
  END IF;
END $$;
