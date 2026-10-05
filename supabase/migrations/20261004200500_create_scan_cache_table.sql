/*
# Create scan_cache table for analysis result caching

1. New Tables
- `scan_cache`
  - `cache_key` (text, primary key) — normalized input: lowercase, trimmed; hostname if URL input
  - `result` (jsonb, not null) — full analysis result including diagnostics
  - `code_version` (text, not null) — CODE_VERSION string from the edge function at save time
  - `saved_at` (timestamptz, not null, default now()) — when the result was cached

2. Security
- Enable RLS on `scan_cache`.
- No policies for anon or authenticated — only the service role (server-side edge function) can read/write.
  The frontend never touches this table directly; all access goes through the edge function.

3. Notes
- Cached results are returned only when the saved_at timestamp is within 24 hours
  AND the code_version matches the current deployed version.
- Rows older than 30 days are cleaned up by the edge function on each request.
- Error results, "기업 확인 불가", "검색 서비스 오류", and ≥50% search-failure results are never saved.
- "평가 보류" (insufficient evidence) results ARE saved since they completed normally.
*/

CREATE TABLE IF NOT EXISTS scan_cache (
  cache_key text PRIMARY KEY,
  result jsonb NOT NULL,
  code_version text NOT NULL,
  saved_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE scan_cache ENABLE ROW LEVEL SECURITY;
