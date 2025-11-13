import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";// Optional: type definitions

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
