---
type: regex
pattern: '<input[^>]*name="level"[^>]*(value="10"[^>]*checked|checked[^>]*value="10")|<input[^>]*(value="10"[^>]*checked|checked[^>]*value="10")[^>]*name="level"'
target: { source: file, path: change.html }
---
