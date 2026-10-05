/*
# Create rate_limits and daily_scans tables for security/operations

1. New Tables
- `rate_limits`: tracks per-IP request timestamps for 1-minute rate limiting (max 5 req/min)
  - id (uuid PK)
  - ip_address (text, not null) — caller IP from x-forwarded-for or connection
  - created_at (timestamptz, default now())
- `daily_scans`: tracks total scans per day (Korean timezone) for daily limit enforcement (default 20/day)
  - id (uuid PK)
  - scan_date (text, not null) — date string in Asia/Seoul (YYYY-MM-DD)
  - created_at (timestamptz, default now())

2. Security
- RLS enabled on both tables.
- NO policies created — only the service role can read/write (it bypasses RLS).
  The anon/authenticated roles get zero rows, which is intentional: the edge function
  uses the service role key for all rate-limit/daily-scan operations.

3. Indexes
- rate_limits: index on ip_address + created_at for fast lookups
- daily_scans: index on scan_date for fast count queries

4. Old record cleanup
- rate_limits: rows older than 7 days are cleaned by the edge function on each request
- daily_scans: no automatic cleanup (small table, one row per scan)
*/

CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_created ON rate_limits (ip_address, created_at);

CREATE TABLE IF NOT EXISTS daily_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_date text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_scans ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_daily_scans_date ON daily_scans (scan_date);
