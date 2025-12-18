-- 002_create_user_profile_trigger.sql

-- Function to handle new user creation
-- This function runs with SECURITY DEFINER to bypass RLS policies
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_full_name TEXT;
  user_role role_enum;
BEGIN
  -- Extract full_name from metadata
  user_full_name := NULL;
  IF NEW.raw_user_meta_data IS NOT NULL THEN
    user_full_name := NEW.raw_user_meta_data->>'full_name';
  END IF;

  -- Extract and validate role from metadata, default to 'customer'
  user_role := 'customer'::role_enum;
  IF NEW.raw_user_meta_data IS NOT NULL AND NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
    BEGIN
      user_role := (NEW.raw_user_meta_data->>'role')::role_enum;
    EXCEPTION WHEN OTHERS THEN
      -- If role is invalid, default to customer
      user_role := 'customer'::role_enum;
    END;
  END IF;

  -- Insert user profile
  -- This will work because SECURITY DEFINER runs with the function owner's privileges
  INSERT INTO public.users (id, full_name, role)
  VALUES (NEW.id, user_full_name, user_role)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the auth user creation
  -- Return NEW to allow the auth transaction to succeed
  RAISE WARNING 'Error creating user profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Grant execute permission to authenticated users (required for trigger)
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Trigger to automatically create user profile when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

