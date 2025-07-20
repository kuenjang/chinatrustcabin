// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 檢查必要的環境變數
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is required');
  console.error('請在 Vercel 環境變數中設定:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=https://rjfpddvihfolmmeqcrwk.supabase.co');
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required. Please set it in Vercel environment variables.');
}

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
  console.error('請在 Vercel 環境變數中設定:');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required. Please set it in Vercel environment variables.');
}

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required');
  console.error('請在 Vercel 環境變數中設定:');
  console.error('SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required. Please set it in Vercel environment variables.');
}

console.log('✅ Supabase 環境變數已正確設定');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 服務端 Supabase 客戶端（用於後台管理）
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);