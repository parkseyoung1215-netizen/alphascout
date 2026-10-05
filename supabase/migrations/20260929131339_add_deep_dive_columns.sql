/*
# Add deep-dive analysis columns to scan_history

1. Modified Tables
- `scan_history`
  - `overall_score` (jsonb): { score, grade, breakdown, rationale }
  - `core_claims` (jsonb): array of { claim, category }
  - `proven_facts` (jsonb): array of { fact, evidence, confidence }
  - `uncertainties` (jsonb): array of { risk, impact, severity }
  - `tech_trends` (jsonb): { summary, trends, marketImpact, glossary }

2. Security
- No changes to RLS — existing anon/authenticated policies remain in place.

3. Notes
- All new columns are nullable so existing rows are unaffected.
- The old `insights`, `glossary`, and `vc_impact` columns are kept for backwards compatibility
  but the app now writes the new structured fields instead.
*/

ALTER TABLE scan_history
  ADD COLUMN IF NOT EXISTS overall_score jsonb,
  ADD COLUMN IF NOT EXISTS core_claims jsonb,
  ADD COLUMN IF NOT EXISTS proven_facts jsonb,
  ADD COLUMN IF NOT EXISTS uncertainties_risks jsonb,
  ADD COLUMN IF NOT EXISTS tech_trends jsonb;
