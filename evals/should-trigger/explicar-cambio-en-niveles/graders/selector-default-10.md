---
type: regex
pattern: '<input[^>]*name="nivel"[^>]*(value="10"[^>]*checked|checked[^>]*value="10")|<input[^>]*(value="10"[^>]*checked|checked[^>]*value="10")[^>]*name="nivel"'
target: { source: file, path: cambio.html }
---
