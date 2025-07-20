// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjfpddvihfolmmeqcrwk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnBkZHZpaGZvbG1tZXFjcndrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NzQ1MTEsImV4cCI6MjA2ODU1MDUxMX0.VBuB8vOrVKf0tIRDewoCzoayCnVTENebCGnuQIRQciw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);