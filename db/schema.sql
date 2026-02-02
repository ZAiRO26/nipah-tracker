CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS outbreak_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT UNIQUE NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location TEXT NOT NULL,
  admin_level TEXT CHECK (admin_level IN ('National', 'State', 'District', 'City')),
  cases INT DEFAULT 0,
  deaths INT DEFAULT 0,
  status TEXT CHECK (status IN ('CONFIRMED', 'SUSPECTED', 'DISCARDED')),
  confidence_score DECIMAL(3,2),
  raw_snippet TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
