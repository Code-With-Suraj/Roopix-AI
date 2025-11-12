import { createClient } from '@supabase/supabase-js';

// IMPORTANT:
// 1. Create a project at https://supabase.com/
// 2. Go to your project's settings > API.
// 3. Find your Project URL and anon key.
// 4. Set them as environment variables in your development environment.
//    - SUPABASE_URL
//    - SUPABASE_KEY

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);