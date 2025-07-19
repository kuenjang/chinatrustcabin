-- 檢查現有資料庫結構
-- 執行這個查詢來查看你目前的資料表

-- 1. 查看所有資料表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. 查看 orders 資料表結構（如果存在）
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- 3. 查看是否有 order_channels 資料表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'order_channels';

-- 4. 查看是否有 queue_numbers 資料表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'queue_numbers';

-- 5. 查看是否有 daily_counters 資料表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'daily_counters'; 