/*
# Create scan_history table for AlphaScout

1. New Tables
- `scan_history`
  - `id` (uuid, primary key)
  - `input_url` (text, the URL or text the user scanned)
  - `source_type` (text, 'article' or 'repository')
  - `source_title` (text, title extracted from the content)
  - `insights` (jsonb, array of 3 Korean summary strings)
  - `glossary` (jsonb, array of {term, english, explanation} objects)
  - `vc_impact` (jsonb, {rating, summary, marketPotential, riskLevel, keyPoints} object)
  - `created_at` (timestamptz, defaults to now)

2. Security
- Enable RLS on `scan_history`.
- This is a single-tenant app with no sign-in, so allow anon + authenticated full CRUD.
- The data is intentionally shared/public across the app.
*/

CREATE TABLE IF NOT EXISTS scan_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  input_url text NOT NULL,
  source_type text NOT NULL DEFAULT 'article',
  source_title text,
  insights jsonb,
  glossary jsonb,
  vc_impact jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_scan_history" ON scan_history;
CREATE POLICY "anon_select_scan_history" ON scan_history FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scan_history" ON scan_history;
CREATE POLICY "anon_insert_scan_history" ON scan_history FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_scan_history" ON scan_history;
CREATE POLICY "anon_update_scan_history" ON scan_history FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_scan_history" ON scan_history;
CREATE POLICY "anon_delete_scan_history" ON scan_history FOR DELETE
  TO anon, authenticated USING (true);
