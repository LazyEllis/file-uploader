WITH RECURSIVE subfolders AS (
  SELECT
    id
  FROM
    folders
  WHERE
    id = $1
  UNION
  SELECT
    folders.id
  FROM
    folders
    JOIN subfolders ON subfolders.id = folders.parent_id
)
SELECT * FROM subfolders;