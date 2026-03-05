import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jlcibzfedbhuuqwbpaci.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsY2liemZlZGJodXVxd2JwYWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMjY0NzEsImV4cCI6MjA4MjYwMjQ3MX0.8RADoGDOT7PLourHnmK_3jFNCbDYc-yrmzGFTE-9sxQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
