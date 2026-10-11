-- Drop RLS policies that allow anon/authenticated users to mutate scan_history.
-- The edge function writes with the service role key, which bypasses RLS, so it is unaffected.
-- anon_select_scan_history is kept so the anon-key client can still read saved results.

DROP POLICY IF EXISTS "anon_update_scan_history" ON scan_history;
DROP POLICY IF EXISTS "anon_delete_scan_history" ON scan_history;
DROP POLICY IF EXISTS "anon_insert_scan_history" ON scan_history;
