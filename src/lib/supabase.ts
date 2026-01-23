import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mvlcxsdedwblirotabfp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bGN4c2RlZHdibGlyb3RhYmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTU3MzUsImV4cCI6MjA4NDU5MTczNX0.FpHi_wZQ2b8UaThWEhpAFXm4oyfWLEzmJMRUR3jwXQY';

export const supabase = createClient(supabaseUrl, supabaseKey);
