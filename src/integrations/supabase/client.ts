// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://eyhopjcudpusftgxyufp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aG9wamN1ZHB1c2Z0Z3h5dWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDE5MjYsImV4cCI6MjA2MDMxNzkyNn0.11_nt-cQxLGNH2WKHLtELTzf_TBxb5iejkTACxNINSE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);