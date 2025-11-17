-- 001_create_users_table.sql

-- Create role enum

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_enum') THEN
    CREATE TYPE role_enum AS ENUM ('customer', 'manager', 'admin');
  END IF;
END$$;

-- Create users table linked to Supabase Auth
create table if not exists users (
  id uuid primary key references auth.users(id),
  full_name text,
  role role_enum default 'customer',
  created_at timestamp with time zone default timezone('utc', now())
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "self_select" ON users;

CREATE POLICY "self_select" ON users
  FOR SELECT
  USING (auth.uid() = id);


-- Allow users to update only themselves
DROP POLICY IF EXISTS "self_update" ON users;

CREATE POLICY "self_update" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


DROP POLICY IF EXISTS "self_insert" ON users;

CREATE POLICY "self_insert" ON users
  FOR INSERT
  WITH CHECK (
    -- allow user inserting their own row
    auth.uid() = id

    OR

    -- allow signup flow (runs via service_role)
    current_setting('request.jwt.claim.sub', true) IS NULL
  );

