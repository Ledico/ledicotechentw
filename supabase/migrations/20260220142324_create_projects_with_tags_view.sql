--
-- Create a view to join projects with their tags efficiently
--
-- This replaces N+1 queries by providing a single query that returns
-- projects with their tags as a JSON array.
--

CREATE OR REPLACE VIEW projects_with_tags AS
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
