// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nbpeetetnalpkqruslen.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5icGVldGV0bmFscGtxcnVzbGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NzMwODUsImV4cCI6MjA2ODI0OTA4NX0.4i9-rI0nhKzZhsfpAbFkuu5fm93ZJuauFIbcq9xmv1M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);